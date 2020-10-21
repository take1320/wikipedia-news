import admin from 'firebase-admin';

import { collectionName } from '../services/wikipedia-news/constants';
import { HeadlineArticle } from '../services/wikipedia-news/models/headline-articles';
import { Publisher } from '../services/wikipedia-news/models/publisher';

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

export const hasPublisherSelector = async (
  article: HeadlineArticle,
): Promise<boolean> => {
  const publisher: Publisher = (
    await article.publisher.get()
  ).data() as Publisher;

  return publisher.selector !== null && publisher.selector !== '';
};

export const getRefById = (
  db: admin.firestore.Firestore,
  id: string,
): admin.firestore.DocumentReference<HeadlineArticle> => {
  return db
    .collection(collectionName.headlineArticles)
    .doc(id) as admin.firestore.DocumentReference<HeadlineArticle>;
};
