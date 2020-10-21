import admin from 'firebase-admin';

import { collectionName } from '../services/wikipedia-news/constants';
import { Article } from '../services/wikipedia-news/models/article';
import { Publisher } from '../services/wikipedia-news/models/publisher';

export const bulkCreate = async (
  db: admin.firestore.Firestore,
  articles: Article[],
): Promise<void> => {
  const articlesRef = db.collection(collectionName.articles);

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
): Promise<Article[]> => {
  const snap = await db
    .collection(collectionName.articles)
    .where('hasDetail', '==', false)
    .orderBy('createdAt', 'desc')
    .limit(30)
    .get();

  const articles: Article[] = [];
  snap.forEach((doc) => {
    articles.push(doc.data() as Article);
  });

  console.log('articles.length:' + articles.length);

  return articles;
};

export const hasPublisherSelector = async (
  article: Article,
): Promise<boolean> => {
  const publisher: Publisher = (
    await article.publisher.get()
  ).data() as Publisher;

  return publisher.selector !== null && publisher.selector !== '';
};

export const getRefById = (
  db: admin.firestore.Firestore,
  id: string,
): admin.firestore.DocumentReference<Article> => {
  return db
    .collection(collectionName.articles)
    .doc(id) as admin.firestore.DocumentReference<Article>;
};
