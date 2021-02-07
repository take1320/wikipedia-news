import firebase from 'firebase/app';
import { collectionName } from 'services/wikipedia-news/constants';
import { WikipediaArticle } from 'services/wikipedia-news/models/wikipedia-article';

export const findById = async (id: string): Promise<WikipediaArticle> => {
  const db = firebase.firestore();

  const snap = await db
    .collection(collectionName.wikipediaArticles)
    .doc(id)
    .get();
  const model = snap.data() as WikipediaArticle;
  if (model === undefined) throw new Error('data not found.');

  return model;
};
