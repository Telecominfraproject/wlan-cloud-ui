import React, { useEffect, useContext, useState } from 'react';
import gql from 'graphql-tag';
import { useLocation } from 'react-router-dom';
import {
  Network as NetworkPage,
  NetworkTable,
  BulkEditAccessPoints,
} from '@tip-wlan/wlan-cloud-ui-library';
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import { Alert, Spin, notification } from 'antd';
import _ from 'lodash';
import UserContext from 'contexts/UserContext';
import {
  CLIENT_DEVICES_TABLE_DATA,
  IS_RADIO_TYPE_5GHZ,
  IS_RADIO_TYPE_2DOT4GHZ,
} from 'constants/index.js';
import { GET_ALL_LOCATIONS, FILTER_EQUIPMENT } from 'graphql/queries';
import styles from './index.module.scss';

const clientDevicesTableColumns = [
  {
    title: '',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'MAC',
    dataIndex: 'mac',
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

const renderTableCell = tabCell => {
  return <span>{tabCell || 'null'}</span>;
};

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
    dataIndex: 'mac',
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
    render: channel => {
      return (
        <div className={styles.tabColumn}>
          <span>{channel && channel.is2dot4GHz ? channel.is2dot4GHz : 'null'}</span>
          <span style={{ color: 'darkgray' }}>
            {channel && channel.is5GHz ? channel.is5GHz : 'null'}
          </span>
        </div>
      );
    },
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
    render: noiseFloor => {
      return (
        <div className={styles.tabColumn}>
          <span>{noiseFloor && noiseFloor.is2dot4GHz ? noiseFloor.is2dot4GHz : 'null'}</span>
          <span>{noiseFloor && noiseFloor.is5GHz ? noiseFloor.is5GHz : 'null'}</span>
        </div>
      );
    },
  },
  {
    title: 'DEVICES',
    dataIndex: 'devices',
    key: 'devices',
    render: renderTableCell,
  },
];

const CREATE_LOCATION = gql`
  mutation CreateLocation(
    $locationType: String!
    $customerId: Int!
    $parentId: Int!
    $name: String!
  ) {
    createLocation(
      locationType: $locationType
      customerId: $customerId
      parentId: $parentId
      name: $name
    ) {
      locationType
      customerId
      parentId
      name
    }
  }
`;

const UPDATE_LOCATION = gql`
  mutation UpdateLocation(
    $id: Int!
    $locationType: String!
    $customerId: Int!
    $parentId: Int!
    $name: String!
    $lastModifiedTimestamp: String
  ) {
    updateLocation(
      id: $id
      locationType: $locationType
      customerId: $customerId
      parentId: $parentId
      name: $name
      lastModifiedTimestamp: $lastModifiedTimestamp
    ) {
      id
      locationType
      customerId
      parentId
      name
      lastModifiedTimestamp
    }
  }
`;

const DELETE_LOCATION = gql`
  query DeleteLocation($id: Int!) {
    deleteLocation(id: $id) {
      id
      locationType
      customerId
      parentId
      name
      lastModifiedTimestamp
    }
  }
`;

const Network = () => {
  const { customerId } = useContext(UserContext);
  const location = useLocation();
  const { loading, error, data } = useQuery(GET_ALL_LOCATIONS, {
    variables: { customerId },
  });
  const [
    filterEquipment,
    { loading: isEquipLoading, data: equipData, refetch, fetchMore },
  ] = useLazyQuery(FILTER_EQUIPMENT);
  const [createLocation] = useMutation(CREATE_LOCATION);
  const [updateLocation] = useMutation(UPDATE_LOCATION);
  const [deleteLocation] = useLazyQuery(DELETE_LOCATION);
  const [activeTab, setActiveTab] = useState(location.pathname);
  const [locationsTree, setLocationsTree] = useState([]);
  const [checkedLocations, setCheckedLocations] = useState([]);
  const [devicesData, setDevicesData] = useState([]);
  // const [selected, setSelected] = useState(false);
  const [bulkEditAps, setBulkEditAps] = useState(false);
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

  const getRadioDetailsByType = (radioDetails, type, radioType) => {
    let channel;
    let noiseFloor;
    if (type === 'channel') {
      channel = radioDetails.radioMap[radioType] && radioDetails.radioMap[radioType].channelNumber;
    } else {
      noiseFloor =
        radioDetails.advancedRadioMap[radioType] &&
        radioDetails.advancedRadioMap[radioType].channelHopSettings.noiseFloorThresholdInDB;
      return noiseFloor;
    }
    return channel;
  };

  const getRadioDetails = (radioDetails, type) => {
    const is5GHz = getRadioDetailsByType(radioDetails, type, IS_RADIO_TYPE_5GHZ);
    const is2dot4GHz = getRadioDetailsByType(radioDetails, type, IS_RADIO_TYPE_2DOT4GHZ);
    return {
      is5GHz,
      is2dot4GHz,
    };
  };

  const mapAccessPointsTableData = (dataSource = []) => {
    return dataSource.map(
      ({
        id,
        name,
        alarms,
        model,
        ip,
        mac,
        inventoryId,
        uptime,
        profileId,
        capacity,
        devices,
        details,
      }) => {
        return {
          key: id,
          name,
          alarms,
          model,
          ip,
          mac,
          assetId: inventoryId,
          upTime: uptime,
          profile: profileId,
          capacity,
          devices,
          channel: getRadioDetails(details, 'channel'),
          noiseFloor: getRadioDetails(details, 'noiseFloor'),
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

  const fetchFilterEquipment = async () => {
    filterEquipment({
      variables: { customerId, locationIds: checkedLocations, equipmentType: 'AP' },
    });
  };

  const handleAddLocation = (name, parentId) => {
    createLocation({
      variables: {
        locationType: 'City',
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

  const handleEditLocation = (id, parentId, name) => {
    updateLocation({
      variables: {
        id,
        locationType: 'City',
        customerId,
        parentId,
        name,
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
    })
      .then(() => {
        refetch();
        notification.success({
          message: 'Success',
          description: 'Location successfully deleted.',
        });
      })
      .catch(() =>
        notification.error({
          message: 'Error',
          description: 'Location could not be deleted.',
        })
      );
  };

  const handleBulkEditAccessPoints = () => {
    setBulkEditAps(true);
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
    // setSelected(!selected);
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
      onBulkEditAccessPoints={handleBulkEditAccessPoints}
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
      {bulkEditAps && <BulkEditAccessPoints />}
    </NetworkPage>
  );
};

export default Network;
