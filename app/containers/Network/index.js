import React, { useEffect, useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';

import {
  Network as NetworkPage,
  ClientDevicesTable,
  AccessPointsTable,
} from '@tip-wlan/wlan-cloud-ui-library';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { notification, Spin } from 'antd';
import _ from 'lodash';
import UserContext from 'contexts/UserContext';
import {
  CLIENT_DEVICES_TABLE_CLOUMNS as clientDevicesTableColumns,
  CLIENT_DEVICES_TABLE_DATA,
  IS_RADIO_TYPE_5GHZ,
  IS_RADIO_TYPE_2DOT4GHZ,
} from 'constants/index.js';
import { GET_ALL_LOCATIONS, FILTER_EQUIPMENT } from 'graphql/queries';
import styles from './index.module.scss';

const accessPointsTableColumns = [
  {
    title: 'NAME',
    dataIndex: 'name',
    key: 'name',
    render: name => {
      return <span>{name || 'null'}</span>;
    },
  },
  {
    title: 'ALARMS',
    dataIndex: 'alarms',
    key: 'alarms',
    render: alarms => {
      return <span>{alarms || 'null'}</span>;
    },
  },
  {
    title: 'MODEL',
    dataIndex: 'model',
    key: 'model',
    render: model => {
      return <span>{model || 'null'}</span>;
    },
  },
  {
    title: 'IP',
    dataIndex: 'ip',
    key: 'ip',
    render: ip => {
      return <span>{ip || 'null'}</span>;
    },
  },
  {
    title: 'MAC',
    dataIndex: 'mac',
    key: 'mac',
    render: mac => {
      return <span>{mac || 'null'}</span>;
    },
  },
  {
    title: 'ASSET ID',
    dataIndex: 'assetId',
    key: 'assetId',
    render: assetId => {
      return <span>{assetId || 'null'}</span>;
    },
  },
  {
    title: 'UP TIME',
    dataIndex: 'upTime',
    key: 'upTime',
    render: alarms => {
      return <span>{alarms || 'null'}</span>;
    },
  },
  {
    title: 'PROFILE',
    dataIndex: 'profile',
    key: 'profile',
    render: profile => {
      return <span>{profile || 'null'}</span>;
    },
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
    render: capacity => {
      return <span>{capacity || 'null'}</span>;
    },
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
    render: devices => {
      return <span>{devices || 'null'}</span>;
    },
  },
];

const Network = () => {
  const { customerId } = useContext(UserContext);
  const location = useLocation();

  const { loading, error, data } = useQuery(GET_ALL_LOCATIONS, {
    variables: { customerId },
  });
  const [filterEquipment, { loading: isEquipLoading, data: equipData }] = useLazyQuery(
    FILTER_EQUIPMENT
  );
  const [activeTab, setActiveTab] = useState('cd');
  const [locationsTree, setLocationsTree] = useState([]);
  const [checkedLocations, setCheckedLocations] = useState([]);
  const [devicesData, setDevicesData] = useState([]);
  const [selected, setSelected] = useState(false);

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

  const setAccessPointsTableData = dataSource => {
    const tableData =
      dataSource &&
      dataSource.items.map(ap => {
        const radioChannelDetails = getRadioDetails(ap.details, 'channel');
        const radioNoiseFloorDetails = getRadioDetails(ap.details, 'noiseFloor');
        const {
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
        } = ap;
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
          channel: radioChannelDetails,
          noiseFloor: radioNoiseFloorDetails,
        };
      });
    return tableData;
  };

  const fetchFilterEquipment = async () => {
    filterEquipment({
      variables: { customerId, locationIds: checkedLocations, equipmentType: 'AP' },
    });
  };

  useEffect(() => {
    const { pathname } = location;
    return pathname === '/network/access-points' ? setActiveTab('ap') : setActiveTab('cd');
  }, [location]);

  useEffect(() => {
    if (data && data.getAllLocations) {
      const unflattenData = formatLocationListForTree(data && data.getAllLocations);
      setLocationsTree(unflattenData[0].children);
    }
  }, [data]);

  useEffect(() => {
    const filteredData = [];
    setDevicesData(filteredData);
    if (activeTab === 'cd') {
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

  const onSelect = () => {
    setSelected(!selected);
  };

  const onCheck = checkedKeys => {
    setCheckedLocations(checkedKeys);
  };

  if (loading || isEquipLoading) {
    return <Spin size="large" className={styles.spinner} />;
  }

  if (error) {
    notification.error({
      message: 'Error',
      description: 'Failed to load Locations',
    });
  }
  return (
    <NetworkPage
      onSelect={onSelect}
      onCheck={onCheck}
      checkedLocations={checkedLocations}
      locations={locationsTree}
      activeTab={activeTab}
    >
      {activeTab === 'cd' ? (
        <ClientDevicesTable tableColumns={clientDevicesTableColumns} tableData={devicesData} />
      ) : (
        <AccessPointsTable
          tableColumns={accessPointsTableColumns}
          tableData={
            equipData && equipData.filterEquipment
              ? setAccessPointsTableData(equipData && equipData.filterEquipment)
              : []
          }
        />
      )}
    </NetworkPage>
  );
};

export default Network;
