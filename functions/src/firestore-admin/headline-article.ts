import admin from 'firebase-admin';

import { collectionName } from '../services/wikipedia-news/constants';
import { HeadlineArticle } from '../services/wikipedia-news/models/headline-articles';

export const bulkCreate = async (
  db: admin.firestore.Firestore,
  articles: HeadlineArticle[],
): Promise<void> => {
  const articlesRef = db.collection(collectionName.headlineArticles);

  for await (const article of articles) {
    await articlesRef.doc(article.id).set({
      ...article,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
};

export const findNoDetails = async (
  db: admin.firestore.Firestore,
): Promise<HeadlineArticle[]> => {
  const snap = await db
    .collection(collectionName.headlineArticles)
    .where('hasDetail', '==', false)
    .orderBy('createdAt', 'desc')
    .limit(30)
    .get();

  const articles: HeadlineArticle[] = [];
  snap.forEach((doc) => {
    articles.push(doc.data() as HeadlineArticle);
  });

  console.log('articles.length:' + articles.length);

  return articles;
};

export const getRefById = (
  db: admin.firestore.Firestore,
  id: string,
): admin.firestore.DocumentReference<HeadlineArticle> => {
  return db
    .collection(collectionName.headlineArticles)
    .doc(id) as admin.firestore.DocumentReference<HeadlineArticle>;
};

export const findById = async (
  db: admin.firestore.Firestore,
  id: string,
): Promise<HeadlineArticle> => {
  const snap = await db
    .collection(collectionName.headlineArticles)
    .doc(id)
    .get();
  const result = snap.data() as HeadlineArticle;

  if (result === undefined) throw new Error('id not found.');

  return result;
};

export const updateHasDetail = async (
  db: admin.firestore.Firestore,
  id: string,
  hasDetail: boolean,
): Promise<void> => {
  const currentValue = await findById(db, id);

  await db
    .collection(collectionName.headlineArticles)
    .doc(id)
    .set({
      ...currentValue,
      hasDetail,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    } as HeadlineArticle);
};
