import { firestore } from 'firebase-admin';

export type ArticleWord = {
  id: string;
  createdAt: firestore.Timestamp | null;
  updatedAt: firestore.Timestamp | null;
};
