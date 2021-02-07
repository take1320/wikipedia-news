import firebase from 'firebase/app';

import { User, blankUser } from './models/user';
import { collectionName } from './constants';
import * as referencedWikipediaArticleRepository from 'repositories/referenced-wikipedia-article';

export const writeUser = async (
  db: firebase.firestore.Firestore,
  firebaseUser: firebase.User,
) => {
  const id = firebaseUser.uid;

  let theUser: User | null = null;
  const batch = db.batch();
  const userDoc = await db.collection(collectionName.users).doc(id).get();

  if (userDoc.exists) {
    const user = userDoc.data() as User;
    theUser = { ...user, id: userDoc.id };
  } else {
    const name = '匿名ユーザ';
    const user: User = {
      ...blankUser,
      id,
      name,
    };

    batch.set(userDoc.ref, {
      ...user,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    theUser = { ...user, id: userDoc.id };
  }

  await batch.commit();

  return theUser;
};

export const findUser = async (
  db: firebase.firestore.Firestore,
  id: string,
) => {
  let theUser: User | null = null;
  const userDoc = await db.collection(collectionName.users).doc(id).get();

  if (userDoc.exists) {
    const user = userDoc.data() as User;
    theUser = { ...user, id: userDoc.id };
  }

  return theUser;
};

export const referenceWikipedia = async (
  userId: string,
  wikipediaArticleId: string,
): Promise<void> => {
  await referencedWikipediaArticleRepository.create(userId, wikipediaArticleId);
};
