import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';

import { FirebaseContext, UserContext } from './contexts';
import { writeUser, findUser } from './services/wikipedia-news/users';
import { User } from './services/wikipedia-news/models/user';

const FirebaseApp: React.FC = ({ children }) => {
  console.log('FirebaseApp');
  const db = firebase.firestore();
  const auth = firebase.auth();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    console.log('useEffect!');
    firebase.auth().signInAnonymously();
    firebase.auth().onAuthStateChanged(async (firebaseUser) => {
      console.log('firebaseUser?.uid:' + firebaseUser?.uid);
      if (firebaseUser && user === null) {
        const currentUser = await findUser(db, firebaseUser.uid);
        if (currentUser) {
          setUser(currentUser);
        } else {
          const newUser = await writeUser(db, firebaseUser);
          setUser(newUser);
        }
      }
    });
  });

  return (
    <FirebaseContext.Provider value={{ auth, db }}>
      <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
    </FirebaseContext.Provider>
  );
};

export default FirebaseApp;
