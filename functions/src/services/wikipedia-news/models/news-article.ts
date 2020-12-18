import { firestore } from 'firebase-admin';
import { Publisher } from './publisher';
import { HeadlineArticle } from './headline-articles';

export type NewsArticle = {
  id: string;
  title: string;
  text: string;
  rawText: string | null;
  url: string;
  article: firestore.DocumentReference<HeadlineArticle>;
  publisher: firestore.DocumentReference<Publisher>;
  wordExtracted: boolean;
  wordAssociated: boolean;
  createdAt: firestore.Timestamp | null;
  updatedAt: firestore.Timestamp | null;
};
