import React, { useEffect, useContext, useState, useMemo } from 'react';
import { ClientDevices as ClientDevicesPage } from '@tip-wlan/wlan-cloud-ui-library';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { notification, Spin } from 'antd';
import _ from 'lodash';
import UserContext from 'contexts/UserContext';
import {
  ACCESS_POINTS_TABLE_CLOUMNS as accessPointsTableColumns,
  CLIENT_DEVICES_TABLE_CLOUMNS as clientDevicesTableColumns,
  CLIENT_DEVICES_TABLE_DATA,
} from 'constants/index';
import styles from './index.module.scss';

const GET_ALL_LOCATIONS = gql`
  query GetAllLocations($customerId: Int!) {
    getAllLocations(customerId: $customerId) {
      id
      name
      parentId
    }
  }
`;

const ClientDevices = () => {
  const { customerId } = useContext(UserContext);
  const { loading, error, data } = useQuery(GET_ALL_LOCATIONS, { variables: { customerId } });
  const [activeTab, setActiveTab] = useState('cd');
  const [locationsTree, setLocationsTree] = useState([]);
  const [checkedLocations, setCheckedLocations] = useState([]);
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

  useEffect(() => {
    if (data && data.getAllLocations) {
      const checkedTreeLocations = [];
      const unflattenData = formatLocationListForTree(data && data.getAllLocations);
      unflattenData[0].children.map(loc => {
        return checkedTreeLocations.push(loc.id);
      });
      setLocationsTree(unflattenData[0].children);
      setCheckedLocations(checkedTreeLocations);
    }
  }, [data]);

  const onSelect = () => {
    setSelected(!selected);
  };

  const onCheck = checkedKeys => {
    setCheckedLocations(checkedKeys);
  };

  const devicesData = useMemo(() => {
    const filteredData = [];
    checkedLocations.forEach(locationId => {
      CLIENT_DEVICES_TABLE_DATA.filter(d => {
        return d.locationId === locationId ? filteredData.push(d) : '';
      });
    });
    return filteredData;
  }, [checkedLocations]);

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
