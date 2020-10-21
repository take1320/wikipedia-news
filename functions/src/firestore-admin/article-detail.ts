import admin from 'firebase-admin';

import { collectionName } from '../services/wikipedia-news/constants';
import { ArticleDetail } from '../services/wikipedia-news/models/article-detail';

export const bulkCreate = async (
  db: admin.firestore.Firestore,
  articleDetails: ArticleDetail[],
): Promise<void> => {
  const articleDetailsRef = db.collection(collectionName.articleDetails);

  for await (const articleDetail of articleDetails) {
    const id = articleDetail.id ?? articleDetailsRef.doc().id;

    await articleDetailsRef.doc(id).set({
      ...articleDetail,
      id: id,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
};

export const findNotWordExtracted = async (
  db: admin.firestore.Firestore,
): Promise<ArticleDetail[]> => {
  const snap = await db
    .collection(collectionName.articleDetails)
    .where('wordExtracted', '==', false)
    .orderBy('createdAt', 'desc')
    .limit(30)
    .get();

  const articleDetails: ArticleDetail[] = [];
  snap.forEach((doc) => {
    articleDetails.push(doc.data() as ArticleDetail);
  });

  return articleDetails;
};
