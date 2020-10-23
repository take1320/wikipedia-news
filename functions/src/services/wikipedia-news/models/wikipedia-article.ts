import { firestore } from 'firebase-admin';

export type WikipediaArticle = {
  id: string;
  title: string | null;
  url: string | null;
  length: number | null;
  summary: string | null;
  isSearched: boolean;
  createdAt: firestore.Timestamp | null;
  updatedAt: firestore.Timestamp | null;
};
