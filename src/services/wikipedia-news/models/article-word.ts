import { firestore } from 'firebase/app';

export type ArticleWord = {
  id: string;
  newsArticleId: string;
  title: string | null;
  url: string | null;
  referencedCount: number | 0;
  length: number | null;
  summary: string | null;
  isAssociated: boolean;
  createdAt: firestore.Timestamp | null;
  updatedAt: firestore.Timestamp | null;
};
