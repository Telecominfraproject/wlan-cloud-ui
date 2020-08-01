import React from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';

import { System as SystemPage } from '@tip-wlan/wlan-cloud-ui-library';

import Manufacturer from 'containers/System/containers/Manufacturer';
import Firmware from 'containers/System/containers/Firmware';
import AutoProvision from 'containers/System/containers/AutoProvision';
import BlockedList from 'containers/System/containers/BlockedList';

const System = () => {
  const { path } = useRouteMatch();

  return (
    <SystemPage>
      <Switch>
        <Route exact path={`${path}/manufacturer`} component={Manufacturer} />
        <Route exact path={`${path}/firmware`} component={Firmware} />
        <Route exact path={`${path}/autoprovision`} component={AutoProvision} />
        <Route exact path={`${path}/blockedlist`} component={BlockedList} />

        <Redirect from={path} to={`${path}/manufacturer`} />
      </Switch>
    </SystemPage>
  );
};

export default System;
