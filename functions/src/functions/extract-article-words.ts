import * as functions from 'firebase-functions';
import admin from 'firebase-admin';

import {
  saveArticleDetails,
  fetchEmptyWordsArticleDetails,
} from '../firestore-admin/article-detail';
import { saveArticleWords } from '../firestore-admin/article-word';
import { saveWikipediaWords } from '../firestore-admin/wikipedia-word';

import { extractWords } from '../services/w-news/article';
import { WikipediaWord } from '../services/w-news/models/wikipedia-word';

module.exports = functions
  .region('asia-northeast1')
  .https.onRequest(async (req, res) => {
    console.log('--- strat articleExtractWords');

    const db = admin.firestore();

    // 単語分割
    const emptyWordsArticleDetails = await fetchEmptyWordsArticleDetails(db);

    for await (const detail of emptyWordsArticleDetails) {
      console.log('--- --- detail.title: ' + detail.title);
      const words = await extractWords(detail);
      await saveWikipediaWords(
        db,
        words.map(
          (w) =>
            ({
              id: w.id,
              title: null,
              url: null,
              isSearched: false,
            } as WikipediaWord),
        ),
      );
      await saveArticleWords(db, detail, words);
      await saveArticleDetails(db, [
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
