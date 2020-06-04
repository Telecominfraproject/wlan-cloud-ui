import React, { useEffect, useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Network as NetworkPage, NetworkTable } from '@tip-wlan/wlan-cloud-ui-library';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import { Alert, Spin, notification } from 'antd';
import _ from 'lodash';
import UserContext from 'contexts/UserContext';
import { CLIENT_DEVICES_TABLE_DATA } from 'constants/index.js';
import {
  GET_ALL_LOCATIONS,
  FILTER_EQUIPMENT,
  GET_LOCATION,
  DELETE_LOCATION,
} from 'graphql/queries';
import { CREATE_LOCATION, UPDATE_LOCATION } from 'graphql/mutations';
import styles from './index.module.scss';

const renderTableCell = tabCell => {
  if (Array.isArray(tabCell)) {
    return (
      <div className={styles.tabColumn}>
        {tabCell.map(i => (
          <span>{i}</span>
        ))}
      </div>
    );
  }
  return <span>{tabCell}</span>;
};

const clientDevicesTableColumns = [
  {
    title: '',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'MAC',
    dataIndex: 'macAddress',
    key: 'mac',
  },
  { title: 'OS/MODEL/MFR', dataIndex: 'osModelMfr', key: '1' },
  { title: 'IP', dataIndex: 'ip', key: '2' },
  { title: 'HOST NAME', dataIndex: 'hostName', key: '3' },
  { title: 'ACCESS POINT', dataIndex: 'accessPoint', key: '4' },
  { title: 'SSID', dataIndex: 'ssid', key: '5' },
  { title: 'BAND', dataIndex: 'band', key: '6' },
  { title: 'SIGNAL', dataIndex: 'signal', key: '7' },
  { title: 'STATUS', dataIndex: 'status', key: '8' },
];

const accessPointsTableColumns = [
  {
    title: 'NAME',
    dataIndex: 'name',
    key: 'name',
    render: renderTableCell,
  },
  {
    title: 'ALARMS',
    dataIndex: 'alarms',
    key: 'alarms',
    render: renderTableCell,
  },
  {
    title: 'MODEL',
    dataIndex: 'model',
    key: 'model',
    render: renderTableCell,
  },
  {
    title: 'IP',
    dataIndex: 'ip',
    key: 'ip',
    render: renderTableCell,
  },
  {
    title: 'MAC',
    dataIndex: 'macAddress',
    key: 'mac',
    render: renderTableCell,
  },
  {
    title: 'ASSET ID',
    dataIndex: 'assetId',
    key: 'assetId',
    render: renderTableCell,
  },
  {
    title: 'UP TIME',
    dataIndex: 'upTime',
    key: 'upTime',
    render: renderTableCell,
  },
  {
    title: 'PROFILE',
    dataIndex: 'profile',
    key: 'profile',
    render: renderTableCell,
  },
  {
    title: 'CHANNEL',
    dataIndex: 'channel',
    key: 'channel',
    render: renderTableCell,
  },
  {
    title: 'CAPACITY',
    dataIndex: 'capacity',
    key: 'capacity',
    render: renderTableCell,
  },
  {
    title: 'NOISE FLOOR',
    dataIndex: 'noiseFloor',
    key: 'noiseFloor',
    render: renderTableCell,
  },
  {
    title: 'DEVICES',
    dataIndex: 'devices',
    key: 'devices',
    render: renderTableCell,
  },
];

