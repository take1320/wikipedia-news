import firebase from 'firebase/app';
import { collectionName } from 'services/wikipedia-news/constants';
import { NewsArticle } from 'services/wikipedia-news/models/news-article';

export const findById = async (id: string): Promise<NewsArticle> => {
  const db = firebase.firestore();

  const snap = await db.collection(collectionName.newsArticles).doc(id).get();
  const model = snap.data() as NewsArticle;
  if (model === undefined) throw new Error('data not found.');

  return model;
};
