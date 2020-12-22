import * as functions from 'firebase-functions';
import admin from 'firebase-admin';

import sleep from '../await-sleep';
import * as headlineArticleStore from '../firestore-admin/headline-article';
import * as newsArticleStore from '../firestore-admin/news-article';
import { HeadlineArticle } from '../services/wikipedia-news/models/headline-articles';
import {
  crawlNewsArticle,
  extractCrawlableArticles,
} from '../crawlers/article';

module.exports = functions
  .region(functions.config().locale.region)
  .runWith({
    timeoutSeconds: 300,
    memory: '2GB',
  })
  .https.onRequest(async (req, res) => {
    const db = admin.firestore();

    // クローリング可能な記事の絞り込み
    const articles = await headlineArticleStore.findNoDetails(db);
    const crawlableArticles = await extractCrawlableArticles(db, articles);
    console.log('crawlableArticles:' + crawlableArticles.length);

    // ニュース記事を取得する
    const newsArticles = [];
    for await (const crawlableArticle of crawlableArticles) {
      newsArticles.push(await crawlNewsArticle(db, crawlableArticle));
      await sleep(500);
    }
    console.log('newsArticles:' + newsArticles.length);
    await newsArticleStore.bulkCreate(db, newsArticles);

    // hasDetailをtrueに更新する
    const hasDetailArticles = (
      await Promise.all(
        newsArticles.map((newsArticle) => newsArticle.articleRef.get()),
      )
    ).map((article) => ({
      ...(article.data() as HeadlineArticle),
      hasDetail: true,
    }));
    await headlineArticleStore.bulkCreate(db, hasDetailArticles);

    res.send('ok');
  });
