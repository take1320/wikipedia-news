import { firestore } from 'firebase-admin';
import { Publisher } from './publisher';

export type ArticleDetail = {
  id?: string;
  title: string;
  text: string;
  rawText: string | null;
  url: string;
  publisher: firestore.DocumentReference<Publisher>;
  createdAt: firestore.Timestamp | null;
  updatedAt: firestore.Timestamp | null;
};
