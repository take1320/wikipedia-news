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
    const id = articleDetail.id ?? articleDetailsRef.doc().id;

    await articleDetailsRef.doc(id).set({
      ...articleDetail,
      id: id,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    count += 1;
  }

  return count;
};

export const fetchEmptyWordsArticleDetails = async (
  db: admin.firestore.Firestore,
): Promise<ArticleDetail[]> => {
  console.log('--- *** start fetchEmptyWordsArticleDetails');

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

  console.log('articleDetails.length:' + articleDetails.length);

  console.log('--- *** end fetchEmptyWordsArticleDetails');
  return articleDetails;
};

export const fetchArticleDetails = async (
  db: admin.firestore.Firestore,
  id: string,
): Promise<ArticleDetail[]> => {
  const snap = await db
    .collection(collectionName.articleDetails)
    .where('id', '==', id)
    .limit(30)
    .get();

  const articleDetails: ArticleDetail[] = [];
  snap.forEach((doc) => {
    articleDetails.push(doc.data() as ArticleDetail);
  });

  console.log('articleDetails.length:' + articleDetails.length);

  return articleDetails;
};
