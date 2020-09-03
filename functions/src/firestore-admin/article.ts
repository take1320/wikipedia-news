import admin from 'firebase-admin';

import { collectionName } from '../services/w-news/constants';
import { Article } from '../services/w-news/models/article';

export const saveArticles = async (
  db: admin.firestore.Firestore,
  articles: Article[],
): Promise<number> => {
  const articlesRef = db.collection(collectionName.articles);
  let count = 0;

  for await (const article of articles) {
    await articlesRef.doc().set({
      ...article,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.Timestamp.fromDate(new Date(0)),
    });
    // MEMO: FieldValue と Timestampの違いは何？

    count += 1;
  }

  return count;
};
