import React, { useContext, useEffect, useMemo, useState, useRef } from 'react';
import { Alert } from 'antd';
import moment from 'moment';
import { useQuery } from '@apollo/client';
import { Dashboard as DashboardPage, Loading } from '@tip-wlan/wlan-cloud-ui-library';
import UserContext from 'contexts/UserContext';
import { FILTER_SYSTEM_EVENTS, GET_ALL_STATUS } from 'graphql/queries';
import { USER_FRIENDLY_RADIOS } from 'constants/index';

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));

  // eslint-disable-next-line no-restricted-properties
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i] || ''}`;
}

function trafficLabelFormatter(bytes) {
  if (this?.value) {
    return formatBytes(this.value);
  }
  return formatBytes(bytes);
}

function trafficTooltipFormatter() {
  return `<span style="color:${this.color}">●</span> ${this.series.name}: <b>${formatBytes(
    this.y
  )}</b><br/>`;
}

const lineChartConfig = [
  { key: 'service', title: 'Inservice APs (24 hours)' },
  { key: 'clientDevices', title: 'Client Devices (24 hours)' },
  {
    key: 'traffic',
    title: 'Traffic (24 hours)',
    options: { formatter: trafficLabelFormatter, tooltipFormatter: trafficTooltipFormatter },
  },
];

const Dashboard = () => {
  const initialGraphTime = useRef({
    toTime: moment()
      .valueOf()
      .toString(),
    fromTime: moment()
      .subtract(24, 'hours')
      .valueOf()
      .toString(),
  });
  const { customerId } = useContext(UserContext);
  const { loading, error, data } = useQuery(GET_ALL_STATUS, {
    variables: { customerId, statusDataTypes: ['CUSTOMER_DASHBOARD'] },
  });

  const [lineChartData, setLineChartData] = useState({
    service: {
      inservicesAPs: {
        key: 'Inservice APs',
        value: [],
      },
    },
    clientDevices: {
      is2dot4GHz: {
        key: USER_FRIENDLY_RADIOS.is2dot4GHz,
        value: [],
      },
      is5GHz: {
        key: USER_FRIENDLY_RADIOS.is5GHz,
        value: [],
      },
    },
    traffic: {
      trafficBytesDownstream: {
        key: 'Down Stream',
        value: [],
      },
      trafficBytesUpstream: {
        key: 'Up Stream',
        value: [],
      },
    },
  });

  const { loading: metricsLoading, error: metricsError, data: metricsData, fetchMore } = useQuery(
    FILTER_SYSTEM_EVENTS,
    {
      variables: {
        customerId,
        fromTime: initialGraphTime.current.fromTime,
        toTime: initialGraphTime.current.toTime,
        equipmentIds: [0],
        dataTypes: ['StatusChangedEvent'],
        limit: 3000, // TODO: make get all in GraphQL
      },
    }
  );

  const formatLineChartData = (list = []) => {
    if (list.length) {
      setLineChartData(prev => {
        const inservicesAPs = [];
        const clientDevices2dot4GHz = [];
        const clientDevices5GHz = [];
        const trafficBytesDownstreamData = [];
        const trafficBytesUpstreamData = [];
        let totalDown = 0;
        let totalUp = 0;

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
            const timestamp = parseInt(eventTimestamp, 10);
            inservicesAPs.push({ timestamp, value: equipmentInServiceCount });

            let total5GHz = 0;
            total5GHz += (radios?.is5GHz || 0) + (radios?.is5GHzL || 0) + (radios?.is5GHzU || 0); // combine all 5GHz radios

            clientDevices2dot4GHz.push({ timestamp, value: radios.is2dot4GHz || 0 });
            clientDevices5GHz.push({ timestamp, value: total5GHz || 0 });

            trafficBytesDownstreamData.push({
              timestamp,
              value: (trafficBytesDownstream > 0 && trafficBytesDownstream) || 0,
            });
            trafficBytesUpstreamData.push({
              timestamp,
              value: (trafficBytesUpstream > 0 && trafficBytesUpstream) || 0,
            });

            totalDown += (trafficBytesDownstream > 0 && trafficBytesDownstream) || 0;
            totalUp += (trafficBytesUpstream > 0 && trafficBytesUpstream) || 0;
          }
        );

        return {
          service: {
            inservicesAPs: {
              ...prev.service.inservicesAPs,
              value: [...prev.service.inservicesAPs.value, ...inservicesAPs],
            },
          },
          clientDevices: {
            is2dot4GHz: {
              ...prev.clientDevices.is2dot4GHz,
              value: [...prev.clientDevices.is2dot4GHz.value, ...clientDevices2dot4GHz],
            },
            is5GHz: {
              ...prev.clientDevices.is5GHz,
              value: [...prev.clientDevices.is5GHz.value, ...clientDevices5GHz],
            },
          },
          traffic: {
            trafficBytesDownstream: {
              ...prev.traffic.trafficBytesDownstream,
              value: [...prev.traffic.trafficBytesDownstream.value, ...trafficBytesDownstreamData],
            },
            trafficBytesUpstream: {
              ...prev.traffic.trafficBytesUpstream,
              value: [...prev.traffic.trafficBytesUpstream.value, ...trafficBytesUpstreamData],
            },
          },
          totalDownstreamTraffic: totalDown,
          totalUpstreamTraffic: totalUp,
        };
      });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const toTime = moment()
        .valueOf()
        .toString();
      const fromTime = moment()
        .subtract(5, 'minutes')
        .valueOf()
        .toString();
      fetchMore({
        variables: {
          fromTime,
          toTime,
        },
        updateQuery: (_, { fetchMoreResult }) => {
          formatLineChartData(fetchMoreResult?.filterSystemEvents?.items);
        },
      });
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    formatLineChartData(metricsData?.filterSystemEvents?.items);
  }, [metricsData]);

  const statsData = useMemo(() => {
    const status = data?.getAllStatus?.items[0]?.detailsJSON || {};

    const {
      associatedClientsCountPerRadio,
      totalProvisionedEquipment,
      equipmentInServiceCount,
      equipmentWithClientsCount,
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

    return {
      totalProvisionedEquipment,
      equipmentInServiceCount,
      equipmentWithClientsCount,
      totalAssociated,
      clientRadios,
    };
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
      statsCardDetails={[
        {
          title: 'Access Point',
          'Total Provisioned': statsData?.totalProvisionedEquipment,
          'In Service': statsData?.equipmentInServiceCount,
          'With Clients': statsData?.equipmentWithClientsCount,
        },
        {
          title: 'Client Devices',
          'Total Associated': statsData?.totalAssociated,
          ...statsData?.clientRadios,
        },
        {
          title: 'Usage Information (24 hours)',
          'Total Traffic (US)': formatBytes(lineChartData?.totalUpstreamTraffic),
          'Total Traffic (DS)': formatBytes(lineChartData?.totalDownstreamTraffic),
        },
      ]}
      pieChartDetails={pieChartsData}
      lineChartData={lineChartData}
      lineChartConfig={lineChartConfig}
      lineChartLoading={metricsLoading}
      lineChartError={metricsError}
    />
  );
};

export default Dashboard;
