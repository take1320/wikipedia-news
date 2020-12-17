import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';

import { FirebaseContext, UserContext } from './contexts';

const FirebaseApp: React.FC = ({ children }) => {
  console.log('FirebaseApp');
  const db = firebase.firestore();
  const auth = firebase.auth();

  // eslint-disable-next-line @typescript-eslint/ban-types
  const [user] = useState<Object | null>(null);

  // TODO: ユーザ情報登録対応
  // const [user, setUser] = useState<Object | null>(null);

  useEffect(() => {
    console.log('useEffect!');
    firebase.auth().signInAnonymously();
    firebase.auth().onAuthStateChanged(async (firebaseUser) => {
      console.log('firebaseUser?.uid:' + firebaseUser?.uid);
      if (firebaseUser) {
        console.log('setUser done!!');

        // TODO: ユーザ情報登録対応
        // setUser(user);
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
