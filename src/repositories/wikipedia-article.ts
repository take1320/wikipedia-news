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

export const update = async (
  value: Partial<WikipediaArticle>,
): Promise<void> => {
  if (!value.id) throw new Error();
  const current = await findById(value.id);

  const db = firebase.firestore();
  await db
    .collection(collectionName.wikipediaArticles)
    .doc(value.id)
    .set({
      ...current,
      ...value,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    } as WikipediaArticle);
};
