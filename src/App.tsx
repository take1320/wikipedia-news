import React, { FC } from 'react';
import { Switch, Route, Redirect } from 'react-router';
import BasicHeader from 'components/common/header/BasicHeader';
import BasicFooter from 'components/common/footer/BasicFooter';
import paths from 'paths';
import Home from 'containers/Home/Articles';
import Fuga from 'components/Fuga';

const App: FC = () => (
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

export default App;
