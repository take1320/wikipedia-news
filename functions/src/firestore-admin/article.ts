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
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    count += 1;
  }

  return count;
};

export const fetchEmptyDetailArticles = async (
  db: admin.firestore.Firestore,
): Promise<Article[]> => {
  const snap = await db
    .collection(collectionName.articles)
    .where('hasDetail', '==', false)
    .limit(2)
    .get();

  const articles: Article[] = [];
  snap.forEach((doc) => {
    articles.push(doc.data() as Article);
  });

  console.log('articles.length:' + articles.length);

  return articles;
};
