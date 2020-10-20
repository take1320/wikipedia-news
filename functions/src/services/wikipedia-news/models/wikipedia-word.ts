import { firestore } from 'firebase-admin';

export type WikipediaWord = {
  id: string;
  title: string | null;
  url: string | null;
  isSearched: boolean;
  createdAt: firestore.Timestamp | null;
  updatedAt: firestore.Timestamp | null;
};
