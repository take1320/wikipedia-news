import { firestore } from 'firebase-admin';

export type ArticleWord = {
  id: string;
  url: string | null;
  createdAt: firestore.Timestamp | null;
  updatedAt: firestore.Timestamp | null;
};
