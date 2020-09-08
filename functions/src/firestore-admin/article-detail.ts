import admin from 'firebase-admin';

import { collectionName } from '../services/w-news/constants';
import { ArticleDetail } from '../services/w-news/models/article-detail';

export const saveArticleDetails = async (
  db: admin.firestore.Firestore,
  articleDetails: ArticleDetail[],
): Promise<number> => {
  const articleDetailsRef = db.collection(collectionName.articleDetails);
  let count = 0;

  for await (const articleDetail of articleDetails) {
    await articleDetailsRef.doc().set({
      ...articleDetail,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    count += 1;
  }

  return count;
};
