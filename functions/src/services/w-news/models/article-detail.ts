import { firestore } from 'firebase-admin';
import { Publisher } from './publisher';
import { Article } from './article';

export type ArticleDetail = {
  id?: string;
  title: string;
  text: string;
  rawText: string | null;
  url: string;
  article: firestore.DocumentReference<Article>;
  publisher: firestore.DocumentReference<Publisher>;
  wordExtracted: boolean;
  createdAt: firestore.Timestamp | null;
  updatedAt: firestore.Timestamp | null;
};
