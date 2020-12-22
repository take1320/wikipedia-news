import { firestore } from 'firebase-admin';

import { collectionName } from '../services/wikipedia-news/constants';
import { Publisher } from '../services/wikipedia-news/models/publisher';

export const bulkCreate = async (
  db: firestore.Firestore,
  publishers: Publisher[],
): Promise<void> => {
  const publishersRef = db.collection(collectionName.publishers);
  const query = await publishersRef.get();
  const existingPublishers = query.docs.map((doc) => doc.data() as Publisher);

  for await (const publisher of publishers) {
    if (existingPublishers.some((p) => p.name === publisher.name)) {
      continue;
    }

    await publishersRef.doc(publisher.name).set({
      ...publisher,
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
  }
};

export const findById = async (
  db: firestore.Firestore,
  id: string,
): Promise<Publisher> => {
  const snap = await db.collection(collectionName.publishers).doc(id).get();
  const result = snap.data() as Publisher;

  if (result === undefined) throw new Error('id not found.');

  return result;
};
