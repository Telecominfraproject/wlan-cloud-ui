import React, { useContext, useMemo, useState } from 'react';
import { Alert } from 'antd';
import moment from 'moment';
import { useQuery } from '@apollo/react-hooks';
import { Dashboard as DashboardPage, Loading } from '@tip-wlan/wlan-cloud-ui-library';
import UserContext from 'contexts/UserContext';
import { FILTER_SYSTEM_EVENTS, GET_ALL_STATUS } from 'graphql/queries';

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  // eslint-disable-next-line no-restricted-properties
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i] || ''}`;
}

function trafficLabelFormatter() {
  return formatBytes(this.value);
}

function trafficTooltipFormatter() {
  return `<span style="color:${this.color}">●</span> ${this.series.name}: <b>${formatBytes(
    this.y
  )}</b><br/>`;
}

const USER_FRIENDLY_RADIOS = {
  is2dot4GHz: '2.4GHz',
  is5GHzL: '5GHz (L)',
  is5GHzU: '5GHz (U)',
  is5GHz: '5GHz',
};

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
      .subtract(24, 'hours')
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
      limit: 1000,
    },
  });

  const formatLineChartData = (list = []) => {
    const lineChartData = {
      inservicesAPs: {
        title: 'Inservice APs (24 hours)',
        data: { key: 'Inservice APs', value: [] },
      },
      clientDevices: { title: 'Client Devices (24 hours)' },
      traffic: {
        title: 'Traffic (24 hours)',
        formatter: trafficLabelFormatter,
        tooltipFormatter: trafficTooltipFormatter,
        data: {
          trafficBytesDownstream: { key: 'Down Stream', value: [] },
          trafficBytesUpstream: { key: 'Up Stream', value: [] },
        },
      },
    };
    const clientDevicesData = {};

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
        lineChartData.inservicesAPs.data.value.push([eventTimestamp, equipmentInServiceCount]);
        Object.keys(radios).forEach(key => {
          if (!clientDevicesData[key]) {
            clientDevicesData[key] = {
              key: USER_FRIENDLY_RADIOS[key] || key,
              value: [],
            };
          }
          clientDevicesData[key].value.push([eventTimestamp, radios[key]]);
        });

        lineChartData.traffic.data.trafficBytesDownstream.value.push([
          eventTimestamp,
          trafficBytesDownstream,
        ]);
        lineChartData.traffic.data.trafficBytesUpstream.value.push([
          eventTimestamp,
          trafficBytesUpstream,
        ]);
      }
    );

    return {
      ...lineChartData,
      clientDevices: { ...lineChartData.clientDevices, data: { ...clientDevicesData } },
    };
  };

  const lineChartsData = useMemo(
    () => formatLineChartData(metricsData?.filterSystemEvents?.items),
    [metricsData]
  );

  const statsArr = useMemo(() => {
    const status = data?.getAllStatus?.items[0]?.detailsJSON || {};

    const {
      associatedClientsCountPerRadio,
      totalProvisionedEquipment,
      equipmentInServiceCount,
      equipmentWithClientsCount,
      trafficBytesDownstream,
      trafficBytesUpstream,
    } = status;

    const clientRadios = {};
    let totalAssociated = 0;
    if (associatedClientsCountPerRadio) {
      Object.keys(associatedClientsCountPerRadio).forEach(i => {
        if (i.includes('5GHz')) {
          if (!clientRadios['5GHz']) {
            clientRadios['5GHz'] = 0;
          }
          clientRadios['5GHz'] += associatedClientsCountPerRadio[i];
        } else {
          const key = USER_FRIENDLY_RADIOS[i] || i;
          clientRadios[key] = associatedClientsCountPerRadio[i];
        }
        totalAssociated += associatedClientsCountPerRadio[i];
      });
    }

    return [
      {
        title: 'Access Point',
        'Total Provisioned': totalProvisionedEquipment,
        'In Service': equipmentInServiceCount,
        'With Clients': equipmentWithClientsCount,
      },
      {
        title: 'Client Devices',
        'Total Associated': totalAssociated,
        ...clientRadios,
      },
      {
        title: 'Usage Information',
        'Total Traffic (US)': formatBytes(trafficBytesUpstream),
        'Total Traffic (DS)': formatBytes(trafficBytesDownstream),
      },
    ];
  }, [data]);

  const pieChartsData = useMemo(() => {
    const { clientCountPerOui, equipmentCountPerOui } = data?.getAllStatus?.items[0]?.details || {};

    return [
      { title: 'AP Vendors', ...equipmentCountPerOui },
      { title: 'Client Vendors', ...clientCountPerOui },
    ];
  }, [data]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Alert message="Error" description="Failed to load Dashboard" type="error" showIcon />;
  }

  return (
    <DashboardPage
      statsCardDetails={statsArr}
      pieChartDetails={pieChartsData}
      lineChartDetails={lineChartsData}
      lineChartLoading={metricsLoading}
      lineChartError={metricsError}
    />
  );
};

export default Dashboard;
