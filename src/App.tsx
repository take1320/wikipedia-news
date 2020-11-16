import React, { FC } from 'react';
import { Switch, Route, Redirect } from 'react-router';
import paths from 'paths';
import Home from 'containers/Home/NewsArticles';
import Fuga from 'components/Fuga';

const App: FC = () => (
  <div>
    <Switch>
      <Route path={paths.home} component={Home} exact />
      <Route path={paths.fuga} component={Fuga} exact />
      <Redirect to={paths.home} />
    </Switch>
  </div>
);

export default App;
