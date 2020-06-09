import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { NetworkTable } from '@tip-wlan/wlan-cloud-ui-library';

import { CLIENT_DEVICES_TABLE_DATA } from 'constants/index.js';

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

const ClientDevices = ({ checkedLocations }) => {
  const [devicesData, setDevicesData] = useState([]);

  useEffect(() => {
    const filteredData = [];
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
  }, [checkedLocations]);

  return <NetworkTable tableColumns={clientDevicesTableColumns} tableData={devicesData} />;
};

ClientDevices.propTypes = {
  checkedLocations: PropTypes.instanceOf(Array).isRequired,
};

export default ClientDevices;
