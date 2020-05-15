import React, { useEffect, useContext, useState } from 'react';
import { ClientDevices as ClientDevicesPage } from '@tip-wlan/wlan-cloud-ui-library';
import { useQuery } from '@apollo/react-hooks';
import { notification, Spin } from 'antd';
import _ from 'lodash';
import UserContext from 'contexts/UserContext';
import {
  ACCESS_POINTS_TABLE_CLOUMNS as accessPointsTableColumns,
  CLIENT_DEVICES_TABLE_CLOUMNS as clientDevicesTableColumns,
  CLIENT_DEVICES_TABLE_DATA,
} from 'constants/index';
import { GET_ALL_LOCATIONS, FILTER_EQUIPMENT } from 'graphql/queries';
import styles from './index.module.scss';

const IS_RADIO_TYPE_5GHZ = 'is5GHz';
const IS_RADIO_TYPE_2DOT4GHZ = 'is2dot4GHz';

const ClientDevices = () => {
  const { customerId } = useContext(UserContext);
  const { loading, error, data, client } = useQuery(GET_ALL_LOCATIONS, {
    variables: { customerId },
  });
  const [activeTab, setActiveTab] = useState('cd');
  const [locationsTree, setLocationsTree] = useState([]);
  const [checkedLocations, setCheckedLocations] = useState([]);
  const [devicesData, setDevicesData] = useState([]);
  const [selected, setSelected] = useState(false);

  const formatLocationListForTree = list => {
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
    let is5GHz;
    let is2dot4GHz;
    if (type === 'channel') {
      is5GHz = getRadioDetailsByType(radioDetails, type, IS_RADIO_TYPE_5GHZ);
      is2dot4GHz = getRadioDetailsByType(radioDetails, type, IS_RADIO_TYPE_2DOT4GHZ);
    } else {
      is5GHz = getRadioDetailsByType(radioDetails, type, IS_RADIO_TYPE_5GHZ);
      is2dot4GHz = getRadioDetailsByType(radioDetails, type, IS_RADIO_TYPE_2DOT4GHZ);

      return {
        is5GHz,
        is2dot4GHz,
      };
    }
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
        return {
          key: ap.id,
          name: ap.name !== undefined ? ap.name : 'null',
          alarms: ap.alarms !== undefined ? ap.alarms : 'null',
          model: ap.model !== undefined ? ap.model : 'null',
          ip: ap.ip !== undefined ? ap.ip : 'null',
          mac: ap.mac !== undefined ? ap.mac : 'null',
          assetId: ap.inventoryId,
          upTime: ap.uptime !== undefined ? ap.uptime : 'null',
          profile: ap.profileId,
          capacity: ap.capacity !== undefined ? ap.capacity : 'null',
          devices: ap.devices !== undefined ? ap.devices : 'null',
          channel: radioChannelDetails,
          noiseFloor: radioNoiseFloorDetails,
        };
      });
    return tableData;
  };

  useEffect(() => {
    if (data && data.getAllLocations) {
      const checkedTreeLocations = [];
      const unflattenData = formatLocationListForTree(data && data.getAllLocations);
      unflattenData[0].children.forEach(loc => {
        checkedTreeLocations.push(loc.id);
        if (loc.children && loc.children.length > 0) {
          loc.children.forEach(cl => {
            checkedTreeLocations.push(cl.id);
            if (cl.children && cl.children.length > 0) {
              cl.children.map(l => {
                return checkedTreeLocations.push(l.id);
              });
            }
          });
        }
      });
      setLocationsTree(unflattenData[0].children);
      setCheckedLocations(checkedTreeLocations);
    }
  }, [data, activeTab]);

  const onSelect = () => {
    setSelected(!selected);
  };

  useEffect(() => {
    const filteredData = [];
    if (checkedLocations.length > 0) {
      checkedLocations.forEach(async locationId => {
        if (activeTab === 'cd') {
          CLIENT_DEVICES_TABLE_DATA.filter(d => {
            return d.locationId === locationId ? filteredData.push(d) : '';
          });
          setDevicesData(filteredData);
        } else {
          const ap = await client.query({
            query: FILTER_EQUIPMENT,
            variables: { customerId, locationIds: checkedLocations, equipmentType: 'AP' },
          });
          const accessPointsData = setAccessPointsTableData(ap.data && ap.data.filterEquipment);
          setDevicesData(accessPointsData);
        }
      });
    } else {
      setDevicesData(filteredData);
    }
  }, [checkedLocations]);

  const onCheck = checkedKeys => {
    setCheckedLocations(checkedKeys);
  };

  const onToggle = e => {
    setActiveTab(e.target.id);
  };

  if (loading) {
    return <Spin size="large" className={styles.spinner} />;
  }

  if (error) {
    notification.error({
      message: 'Error',
      description: 'Failed to load Locations',
    });
  }

  return (
    <ClientDevicesPage
      onSelect={onSelect}
      onCheck={onCheck}
      tableColumns={activeTab === 'cd' ? clientDevicesTableColumns : accessPointsTableColumns}
      tableData={devicesData}
      checkedLocations={checkedLocations}
      locations={locationsTree}
      onToggle={onToggle}
      activeTab={activeTab}
    />
  );
};

export default ClientDevices;
