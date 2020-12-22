import { firestore } from 'firebase-admin';
import { Publisher } from './publisher';

export type HeadlineArticle = {
  id: string;
  title: string;
  url: string;
  publisherRef: firestore.DocumentReference<Publisher>;
  // TODO:命名はpublisherに変更予定
  testPublisher: Publisher;
  hasDetail: boolean;
  createdAt: firestore.Timestamp | null;
  updatedAt: firestore.Timestamp | null;
};
