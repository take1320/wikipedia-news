import * as functions from 'firebase-functions';
import admin from 'firebase-admin';

import { collectionName } from './services/w-news/constants';

admin.initializeApp();

export const publishers = functions
  .region('asia-northeast1')
  .https.onRequest(async (req, res) => {
    const data = { hoge: 'fuga' };
    res.send({ data });
  });

export const articles = functions
  .region('asia-northeast1')
  .https.onRequest(async (req, res) => {
    const snap = await admin
      .firestore()
      .collection(collectionName.articles)
      .get();
    const data = snap.docs.map((doc) => doc.data());
    res.send({ data });
  });
