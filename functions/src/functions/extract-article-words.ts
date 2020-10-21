import * as functions from 'firebase-functions';
import admin from 'firebase-admin';

import * as articleDetailStore from '../firestore-admin/article-detail';
import * as articleWordStore from '../firestore-admin/article-word';
import * as wikipediaWordStore from '../firestore-admin/wikipedia-word';
import { extractWords } from '../services/wikipedia-news/article';
import { WikipediaWord } from '../services/wikipedia-news/models/wikipedia-word';

module.exports = functions
  .region('asia-northeast1')
  .https.onRequest(async (req, res) => {
    const db = admin.firestore();

    const details = await articleDetailStore.findNotWordExtracted(db);
    for await (const detail of details) {
      console.log('--- --- detail.title: ' + detail.title);
      const words = await extractWords(detail);
      const wikipediaWords = words.map(
        (w) =>
          ({
            id: w.id,
            title: null,
            url: null,
            length: null,
            isSearched: false,
          } as WikipediaWord),
      );

      await wikipediaWordStore.builCreate(db, wikipediaWords);
      await articleWordStore.bulkCreate(db, detail, words);
      await articleDetailStore.bulkCreate(db, [
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
