import { firestore } from 'firebase/app';

export type WikipediaArticle = {
  id: string;
  title: string | null;
  url: string | null;
  length: number | null;
  referencedCount: number | 0;
  summary: string | null;
  isSearched: boolean;
  createdAt: firestore.Timestamp | null;
  updatedAt: firestore.Timestamp | null;
};
