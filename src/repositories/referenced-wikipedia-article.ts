import firebase from 'firebase/app';
import { collectionName } from 'services/wikipedia-news/constants';
import { ReferencedWikipediaArticle } from 'services/wikipedia-news/models/referenced-wikipedia-article';

export const create = async (
  userId: string,
  wikipediaArticleId: string,
): Promise<void> => {
  const db = firebase.firestore();

  const doc = db
    .collection(collectionName.users)
    .doc(userId)
    .collection(collectionName.referencedWikipediaArticles)
    .doc(wikipediaArticleId);

  await doc.set({
    id: wikipediaArticleId,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  } as ReferencedWikipediaArticle);
};
