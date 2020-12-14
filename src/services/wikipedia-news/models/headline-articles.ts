import { firestore } from 'firebase/app';
import { Publisher } from './publisher';

export type HeadlineArticle = {
  id: string;
  title: string;
  url: string;
  publisher: firestore.DocumentReference<Publisher>;
  hasDetail: boolean;
  createdAt: firestore.Timestamp | null;
  updatedAt: firestore.Timestamp | null;
};
