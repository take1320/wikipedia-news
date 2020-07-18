import { firestore } from 'firebase/app';

export type Article = {
  id?: string;
  title: string;
  url: string;
  createdAt: firestore.Timestamp | null;
  updatedAt: firestore.Timestamp | null;
};
