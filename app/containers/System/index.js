import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import { System as SystemPage } from '@tip-wlan/wlan-cloud-ui-library';

import Manufacturer from 'containers/System/containers/Manufacturer';

const System = () => {
  const { path } = useRouteMatch();

  return (
    <SystemPage>
      <Switch>
        <Route exact path={`${path}/manufacturer`} component={Manufacturer} />
      </Switch>
    </SystemPage>
  );
};

export default System;
