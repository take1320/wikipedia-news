import * as functions from 'firebase-functions';
import admin from 'firebase-admin';

import {
  updateWikipediaWord,
  fetchNotSearchedWord,
} from '../firestore-admin/wikipedia-word';

import { WikipediaWord } from '../services/wikipedia-news/models/wikipedia-word';
import { fetchContentByTitle } from '../services/wikipedia-api/wikipedia-api';

module.exports = functions
  .region('asia-northeast1')
  .https.onRequest(async (req, res) => {
    console.log('--- strat associateWords');

    const db = admin.firestore();

    // 処理対象となる単語の取得
    const notSearchedWords = await fetchNotSearchedWord(db);

    for await (const word of notSearchedWords) {
      console.log('--- --- word.id: ' + word.id);
      const wikipediaContent = await fetchContentByTitle(word.id);

      const updateWord: WikipediaWord =
        wikipediaContent.query === undefined ||
        wikipediaContent.query.pages === undefined ||
        wikipediaContent.query.pages[0] === undefined ||
        (wikipediaContent.query.pages[0].missing !== undefined &&
          wikipediaContent.query.pages[0].missing === true) ||
        (wikipediaContent.query.pages[0].extract !== undefined &&
          wikipediaContent.query.pages[0].extract === '')
          ? {
              ...word,
              isSearched: true,
            }
          : {
              ...word,
              title: wikipediaContent.query.pages[0].title,
              url: wikipediaContent.query.pages[0].fullurl,
              isSearched: true,
            };

      await updateWikipediaWord(db, updateWord);
      await sleep();
    }

    res.send('hoge');
    console.log('--- end associateWords');
  });

const sleep = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));
