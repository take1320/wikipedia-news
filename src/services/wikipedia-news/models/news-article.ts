import { firestore } from 'firebase/app';
import { HeadlineArticle } from './headline-articles';

export type NewsArticle = {
  id: string;
  title: string;
  text: string;
  rawText: string | null;
  url: string;
  headlineArticle: HeadlineArticle;
  wordExtracted: boolean;
  wordAssociated: boolean;
  createdAt: firestore.Timestamp | null;
  updatedAt: firestore.Timestamp | null;
};
