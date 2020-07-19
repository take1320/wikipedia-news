import { createContext } from 'react';
import firebase from 'firebase';

type FirebaseContextValue = {
  db: firebase.firestore.Firestore | null;
};

export const HogeContext = createContext<string>('hoge');

export const FirebaseContext = createContext<FirebaseContextValue>({
  db: null,
});
