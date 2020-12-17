import { createContext } from 'react';
import firebase from 'firebase';

export const HogeContext = createContext<string>('hoge');

type FirebaseContextValue = {
  auth: firebase.auth.Auth | null;
  db: firebase.firestore.Firestore | null;
};

export const FirebaseContext = createContext<FirebaseContextValue>({
  auth: null,
  db: null,
});

type UserContextValue = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  user: Object | null;
};

export const UserContext = createContext<UserContextValue>({
  user: null,
});
