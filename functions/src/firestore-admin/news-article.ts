import admin from 'firebase-admin';

import { collectionName } from '../services/wikipedia-news/constants';
import { NewsArticle } from '../services/wikipedia-news/models/news-article';

export const bulkCreate = async (
  db: admin.firestore.Firestore,
  newsArticles: NewsArticle[],
): Promise<void> => {
  const newsArticlesRef = db.collection(collectionName.newsArticles);

  for await (const newsArticle of newsArticles) {
    const id = newsArticle.id ?? newsArticlesRef.doc().id;

    await newsArticlesRef.doc(id).set({
      ...newsArticle,
      id: id,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
};

export const update = async (
  db: admin.firestore.Firestore,
  value: NewsArticle,
): Promise<void> => {
  const currentValue = await findById(db, value.id);

  await db
    .collection(collectionName.newsArticles)
    .doc(value.id)
    .set({
      ...currentValue,
      ...value,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
};

export const findNotWordExtracted = async (
  db: admin.firestore.Firestore,
): Promise<NewsArticle[]> => {
  const snap = await db
    .collection(collectionName.newsArticles)
    .where('wordExtracted', '==', false)
    .orderBy('createdAt', 'asc')
    .limit(30)
    .get();

  const newsArticles: NewsArticle[] = [];
  snap.forEach((doc) => {
    newsArticles.push(doc.data() as NewsArticle);
  });

  return newsArticles;
};

export const findById = async (
  db: admin.firestore.Firestore,
  id: string,
): Promise<NewsArticle> => {
  const snap = await db.collection(collectionName.newsArticles).doc(id).get();
  const result = snap.data() as NewsArticle;

  if (result === undefined) throw new Error('id not found.');

  return result;
};

export const findNotWordAssociated = async (
  db: admin.firestore.Firestore,
): Promise<NewsArticle[]> => {
  const snap = await db
    .collection(collectionName.newsArticles)
    .where('wordAssociated', '==', false)
    .orderBy('createdAt', 'asc')
    .limit(30)
    .get();

  const newsArticles: NewsArticle[] = [];
  snap.forEach((doc) => {
    newsArticles.push(doc.data() as NewsArticle);
  });

  return newsArticles;
};
