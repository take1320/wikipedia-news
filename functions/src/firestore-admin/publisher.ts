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

export const findPublisherRef = (
  db: firestore.Firestore,
  name: string,
): firestore.DocumentReference<Publisher> => {
  return db
    .collection(collectionName.publishers)
    .doc(name) as firestore.DocumentReference<Publisher>;
};
