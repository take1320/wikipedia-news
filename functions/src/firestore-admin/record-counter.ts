import admin from 'firebase-admin';
import { collectionName } from '../services/wikipedia-news/constants';

export const addCounter = async (
  db: admin.firestore.Firestore,
  collName: string,
  count = 1,
): Promise<void> => {
  const doc = db.collection(collectionName.docCounters).doc(collName);
  await doc.set(
    {
      count: admin.firestore.FieldValue.increment(count),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true },
  );
};

export const findDocCountersRef = (
  db: admin.firestore.Firestore,
  collName: string,
): admin.firestore.DocumentReference => {
  return db
    .collection(collectionName.docCounters)
    .doc(collName) as admin.firestore.DocumentReference;
};
