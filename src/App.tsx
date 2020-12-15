import React, { FC } from 'react';
import { Switch, Route, Redirect } from 'react-router';
import { useCookies } from "react-cookie";

import BasicHeader from 'components/common/header/BasicHeader';
import BasicFooter from 'components/common/footer/BasicFooter';
import paths from 'paths';
import Home from 'containers/Home/Articles';
import Fuga from 'components/Fuga';

const App: FC = () => {

  const [cookies, setCookie] = useCookies(['id']);

  const initialize = (id: string) => {
    console.log(id);
  };

  // 初期処理
  if (!cookies.id) {
    const sampleId = 'sample';
    setCookie('id', sampleId, { path: '/' });
    console.log('cookies');
    initialize(sampleId);
  }

  return (
    <div>
      {cookies.name && <h1>Hello {cookies.name}!</h1>}
      <BasicHeader />
      <Switch>
        <Route path={paths.home} component={Home} exact />
        <Route path={paths.fuga} component={Fuga} exact />
        <Redirect to={paths.home} />
      </Switch>
      <BasicFooter />
    </div>
  )
}
  ;

export default App;
