import firebase from 'firebase/app';
import { collectionName } from 'services/wikipedia-news/constants';
import { NewsArticle as RawNewsArticle } from 'services/wikipedia-news/models/news-article';
import { NewsArticle } from 'domains/models/news-articles/news-article';

const toEntity = (rawData: RawNewsArticle): NewsArticle => {
  return new NewsArticle({
    ...rawData,
    updatedAt: rawData.updatedAt?.toDate() ?? null,
    createdAt: rawData.createdAt?.toDate() ?? null,
  });
};

export const findById = async (id: string): Promise<NewsArticle> => {
  const db = firebase.firestore();

  const snap = await db.collection(collectionName.newsArticles).doc(id).get();
  const rawData = snap.data() as RawNewsArticle;
  if (rawData === undefined) throw new Error('data not found.');

  return toEntity(rawData);
};
