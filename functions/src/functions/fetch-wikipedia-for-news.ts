import * as functions from 'firebase-functions';
import admin from 'firebase-admin';

import * as wikipediaArticleStore from '../firestore-admin/wikipedia-article';
import * as articleWordStore from '../firestore-admin/article-word';
import * as newsArticleStore from '../firestore-admin/news-article';
import { organizeContent } from '../services/wikipedia-api/content';
import { WikipediaArticle } from '../services/wikipedia-news/models/wikipedia-article';
import { fetchContentByTitle } from '../services/wikipedia-api/wikipedia-api';
import { ArticleWord } from '../services/wikipedia-news/models/article-word';
import { NewsArticle } from '../services/wikipedia-news/models/news-article';
import sleep from '../utils/await-sleep';

module.exports = functions
  .region('asia-northeast1')
  .https.onRequest(async (req, res) => {
    const db = admin.firestore();

    // 取得対象となるニュース記事を取得する。（wikipedia紐付けが未完了の記事）
    const notAssociatedArticles = await newsArticleStore.findNotWordAssociated(
      db,
    );
    console.log('notAssociatedArticles.length:' + notAssociatedArticles.length);

    const notSearchedWords: ArticleWord[] = [];
    // 対象ニュース記事の中から、紐付け未完了の単語を取得する
    for await (const article of notAssociatedArticles) {
      console.log('article.title:' + article.title);
      // TODO: 取得件数について調整が必要?
      const words = await articleWordStore.findByNewsArticleId(db, article.id);
      notSearchedWords.push(...words);
    }

    console.log('notSearchedWords.length:' + notSearchedWords.length);

    for await (const word of notSearchedWords) {
      console.log('word.id:' + word.id);
      const wikipedia = await wikipediaArticleStore.findById(db, word.id);
      const content = await fetchContentByTitle(wikipedia.id);
      const organizedContent = organizeContent(content);

      await wikipediaArticleStore.update(db, {
        ...wikipedia,
        title: organizedContent.title,
        url: organizedContent.fullUrl,
        length: organizedContent.length,
        summary: organizedContent.extract,
        isSearched: true,
      } as WikipediaArticle);

      // wikipediaArticleの情報をarticleWordにも書き込む。
      await articleWordStore.update(db, {
        ...word,
        title: organizedContent.title,
        url: organizedContent.fullUrl,
        length: organizedContent.length,
        summary: organizedContent.extract,
        isAssociated: true,
      } as ArticleWord);

      await sleep();
    }

    // 紐づく記事単語に関連付け未実施が存在しなければ、対象記事を関連付け完了済みに更新する
    const inceptionTargets = await newsArticleStore.findNotWordAssociated(db);
    console.log('inceptionTargets.length:' + inceptionTargets.length);

    // 対象ニュース記事の中から、紐付け未完了の単語を取得する
    for await (const article of inceptionTargets) {
      // TODO: 取得件数について調整が必要?
      const words = await articleWordStore.findByNewsArticleId(db, article.id);
      console.log(
        'article.title:' + article.title + ' is word.length = ' + words.length,
      );
      if (words.length == 0) {
        console.log('wordAssociated set: true');
        await newsArticleStore.update(db, {
          ...article,
          wordAssociated: true,
        } as NewsArticle);
      }
    }

    res.send('ok');
  });
