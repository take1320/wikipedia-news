import { firestore } from 'firebase/app';

export type ReferencedUser = {
  id: string;
  createdAt: firestore.Timestamp | null;
  updatedAt: firestore.Timestamp | null;
};

export const blankReferencedUser: ReferencedUser = {
  id: '',
  createdAt: null,
  updatedAt: null,
};
