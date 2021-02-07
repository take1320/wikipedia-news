import firebase from 'firebase/app';
import { collectionName } from 'services/wikipedia-news/constants';
import { WikipediaArticle as RawWikipediaArticle } from 'services/wikipedia-news/models/wikipedia-article';
import { WikipediaArticle } from 'domains/models/wikipedia-articles/wikipedia-article';

const toEntity = (rawData: RawWikipediaArticle): WikipediaArticle => {
  return new WikipediaArticle({
    ...rawData,
    updatedAt: rawData.updatedAt?.toDate() ?? null,
    createdAt: rawData.createdAt?.toDate() ?? null,
  });
};

export const findById = async (id: string): Promise<WikipediaArticle> => {
  const db = firebase.firestore();

  const snap = await db
    .collection(collectionName.wikipediaArticles)
    .doc(id)
    .get();
  const rawData = snap.data() as RawWikipediaArticle;
  if (rawData === undefined) throw new Error('data not found.');

  return toEntity(rawData);
};
