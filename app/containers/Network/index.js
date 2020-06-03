import React, { useEffect, useContext, useState } from 'react';
import { useLocation, Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { Alert } from 'antd';
import _ from 'lodash';
import { Network as NetworkPage, Loading } from '@tip-wlan/wlan-cloud-ui-library';

import AccessPointDetails from 'containers/Network/containers/AccessPointDetails';
import AccessPoints from 'containers/Network/containers/AccessPoints';
import ClientDevices from 'containers/Network/containers/ClientDevices';
import ClientDeviceDetails from 'containers/Network/containers/ClientDeviceDetails';
import UserContext from 'contexts/UserContext';
import { GET_ALL_LOCATIONS } from 'graphql/queries';

const Network = () => {
  const { path } = useRouteMatch();
  const { customerId } = useContext(UserContext);
  const location = useLocation();
  const [locationsTree, setLocationsTree] = useState([]);
  const [checkedLocations, setCheckedLocations] = useState([]);
  const [selected, setSelected] = useState(false);

  const { loading, error, data } = useQuery(GET_ALL_LOCATIONS, {
    variables: { customerId },
  });

  const formatLocationListForTree = list => {
    const checkedTreeLocations = [];
    list.forEach(ele => {
      checkedTreeLocations.push(ele.id);
    });
    setCheckedLocations(checkedTreeLocations);

    function unflatten(array, p, t) {
      let tree = typeof t !== 'undefined' ? t : [];
      const parent = typeof p !== 'undefined' ? p : { id: 0 };
      let children = _.filter(array, child => child.parentId === parent.id);
      children = children.map(c => ({
        title: c.name,
        value: `${c.id}`,
        key: c.id,
        ...c,
      }));
      if (!_.isEmpty(children)) {
        if (parent.id === 0) {
          tree = children;
        } else {
          parent.children = children;
        }
        _.each(children, child => unflatten(array, child));
      }
      return tree;
    }
    return [
      {
        title: 'Network',
        value: '0',
        key: 0,
        children: unflatten(list),
      },
    ];
  };

  useEffect(() => {
    if (data && data.getAllLocations) {
      const unflattenData = formatLocationListForTree(data && data.getAllLocations);
      setLocationsTree(unflattenData[0].children);
    }
  }, [data]);

  const onSelect = () => {
    setSelected(!selected);
  };

  const onCheck = checkedKeys => {
    setCheckedLocations(checkedKeys);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Alert message="Error" description="Failed to load locations." type="error" showIcon />;
  }

  return (
    <NetworkPage
      onSelect={onSelect}
      onCheck={onCheck}
      checkedLocations={checkedLocations}
      locations={locationsTree}
      activeTab={location.pathname}
    >
      <Switch>
        <Route
          exact
          path={`${path}/access-points`}
          render={props => <AccessPoints checkedLocations={checkedLocations} {...props} />}
        />
        <Route exact path={`${path}/access-points/:id`} component={AccessPointDetails} />
        <Route
          exact
          path={`${path}/client-devices`}
          render={props => <ClientDevices checkedLocations={checkedLocations} {...props} />}
        />
        <Route exact path={`${path}/client-devices/:id`} component={ClientDeviceDetails} />
        <Redirect from={path} to={`${path}/access-points`} />
      </Switch>
    </NetworkPage>
  );
};

export default Network;
