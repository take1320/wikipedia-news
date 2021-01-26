import { createContext } from 'react';
import firebase from 'firebase';
import { User } from './services/wikipedia-news/models/user';
import { ReferencedWikipediaArticle } from './services/wikipedia-news/models/referenced-wikipedia-article';

type FirebaseContextValue = {
  auth: firebase.auth.Auth | null;
  db: firebase.firestore.Firestore | null;
};

export const FirebaseContext = createContext<FirebaseContextValue>({
  auth: null,
  db: null,
});

type UserContextValue = {
  user: User | null;
  referencedWikipediaArticles: ReferencedWikipediaArticle[] | [];
};

export const UserContext = createContext<UserContextValue>({
  user: null,
  referencedWikipediaArticles: [],
});
