import { firestore } from 'firebase-admin';

export type ArticleWord = {
  id: string;
  newsArticleId: string;
  title: string | null;
  url: string | null;
  length: number | null;
  summary: string | null;
  isAssociated: boolean;
  createdAt: firestore.Timestamp | null;
  updatedAt: firestore.Timestamp | null;
};
