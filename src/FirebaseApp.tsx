import React from 'react';
import firebase from 'firebase/app';

import { FirebaseContext } from './contexts';

const FirebaseApp: React.FC = ({ children }) => {
  const db = firebase.firestore();

  return (
    <FirebaseContext.Provider value={{ db }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseApp;
