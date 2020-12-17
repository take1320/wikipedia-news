import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import firebase from 'firebase';
import { CookiesProvider } from 'react-cookie';

import './index.css';
import 'semantic-ui-css/semantic.min.css';
import App from './App';

import { HogeContext } from 'contexts';
import * as serviceWorker from './serviceWorker';
import firebaseConfig from './firebase-config';
import FirebaseApp from 'FirebaseApp';

firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <FirebaseApp>
        <CookiesProvider>
          <HogeContext.Provider value="piyo">
            <App />
          </HogeContext.Provider>
        </CookiesProvider>
      </FirebaseApp>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
