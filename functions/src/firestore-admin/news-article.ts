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

export const findNotWordExtracted = async (
  db: admin.firestore.Firestore,
): Promise<NewsArticle[]> => {
  const snap = await db
    .collection(collectionName.newsArticles)
    .where('wordExtracted', '==', false)
    .orderBy('createdAt', 'desc')
    .limit(30)
    .get();

  const newsArticles: NewsArticle[] = [];
  snap.forEach((doc) => {
    newsArticles.push(doc.data() as NewsArticle);
  });

  return newsArticles;
};
