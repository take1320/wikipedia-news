import * as functions from 'firebase-functions';
import admin from 'firebase-admin';

import * as wikipediaArticleStore from '../firestore-admin/wikipedia-article';
import { organizeContent } from '../services/wikipedia-api/content';
import { WikipediaArticle } from '../services/wikipedia-news/models/wikipedia-article';
import { fetchContentByTitle } from '../services/wikipedia-api/wikipedia-api';
import sleep from '../utils/await-sleep';

module.exports = functions
  .region('asia-northeast1')
  .https.onRequest(async (req, res) => {
    console.log('--- strat associateWords');

    const db = admin.firestore();

    // 処理対象となる単語の取得
    const notSearchedWords = await wikipediaArticleStore.findNotSearched(db);

    for await (const word of notSearchedWords) {
      console.log('--- --- word.id: ' + word.id);
      const wikipediaContent = await fetchContentByTitle(word.id);
      const organizedContent = organizeContent(wikipediaContent);
      const updateWord: WikipediaArticle = {
        ...word,
        title: organizedContent.title,
        url: organizedContent.fullUrl,
        length: organizedContent.length,
        summary: organizedContent.extract,
        isSearched: true,
      };

      await wikipediaArticleStore.update(db, updateWord);
      await sleep();
    }

    res.send('ok');
  });
