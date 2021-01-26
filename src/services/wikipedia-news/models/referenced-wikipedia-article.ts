import { firestore } from 'firebase/app';

export type ReferencedWikipediaArticle = {
  id: string;
  createdAt: firestore.Timestamp | null;
  updatedAt: firestore.Timestamp | null;
};

export const blankReferencedWikipediaArticle: ReferencedWikipediaArticle = {
  id: '',
  createdAt: null,
  updatedAt: null,
};
