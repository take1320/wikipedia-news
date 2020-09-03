import { firestore } from 'firebase-admin';

export type Publisher = {
  id?: string;
  name: string;
  url: string;
  createdAt: firestore.Timestamp | null;
  updatedAt: firestore.Timestamp | null;
};
