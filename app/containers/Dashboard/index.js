import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Alert } from 'antd';
import { Dashboard as DashboardPage, Loading } from '@tip-wlan/wlan-cloud-ui-library';

import UserContext from 'contexts/UserContext';
import { GET_ALL_STATUS } from 'graphql/queries';

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  // eslint-disable-next-line no-restricted-properties
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

const Dashboard = () => {
  const { customerId } = useContext(UserContext);
  const { loading, error, data } = useQuery(GET_ALL_STATUS, {
    variables: { customerId, statusDataTypes: ['CUSTOMER_DASHBOARD'] },
  });

  const titleList = ['Access Points', 'Client Devices', 'Usage Information'];

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Alert message="Error" description="Failed to load Dashboard" type="error" showIcon />;
  }

  const status = data.getAllStatus.items.length > 0 ? data.getAllStatus.items[0] : {};

  const {
    associatedClientsCountPerRadio,
    totalProvisionedEquipment,
    equipmentInServiceCount,
    equipmentWithClientsCount,
    trafficBytesDownstream,
    trafficBytesUpstream,
  } = status.detailsJSON;
  const { clientCountPerOui, equipmentCountPerOui } = status.details;

  let totalAssociated = 0;
  Object.keys(associatedClientsCountPerRadio).forEach(i => {
    totalAssociated += associatedClientsCountPerRadio[i];
  });

  const { is2dot4GHz, is5GHzL, is5GHzU } = associatedClientsCountPerRadio;

  const frequencies = {
    '2.4GHz': is2dot4GHz || 0,
    '5GHz': parseInt((is5GHzL || 0) + (is5GHzU || 0), 10),
  };

  const statsArr = [
    {
      'Total Provisioned': totalProvisionedEquipment,
      'In Service': equipmentInServiceCount,
      'With Clients': equipmentWithClientsCount,
    },
    {
      'Total Associated': totalAssociated,
      ...frequencies,
    },
    {
      'Total Traffic (US)': formatBytes(trafficBytesUpstream),
      'Total Traffic (DS)': formatBytes(trafficBytesDownstream),
    },
  ];
  const pieChartData = [equipmentCountPerOui, clientCountPerOui];

  return <DashboardPage titleList={titleList} statsArr={statsArr} pieChartData={pieChartData} />;
};

export default Dashboard;
