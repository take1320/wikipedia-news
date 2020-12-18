import { firestore } from 'firebase-admin';

export type Publisher = {
  id?: string;
  name: string;
  url: string;
  selector: string | null;
  createdAt: firestore.Timestamp | null;
  updatedAt: firestore.Timestamp | null;
};