const Network = () => {
  const { customerId } = useContext(UserContext);
  const location = useLocation();
  const { loading, error, refetch, data } = useQuery(GET_ALL_LOCATIONS, {
    variables: { customerId },
  });
  const [filterEquipment, { loading: isEquipLoading, data: equipData, fetchMore }] = useLazyQuery(
    FILTER_EQUIPMENT
  );
  const [getLocation, { data: locationData }] = useLazyQuery(GET_LOCATION);
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
        description: 'Locaton could not be deleted.',
      });
    },
  });
  const [activeTab, setActiveTab] = useState(location.pathname);
  const [locationsTree, setLocationsTree] = useState([]);
  const [checkedLocations, setCheckedLocations] = useState([]);
  const [devicesData, setDevicesData] = useState([]);
  const [locationPath, setLocationPath] = useState([]);

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

  const mapAccessPointsTableData = (dataSource = []) => {
    return dataSource.map(
      ({ id, name, alarms, model, inventoryId, devices, profile, channel, status }) => {
        return {
          key: id,
          name,
          alarms,
          model,
          ip: status.protocol.details.reportedIpV4Addr,
          macAddress: status.protocol.details.reportedMacAddr,
          assetId: inventoryId,
          upTime: status.osPerformance.details.uptimeInSeconds,
          profile: profile.name,
          channel,
          capacity: status.radioUtilization.details.capacityDetails,
          noiseFloor: status.radioUtilization.details.noiseFloorDetails,
          devices,
        };
      }
    );
  };

  const handleLoadMore = () => {
    if (!equipData.filterEquipment.context.lastPage) {
      fetchMore({
        variables: { cursor: equipData.filterEquipment.context.cursor },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const previousEntry = previousResult.filterEquipment;
          const newItems = fetchMoreResult.filterEquipment.items;

          return {
            filterEquipment: {
              context: fetchMoreResult.filterEquipment.context,
              items: [...previousEntry.items, ...newItems],
              __typename: previousEntry.__typename,
            },
          };
        },
      });
    }
  };

  const handleGetSingleLocation = id => {
    getLocation({
      variables: { id },
    });
  };

  const fetchFilterEquipment = async () => {
    filterEquipment({
      variables: { customerId, locationIds: checkedLocations, equipmentType: 'AP' },
    });
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
    const { pathname } = location;
    if (pathname === '/network/access-points') {
      setActiveTab('/network/access-points');
    } else {
      setActiveTab('/network/client-devices');
    }
  }, [location]);

  useEffect(() => {
    if (data && data.getAllLocations) {
      const unflattenData = formatLocationListForTree(data && data.getAllLocations);
      setLocationsTree(unflattenData[0].children);
    }
  }, [data]);
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

  useEffect(() => {
    const filteredData = [];
    setDevicesData(filteredData);
    if (activeTab === '/network/client-devices') {
      if (checkedLocations.length > 0) {
        checkedLocations.forEach(locationId => {
          CLIENT_DEVICES_TABLE_DATA.filter(d => {
            return d.locationId === locationId ? filteredData.push(d) : '';
          });
          setDevicesData(filteredData);
        });
      } else {
        setDevicesData(filteredData);
      }
    } else {
      fetchFilterEquipment();
    }
  }, [checkedLocations, activeTab]);

  const onSelect = (selectedKeys, info) => {
    const currentLocationPath = getLocationPath(info.node, data.getAllLocations);
    setLocationPath(currentLocationPath);
  };

  const onCheck = checkedKeys => {
    setCheckedLocations(checkedKeys);
  };

  if (loading) {
    return <Spin size="large" className={styles.spinner} />;
  }

  if (error) {
    return <Alert message="Error" description="Failed to load locations." type="error" showIcon />;
  }

  return (
    <NetworkPage
      loading={isEquipLoading}
      onSelect={onSelect}
      onCheck={onCheck}
      checkedLocations={checkedLocations}
      locations={locationsTree}
      activeTab={activeTab}
      locationPath={locationPath}
      onAddLocation={handleAddLocation}
      onEditLocation={handleEditLocation}
      onDeleteLocation={handleDeleteLocation}
      onGetSelectedLocation={handleGetSingleLocation}
      singleLocationData={locationData && locationData.getLocation}
    >
      {activeTab === '/network/client-devices' ? (
        <NetworkTable tableColumns={clientDevicesTableColumns} tableData={devicesData} />
      ) : (
        <NetworkTable
          tableColumns={accessPointsTableColumns}
          tableData={mapAccessPointsTableData(
            equipData && equipData.filterEquipment && equipData.filterEquipment.items
          )}
          onLoadMore={handleLoadMore}
          isLastPage={
            equipData && equipData.filterEquipment && equipData.filterEquipment.context.lastPage
          }
        />
      )}
    </NetworkPage>
  );
};

export default Network;
