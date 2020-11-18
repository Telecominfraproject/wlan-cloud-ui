import React, { useMemo, useContext, useState } from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { Alert, notification } from 'antd';
import _ from 'lodash';
import { Network as NetworkPage, PopoverMenu, Loading } from '@tip-wlan/wlan-cloud-ui-library';

import AccessPointDetails from 'containers/Network/containers/AccessPointDetails';
import AccessPoints from 'containers/Network/containers/AccessPoints';
import ClientDevices from 'containers/Network/containers/ClientDevices';
import ClientDeviceDetails from 'containers/Network/containers/ClientDeviceDetails';
import BulkEditAccessPoints from 'containers/Network/containers/BulkEditAccessPoints';

import UserContext from 'contexts/UserContext';
import {
  GET_ALL_LOCATIONS,
  GET_LOCATION,
  GET_ALL_PROFILES,
  FILTER_EQUIPMENT,
} from 'graphql/queries';
import {
  CREATE_LOCATION,
  UPDATE_LOCATION,
  DELETE_LOCATION,
  CREATE_EQUIPMENT,
} from 'graphql/mutations';
import { updateQueryGetAllProfiles } from 'graphql/functions';

const Network = () => {
  const { path } = useRouteMatch();
  const { customerId } = useContext(UserContext);
  const { loading, error, refetch, data } = useQuery(GET_ALL_LOCATIONS, {
    variables: { customerId },
  });
  const { loading: loadingProfile, error: errorProfile, data: apProfiles, fetchMore } = useQuery(
    GET_ALL_PROFILES(),
    {
      variables: { customerId, type: 'equipment_ap' },
    }
  );

  const [getLocation, { data: selectedLocation }] = useLazyQuery(GET_LOCATION);
  const [createLocation] = useMutation(CREATE_LOCATION);
  const [updateLocation] = useMutation(UPDATE_LOCATION);
  const [deleteLocation] = useMutation(DELETE_LOCATION);
  const [checkedLocations, setCheckedLocations] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [apModal, setApModal] = useState(false);

  const [createEquipment] = useMutation(CREATE_EQUIPMENT, {
    refetchQueries: [
      {
        query: FILTER_EQUIPMENT,
        variables: { customerId, locationIds: checkedLocations, equipmentType: 'AP' },
      },
    ],
  });

  const handleGetSingleLocation = id => {
    getLocation({
      variables: { id },
    });
  };

  const formatLocationListForTree = (list = []) => {
    const checkedTreeLocations = ['0'];
    list.forEach(ele => {
      checkedTreeLocations.push(ele.id);
    });
    setCheckedLocations(checkedTreeLocations);

    function unflatten(array, p, t) {
      let tree = typeof t !== 'undefined' ? t : [];
      const parent = typeof p !== 'undefined' ? p : { id: '0' };
      let children = _.filter(array, child => child.parentId === parent.id);
      children = children.map(c => ({
        title: (
          <PopoverMenu
            locationId={c.id}
            locationType={c.locationType}
            setAddModal={setAddModal}
            setEditModal={setEditModal}
            setDeleteModal={setDeleteModal}
            setApModal={setApModal}
          >
            {c.name}
          </PopoverMenu>
        ),
        value: `${c.id}`,
        key: c.id,
        ...c,
      }));
      if (!_.isEmpty(children)) {
        if (parent.id === '0') {
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
          <PopoverMenu locationId="0" locationType="NETWORK" setAddModal={setAddModal}>
            Network
          </PopoverMenu>
        ),
        id: '0',
        key: '0',
        value: '0',
        children: unflatten(list),
      },
    ];
  };

  const handleAddLocation = ({ location }) => {
    setAddModal(false);
    let id;
    let locationType;

    // adding location from root makes selecetedLocation null so we check for that
    if (selectedLocation && selectedLocation.getLocation) {
      id = selectedLocation.getLocation.id;
      locationType = 'SITE';
    } else {
      id = '0';
      locationType = 'COUNTRY';
    }

    createLocation({
      variables: {
        locationType,
        customerId,
        parentId: id,
        name: location,
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

  const handleEditLocation = ({ name }) => {
    setEditModal(false);
    const { id, parentId, locationType, lastModifiedTimestamp } = selectedLocation.getLocation;

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

  const handleDeleteLocation = () => {
    setDeleteModal(false);
    const { id } = selectedLocation.getLocation;

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

  const handleCreateEquipment = ({ inventoryId, name, profileId }) => {
    setApModal(false);
    const { id: locationId } = selectedLocation.getLocation;

    createEquipment({ variables: { customerId, inventoryId, locationId, name, profileId } })
      .then(() => {
        notification.success({
          message: 'Success',
          description: 'Equipment successfully created.',
        });
        refetch();
      })
      .catch(() =>
        notification.error({
          message: 'Error',
          description: 'Equipment could not be created.',
        })
      );
  };

  const onSelect = (selectedKeys, info) => {
    const { id } = info.node;
    handleGetSingleLocation(id);
  };

  const onCheck = checkedKeys => {
    setCheckedLocations(checkedKeys.checked);
  };

  const handleFetchProfiles = e => {
    if (apProfiles.getAllProfiles.context.lastPage) {
      return false;
    }

    e.persist();
    const { target } = e;

    if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
      fetchMore({
        variables: { context: { ...apProfiles.getAllProfiles.context } },
        updateQuery: updateQueryGetAllProfiles,
      });
    }

    return true;
  };

  const locationsTree = useMemo(() => formatLocationListForTree(data && data.getAllLocations), [
    data,
  ]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    if (error.message === '403: Forbidden' || error.message === '401: Unauthorized') {
      return <Redirect to="/login" />;
    }

    return <Alert message="Error" description="Failed to load locations." type="error" showIcon />;
  }

  return (
    <NetworkPage
      onSelect={onSelect}
      onCheck={onCheck}
      checkedLocations={checkedLocations}
      locations={locationsTree}
      selectedLocation={selectedLocation && selectedLocation.getLocation}
      addModal={addModal}
      editModal={editModal}
      deleteModal={deleteModal}
      apModal={apModal}
      setAddModal={setAddModal}
      setEditModal={setEditModal}
      setDeleteModal={setDeleteModal}
      setApModal={setApModal}
      onAddLocation={handleAddLocation}
      onEditLocation={handleEditLocation}
      onDeleteLocation={handleDeleteLocation}
      onCreateEquipment={handleCreateEquipment}
      profiles={(apProfiles && apProfiles.getAllProfiles && apProfiles.getAllProfiles.items) || []}
      loadingProfile={loadingProfile}
      errorProfile={errorProfile}
      onFetchMoreProfiles={handleFetchProfiles}
      isLastProfilesPage={apProfiles?.getAllProfiles?.context?.lastPage}
    >
      <Switch>
        <Route
          exact
          path={`${path}/access-points/bulk-edit/:id`}
          render={props => (
            <BulkEditAccessPoints
              locations={locationsTree}
              checkedLocations={checkedLocations}
              {...props}
            />
          )}
        />
        <Route
          exact
          path={`${path}/access-points`}
          render={props => <AccessPoints checkedLocations={checkedLocations} {...props} />}
        />
        <Route
          exact
          path={`${path}/access-points/:id/:tab`}
          render={props => <AccessPointDetails locations={locationsTree} {...props} />}
        />

        <Route
          exact
          path={`${path}/client-devices`}
          render={props => <ClientDevices checkedLocations={checkedLocations} {...props} />}
        />
        <Route exact path={`${path}/client-devices/:id`} component={ClientDeviceDetails} />
        <Redirect from={`${path}/access-points/:id`} to={`${path}/access-points/:id/general`} />
        <Redirect from={path} to={`${path}/access-points`} />
      </Switch>
    </NetworkPage>
  );
};

export default Network;
