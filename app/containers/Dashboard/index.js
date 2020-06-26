import React from 'react';
import { Dashboard as DashboardPage } from '@tip-wlan/wlan-cloud-ui-library';

const Dashboard = () => {
  const titleList = ['Access Points', 'Client Devices', 'Usage Information'];
  const statsArr = [
    {
      'Total Provisioned': 12,
      'In Service': 25,
      'With Clients': 12,
      'Out Of Service': 2,
      'Never Connected': 5,
    },
    {
      'Total Associated': 250,
      '5G Associated': 220,
      '2.4G Associated': 30,
    },
    {
      'Total 24 hrs Volume (US+DS)': 112.3,
      'Total Average traffic (US)': '2.4 Mb/s',
      'Total Average traffic (DS)': '10.3 Mb/s',
      'Total 24 hrs Unique Devices': 110,
      'Most Active AP': 'AP120',
      'Most Active Client': 'client_mac',
    },
  ];

  return <DashboardPage titleList={titleList} statsArr={statsArr} />;
};

export default Dashboard;
