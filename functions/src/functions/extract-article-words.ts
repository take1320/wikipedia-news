import * as functions from 'firebase-functions';
import admin from 'firebase-admin';

import * as newsArticleStore from '../firestore-admin/news-article';
import * as articleWordStore from '../firestore-admin/article-word';
import * as wikipediaArticleStore from '../firestore-admin/wikipedia-article';
import { extractWords } from '../services/wikipedia-news/article';
import { WikipediaArticle } from '../services/wikipedia-news/models/wikipedia-article';

module.exports = functions
  .region('asia-northeast1')
  .https.onRequest(async (req, res) => {
    const db = admin.firestore();

    const details = await newsArticleStore.findNotWordExtracted(db);
    for await (const detail of details) {
      console.log('--- --- detail.title: ' + detail.title);
      const words = await extractWords(detail);
      const wikipediaArticles = words.map(
        (w) =>
          ({
            id: w.id,
            title: null,
            url: null,
            length: null,
            summary: null,
            isSearched: false,
          } as WikipediaArticle),
      );

      await wikipediaArticleStore.builCreate(db, wikipediaArticles);
      await articleWordStore.bulkCreate(db, detail, words);
      await newsArticleStore.bulkCreate(db, [
        {
          ...detail,
          wordExtracted: true,
        },
      ]);

      await sleep();
    }

    res.send('hoge');
    console.log('--- end articleExtractWords');
  });

const sleep = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));
