import React, { FC, useContext, useRef } from 'react';
import { Switch, Route, Redirect } from 'react-router';
import { FirebaseContext } from 'contexts';

import BasicHeader from 'components/common/header/BasicHeader';
import BasicFooter from 'components/common/footer/BasicFooter';
import paths from 'paths';
import Home from 'containers/Home/Articles';
import Fuga from 'components/Fuga';

const App: FC = () => {
  const firebaseRef = useRef(useContext(FirebaseContext));

  const { db } = firebaseRef.current;
  if (!db) throw new Error('irestore is not initialized');

  return (
    <div>
      <BasicHeader />
      <Switch>
        <Route path={paths.home} component={Home} exact />
        <Route path={paths.fuga} component={Fuga} exact />
        <Redirect to={paths.home} />
      </Switch>
      <BasicFooter />
    </div>
  );
};

export default App;
