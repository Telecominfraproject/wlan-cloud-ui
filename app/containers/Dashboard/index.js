import React, { useContext, useMemo, useState } from 'react';
import { Dashboard as DashboardPage, Loading } from '@tip-wlan/wlan-cloud-ui-library';
import { FILTER_SYSTEM_EVENTS, GET_ALL_STATUS } from 'graphql/queries';
import { Alert } from 'antd';
import UserContext from 'contexts/UserContext';
import moment from 'moment';
import { useQuery } from '@apollo/react-hooks';

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  // eslint-disable-next-line no-restricted-properties
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i] || ''}`;
}

const pieChartTitle = ['Access Points', 'Client Devices', 'Usage Information'];
const lineChartTitle = ['Inservice APs (24hours)', 'Client Devices (24hours)', 'Traffic (24hours)'];

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

  const formatLineChartData = (list = []) => {
    const lineChartData = {
      inservicesAPs: { key: 'Inservice APs', value: [] },
      clientDevices: [],
      traffic: {
        trafficBytesDownstream: { key: 'Down Stream', value: [] },
        trafficBytesUpstream: { key: 'Up Stream', value: [] },
      },
    };
    const clientDevicesKeyMap = { is2dot4GHz: '2.4GHz', is5GHzL: '5GHz (L)', is5GHzU: '5GHz (U)' };
    list.forEach(
      ({
        eventTimestamp,
        details: {
          payload: {
            details: {
              equipmentInServiceCount,
              associatedClientsCountPerRadio: radios,
              trafficBytesDownstream,
              trafficBytesUpstream,
            },
          },
        },
      }) => {
        lineChartData.inservicesAPs.value.push([eventTimestamp, equipmentInServiceCount]);
        Object.keys(radios).forEach(key => {
          if (lineChartData.clientDevices.length) {
            const index = lineChartData.clientDevices.findIndex(
              item => item.key === clientDevicesKeyMap[key]
            );
            if (index >= 0) {
              lineChartData.clientDevices[index].value.push(radios[key]);
              return;
            }
          }
          lineChartData.clientDevices.push({
            key: clientDevicesKeyMap[key],
            value: [radios[key]],
          });
        });
        lineChartData.traffic.trafficBytesDownstream.value.push([
          eventTimestamp,
          trafficBytesDownstream,
        ]);
        lineChartData.traffic.trafficBytesUpstream.value.push([
          eventTimestamp,
          trafficBytesUpstream,
        ]);
      }
    );

    return lineChartData;
  };

  const lineChartsData = useMemo(
    () => formatLineChartData(metricsData?.filterSystemEvents?.items),
    [metricsData]
  );

  const status =
    data?.getAllStatus.items.length > 0
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

  const statsArr = useMemo(
    () => [
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
    ],
    [
      totalProvisionedEquipment,
      equipmentInServiceCount,
      equipmentWithClientsCount,
      totalAssociated,
      trafficBytesUpstream,
      trafficBytesDownstream,
    ]
  );

  const pieChartData = useMemo(() => [equipmentCountPerOui, clientCountPerOui], [
    equipmentCountPerOui,
    clientCountPerOui,
  ]);

  if (loading || metricsLoading) {
    return <Loading />;
  }

  if (error) {
    return <Alert message="Error" description="Failed to load Dashboard" type="error" showIcon />;
  }

  if (metricsError) {
    return (
      <Alert message="Error" description="Failed to load line charts data" type="error" showIcon />
    );
  }

  return (
    <DashboardPage
      pieChartTitle={pieChartTitle}
      statsArr={statsArr}
      pieChartData={pieChartData}
      lineChartData={lineChartsData}
      lineChartTitle={lineChartTitle}
      lineChartLoading={metricsLoading}
    />
  );
};

export default Dashboard;
