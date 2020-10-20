import * as functions from 'firebase-functions';
import admin from 'firebase-admin';

import {
  saveArticleDetails,
  fetchArticleDetails,
} from '../firestore-admin/article-detail';
import { saveArticleWords } from '../firestore-admin/article-word';

import { extractWords } from '../services/w-news/article';

module.exports = functions
  .region('asia-northeast1')
  .https.onRequest(async (req, res) => {
    const db = admin.firestore();
    const id = '3dUDCuYnGnKkpg7h3f3D';

    // 単語分割
    const articleDetails = await fetchArticleDetails(db, id);
    console.log('fetchArticleDetails:' + articleDetails.length);

    for await (const detail of articleDetails) {
      const words = await extractWords(detail);
      await saveArticleWords(db, detail, words);
    }
    // 単語抽出済みに更新
    await saveArticleDetails(
      db,
      articleDetails.map((detail) => ({
        ...detail,
        wordExtracted: true,
      })),
    );

    console.log('start');
    console.log(new Date());
    await sleep(2000);

    console.log('end');
    console.log(new Date());

    res.send('fuga');
  });

const sleep = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));
