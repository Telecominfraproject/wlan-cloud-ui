import React, { useContext, useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Alert } from 'antd';
import { Dashboard as DashboardPage, Loading } from '@tip-wlan/wlan-cloud-ui-library';
import moment from 'moment';
import UserContext from 'contexts/UserContext';
import { GET_ALL_STATUS, FILTER_SYSTEM_EVENTS } from 'graphql/queries';

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  // eslint-disable-next-line no-restricted-properties
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i] || ''}`;
}

const Dashboard = () => {
  const { customerId } = useContext(UserContext);
  const { loading, error, data } = useQuery(GET_ALL_STATUS, {
    variables: { customerId, statusDataTypes: ['CUSTOMER_DASHBOARD'] },
  });
  const [toTime] = useState(
    moment()
      .valueOf()
      .toString()
  );
  const [fromTime] = useState(
    moment()
      .subtract(24, 'days')
      .valueOf()
      .toString()
  );

  const {
    loading: metricsLoading,
    error: metricsError,
    data: metricsData,
    // refetch: metricsRefetch,
  } = useQuery(FILTER_SYSTEM_EVENTS, {
    variables: {
      customerId,
      fromTime,
      toTime,
      equipmentIds: [0],
      dataTypes: ['StatusChangedEvent'],
      limit: 100,
    },
  });

  const pieChartTitle = ['Access Points', 'Client Devices', 'Usage Information'];
  const lineChartTitle = [
    'Inservice APs (24hours)',
    'Client Devices (24hours)',
    'Traffic (24hours)',
  ];

  const [lineChartXAxis] = useState([]);
  const [lineChartYAxis] = useState({
    inservicesAPs: { name: 'Inservice APs', value: [] },
    clientDevices: {
      is2dot4GHz: { name: '2.4GHz', value: [] },
      is5GHzL: { name: '5GHz (L)', value: [] },
      is5GHzU: { name: '5GHz (U)', value: [] },
    },
    traffic: {
      trafficBytesDownstream: { name: 'Down Stream', value: [] },
      trafficBytesUpstream: { name: 'Up Stream', value: [] },
    },
  });

  useEffect(() => {
    return metricsData?.filterSystemEvents?.items?.forEach(
      ({
        eventTimestamp,
        details: {
          payload: {
            details: {
              equipmentInServiceCount,
              associatedClientsCountPerRadio: { is2dot4GHz, is5GHzL, is5GHzU },
              trafficBytesDownstream,
              trafficBytesUpstream,
            },
          },
        },
      }) => {
        lineChartXAxis.push(eventTimestamp);
        lineChartYAxis.inservicesAPs.value.push(equipmentInServiceCount);
        lineChartYAxis.clientDevices.is2dot4GHz.value.push(is2dot4GHz);
        lineChartYAxis.clientDevices.is5GHzL.value.push(is5GHzL);
        lineChartYAxis.clientDevices.is5GHzU.value.push(is5GHzU);
        lineChartYAxis.traffic.trafficBytesDownstream.value.push(trafficBytesDownstream);
        lineChartYAxis.traffic.trafficBytesUpstream.value.push(trafficBytesUpstream);
      }
    );
  }, [metricsLoading]);

  if (loading || metricsLoading) {
    return <Loading />;
  }

  if (error || metricsError) {
    return <Alert message="Error" description="Failed to load Dashboard" type="error" showIcon />;
  }

  const status =
    data.getAllStatus.items.length > 0
      ? data.getAllStatus.items[0]
      : { details: {}, detailsJSON: {} };

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
  if (associatedClientsCountPerRadio) {
    Object.keys(associatedClientsCountPerRadio).forEach(i => {
      totalAssociated += associatedClientsCountPerRadio[i];
    });
  }

  const { is2dot4GHz, is5GHzL, is5GHzU } = associatedClientsCountPerRadio || {};

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
  return (
    <DashboardPage
      pieChartTitle={pieChartTitle}
      statsArr={statsArr}
      pieChartData={pieChartData}
      lineChartYAxis={lineChartYAxis}
      lineChartXAxis={lineChartXAxis}
      lineChartTitle={lineChartTitle}
    />
  );
};

export default Dashboard;
