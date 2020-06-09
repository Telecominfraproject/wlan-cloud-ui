import React, { useEffect, useContext, useState } from 'react';
import { useLocation, Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import { Alert, notification, Popover, Button } from 'antd';
import _ from 'lodash';
import { Network as NetworkPage, Loading } from '@tip-wlan/wlan-cloud-ui-library';

import AccessPointDetails from 'containers/Network/containers/AccessPointDetails';
import AccessPoints from 'containers/Network/containers/AccessPoints';
import ClientDevices from 'containers/Network/containers/ClientDevices';
import ClientDeviceDetails from 'containers/Network/containers/ClientDeviceDetails';
import UserContext from 'contexts/UserContext';
import { GET_ALL_LOCATIONS, GET_LOCATION, DELETE_LOCATION } from 'graphql/queries';
import { CREATE_LOCATION, UPDATE_LOCATION } from 'graphql/mutations';

import styles from './index.module.scss';

const Network = () => {
  const { path } = useRouteMatch();
  const { customerId } = useContext(UserContext);
  const location = useLocation();
  const [locationData, setLocationData] = useState();
  const { loading, error, refetch, data } = useQuery(GET_ALL_LOCATIONS, {
    variables: { customerId },
  });
  const [getLocation] = useLazyQuery(GET_LOCATION, {
    onCompleted: locData => {
      setLocationData(locData && locData.getLocation);
    },
    onError: () => {},
  });
  const [createLocation] = useMutation(CREATE_LOCATION);
  const [updateLocation] = useMutation(UPDATE_LOCATION);
  const [deleteLocation] = useLazyQuery(DELETE_LOCATION, {
    onCompleted: () => {
      refetch();
      notification.success({
        message: 'Success',
        description: 'Location successfully deleted.',
      });
    },
    onError: () => {
      notification.error({
        message: 'Error',
        description: 'Location could not be deleted.',
      });
    },
  });
  const [locationsTree, setLocationsTree] = useState([]);
  const [checkedLocations, setCheckedLocations] = useState([]);
  const [locationPath, setLocationPath] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [addModal, setAddModal] = useState(false);

  const handleGetSingleLocation = id => {
    getLocation({
      variables: { id },
    });
  };

  const content = (
    <ul className={styles.popOver}>
      {locationData && locationData.locationType !== 'FLOOR' && (
        <li>
          <Button
            key={0}
            role="button"
            onKeyPress={() => {}}
            onClick={() => {
              setAddModal(true);
            }}
          >
            Add Location
          </Button>
        </li>
      )}
      <li>
        <Button
          key={1}
          role="button"
          onKeyPress={() => {}}
          onClick={() => {
            setEditModal(true);
          }}
        >
          Edit Location
        </Button>
      </li>
      <li>
        <Button key={2} role="button" onKeyPress={() => {}} onClick={() => {}}>
          Bulk Edit APs
        </Button>
      </li>
      <li>
        <Button
          key={3}
          role="button"
          onKeyPress={() => {}}
          onClick={() => {
            setDeleteModal(true);
          }}
        >
          Delete Location
        </Button>
      </li>
    </ul>
  );

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
        title: (
          <Popover content={content} placement="rightTop" trigger="click" destroyTooltipOnHide>
            {c.name}
          </Popover>
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
        title: 'Network',
        value: '0',
        key: 0,
        children: unflatten(list),
      },
    ];
  };

  const handleAddLocation = (name, parentId, locationType) => {
    createLocation({
      variables: {
        locationType,
        customerId,
        parentId,
        name,
      },
    })
      .then(() => {
        refetch();
        notification.success({
          message: 'Success',
          description: 'Location successfully added.',
        });
      })
      .catch(() =>
        notification.error({
          message: 'Error',
          description: 'Location could not be added.',
        })
      );
  };

  const handleEditLocation = (id, parentId, name, locationType, lastModifiedTimestamp) => {
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
        refetch();
        notification.success({
          message: 'Success',
          description: 'Location successfully edited.',
        });
      })
      .catch(() =>
        notification.error({
          message: 'Error',
          description: 'Location could not be edited.',
        })
      );
  };

  const handleDeleteLocation = id => {
    deleteLocation({
      variables: {
        id,
      },
    });
  };

  useEffect(() => {
    if (data && data.getAllLocations) {
      const unflattenData = formatLocationListForTree(data && data.getAllLocations);
      setLocationsTree(unflattenData[0].children);
    }
  }, [data, locationData]);

  const locations = [];
  const getLocationPath = (node, allLocations) => {
    const { id: nodeId, parentId: parentNodeId, name: locName } = node;
    if (parentNodeId === 0) {
      locations.unshift({ id: nodeId, parentId: parentNodeId, name: locName });
    } else {
      locations.unshift({ id: nodeId, parentId: parentNodeId, name: locName });
      allLocations.forEach(item => {
        const { name, id, parentId } = item;
        if (parentNodeId === id && parentId === 0) {
          locations.unshift({ id, parentId, name });
        } else if (parentNodeId === id) {
          getLocationPath(item, data.getAllLocations);
        }
      });
    }
    return locations;
  };

  const onSelect = (selectedKeys, info) => {
    const currentLocationPath = getLocationPath(info.node, data.getAllLocations);
    setLocationPath(currentLocationPath);
    const { id } = info.node;
    handleGetSingleLocation(id);
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
      locationPath={locationPath}
      onAddLocation={handleAddLocation}
      onEditLocation={handleEditLocation}
      onDeleteLocation={handleDeleteLocation}
      selectedLocation={locationData}
      deleteModal={deleteModal}
      editModal={editModal}
      addModal={addModal}
      setAddModal={setAddModal}
      setEditModal={setEditModal}
      setDeleteModal={setDeleteModal}
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
