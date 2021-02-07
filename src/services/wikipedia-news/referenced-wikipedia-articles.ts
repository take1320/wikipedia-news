import firebase from 'firebase/app';

import { collectionName } from './constants';
import { ReferencedWikipediaArticle } from './models/referenced-wikipedia-article';

export const findReferencedWikipediaArticles = async (
  db: firebase.firestore.Firestore,
  id: string,
): Promise<ReferencedWikipediaArticle[]> => {
  const snap = await db
    .collection(collectionName.users)
    .doc(id)
    .collection(collectionName.referencedWikipediaArticles)
    .get();

  const referencedList: ReferencedWikipediaArticle[] = [];
  snap.forEach((doc) => {
    referencedList.push(doc.data() as ReferencedWikipediaArticle);
  });

  return referencedList;
};
