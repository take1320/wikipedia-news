import { firestore } from 'firebase-admin';

import { collectionName } from '../services/wikipedia-news/constants';
import { Publisher } from '../services/wikipedia-news/models/publisher';

export const savePublishers = async (
  db: firestore.Firestore,
  publishers: Publisher[],
): Promise<number> => {
  const publishersRef = db.collection(collectionName.publishers);
  const query = await publishersRef.get();
  const existingPublishers = query.docs.map((doc) => doc.data() as Publisher);
  let count = 0;

  for await (const publisher of publishers) {
    if (existingPublishers.some((p) => p.name === publisher.name)) {
      continue;
    }

    await publishersRef.doc(publisher.name).set({
      ...publisher,
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });

    count += 1;
  }

  return count;
};

export const findPublisherRef = (
  db: firestore.Firestore,
  name: string,
): firestore.DocumentReference<Publisher> => {
  return db
    .collection(collectionName.publishers)
    .doc(name) as firestore.DocumentReference<Publisher>;
};
