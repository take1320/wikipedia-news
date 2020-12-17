import { firestore } from 'firebase/app';

export type User = {
  id?: string;
  name: string;
  createdAt: firestore.Timestamp | null;
  updatedAt: firestore.Timestamp | null;
};

export const blankUser: User = {
  name: '',
  createdAt: null,
  updatedAt: null,
};
