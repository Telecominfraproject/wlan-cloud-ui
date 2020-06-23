import React, { useMemo, useContext, useState } from 'react';
import { useLocation, Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import { Alert, notification } from 'antd';
import _ from 'lodash';
import { Network as NetworkPage, PopoverMenu, Loading } from '@tip-wlan/wlan-cloud-ui-library';

import AccessPointDetails from 'containers/Network/containers/AccessPointDetails';
import AccessPoints from 'containers/Network/containers/AccessPoints';
import ClientDevices from 'containers/Network/containers/ClientDevices';
import ClientDeviceDetails from 'containers/Network/containers/ClientDeviceDetails';
import BulkEditAccessPoints from 'containers/Network/containers/BulkEditAccessPoints';

import UserContext from 'contexts/UserContext';
import { GET_ALL_LOCATIONS, GET_LOCATION } from 'graphql/queries';
import { CREATE_LOCATION, UPDATE_LOCATION, DELETE_LOCATION } from 'graphql/mutations';

const Network = () => {
  const { path } = useRouteMatch();
  const { customerId } = useContext(UserContext);
  const location = useLocation();
  const { loading, error, refetch, data } = useQuery(GET_ALL_LOCATIONS, {
    variables: { customerId },
  });

  const [getLocation, { data: selectedLocation }] = useLazyQuery(GET_LOCATION);
  const [createLocation] = useMutation(CREATE_LOCATION);
  const [updateLocation] = useMutation(UPDATE_LOCATION);
  const [deleteLocation] = useMutation(DELETE_LOCATION);
  const [checkedLocations, setCheckedLocations] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [addModal, setAddModal] = useState(false);

  const handleGetSingleLocation = id => {
    getLocation({
      variables: { id },
    });
  };

  const formatLocationListForTree = (list = []) => {
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
        title: (
          <PopoverMenu
            locationId={c.id}
            locationType={c.locationType}
            setAddModal={setAddModal}
            setEditModal={setEditModal}
            setDeleteModal={setDeleteModal}
          >
            {c.name}
          </PopoverMenu>
        ),
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
        title: (
          <PopoverMenu locationType="NETWORK" setAddModal={setAddModal}>
            Network
          </PopoverMenu>
        ),
        id: 0,
        value: '0',
        key: 0,
        children: unflatten(list),
      },
    ];
  };

  const handleAddLocation = (name, parentId, locationType) => {
    setAddModal(false);
    createLocation({
      variables: {
        locationType,
        customerId,
        parentId,
        name,
      },
    })
      .then(() => {
        notification.success({
          message: 'Success',
          description: 'Location successfully added.',
        });
        refetch();
      })
      .catch(() =>
        notification.error({
          message: 'Error',
          description: 'Location could not be added.',
        })
      );
  };

  const handleEditLocation = (id, parentId, name, locationType, lastModifiedTimestamp) => {
    setEditModal(false);
    updateLocation({
      variables: {
        customerId,
        id,
        parentId,
        name,
        locationType,
        lastModifiedTimestamp,
      },
    })
      .then(() => {
        notification.success({
          message: 'Success',
          description: 'Location successfully edited.',
        });
        refetch();
      })
      .catch(() =>
        notification.error({
          message: 'Error',
          description: 'Location could not be edited.',
        })
      );
  };

  const handleDeleteLocation = id => {
    setDeleteModal(false);
    deleteLocation({ variables: { id } })
      .then(() => {
        notification.success({
          message: 'Success',
          description: 'Location successfully deleted.',
        });
        refetch();
      })
      .catch(() =>
        notification.error({
          message: 'Error',
          description: 'Location could not be deleted.',
        })
      );
  };

  const onSelect = (selectedKeys, info) => {
    const { id } = info.node;
    handleGetSingleLocation(id);
  };

  const onCheck = checkedKeys => {
    setCheckedLocations(checkedKeys);
  };

  const locationsTree = useMemo(
    () => formatLocationListForTree(data && data.getAllLocations)[0].children,
    [data]
  );

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
      selectedLocation={selectedLocation && selectedLocation.getLocation}
      addModal={addModal}
      editModal={editModal}
      deleteModal={deleteModal}
      setAddModal={setAddModal}
      setEditModal={setEditModal}
      setDeleteModal={setDeleteModal}
      onAddLocation={handleAddLocation}
      onEditLocation={handleEditLocation}
      onDeleteLocation={handleDeleteLocation}
    >
      <Switch>
        <Route
          exact
          path={`${path}/access-points/bulk-edit/:id`}
          render={props => <BulkEditAccessPoints {...props} />}
        />
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
