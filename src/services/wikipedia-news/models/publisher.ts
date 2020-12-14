import { firestore } from 'firebase/app';

export type Publisher = {
  id?: string;
  name: string;
  url: string;
  selector: string | null;
  createdAt: firestore.Timestamp | null;
  updatedAt: firestore.Timestamp | null;
};
