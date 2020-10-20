import { firestore } from 'firebase-admin';
import { Publisher } from './publisher';

export type Article = {
  id: string;
  title: string;
  url: string;
  publisher: firestore.DocumentReference<Publisher>;
  hasDetail: boolean;
  createdAt: firestore.Timestamp | null;
  updatedAt: firestore.Timestamp | null;
};
