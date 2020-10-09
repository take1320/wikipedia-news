import { firestore } from 'firebase-admin';

export type WikipediaWord = {
  id: string;
  createdAt: firestore.Timestamp | null;
  updatedAt: firestore.Timestamp | null;
};
