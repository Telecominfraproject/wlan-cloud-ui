import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Alert } from 'antd';
import moment from 'moment';
import { NetworkStatus } from 'apollo-client';
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

  const [lineChartData, setLineChartData] = useState({
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
  });

  const [graphTime] = useState({
    toTime: moment()
      .valueOf()
      .toString(),
    fromTime: moment()
      .subtract(24, 'hours')
      .valueOf()
      .toString(),
  });

  const {
    loading: metricsLoading,
    error: metricsError,
    data: metricsData,
    networkStatus,
    fetchMore,
  } = useQuery(FILTER_SYSTEM_EVENTS, {
    variables: {
      customerId,
      fromTime: graphTime.fromTime,
      toTime: graphTime.toTime,
      equipmentIds: [0],
      dataTypes: ['StatusChangedEvent'],
      limit: 1000,
    },
  });

  useEffect(() => {
    setInterval(() => {
      const toTime = moment()
        .valueOf()
        .toString();
      const fromTime = moment()
        .subtract(5, 'minutes')
        .valueOf()
        .toString();
      fetchMore({
        variables: {
          customerId,
          fromTime,
          toTime,
          equipmentIds: [0],
          dataTypes: ['StatusChangedEvent'],
          limit: 100,
        },
        updateQuery: (
          _,
          {
            fetchMoreResult: {
              filterSystemEvents: { items },
            },
          }
        ) => {
          if (items.length) {
            const clientDevicesData = lineChartData.clientDevices?.data || {};
            const inservicesAPs = [];
            const trafficBytesDownstreamData = [];
            const trafficBytesUpstreamData = [];

            items.forEach(
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
                inservicesAPs.push([eventTimestamp, equipmentInServiceCount]);

                Object.keys(radios).forEach(key => {
                  if (!clientDevicesData[key]) {
                    clientDevicesData[key] = {
                      key: USER_FRIENDLY_RADIOS[key] || key,
                      more: [],
                    };
                  }
                  clientDevicesData[key].more.push([eventTimestamp, radios[key]]);
                });

                trafficBytesDownstreamData.push([eventTimestamp, trafficBytesDownstream]);
                trafficBytesUpstreamData.push([eventTimestamp, trafficBytesUpstream]);
              }
            );
            const result = {
              ...lineChartData,
              inservicesAPs: {
                ...lineChartData.inservicesAPs,
                data: {
                  ...lineChartData.inservicesAPs.data,
                  more: inservicesAPs,
                },
              },
              clientDevices: {
                ...lineChartData.clientDevices,
                data: { ...clientDevicesData },
              },
              traffic: {
                ...lineChartData.traffic,
                data: {
                  ...lineChartData.traffic.data,
                  trafficBytesDownstream: {
                    ...lineChartData.traffic.data.trafficBytesDownstream,
                    more: trafficBytesDownstreamData,
                  },
                  trafficBytesUpstream: {
                    ...lineChartData.traffic.data.trafficBytesUpstream,
                    more: trafficBytesUpstreamData,
                  },
                },
              },
            };
            setLineChartData(result);
          }
        },
      });
    }, 300000);
  }, []);

  const formatLineChartData = (list = []) => {
    if (list.length) {
      const clientDevicesData = lineChartData.clientDevices?.data || {};
      const inservicesAPs = lineChartData.inservicesAPs.data.value;
      const trafficBytesDownstreamData = lineChartData.traffic.data.trafficBytesDownstream.value;
      const trafficBytesUpstreamData = lineChartData.traffic.data.trafficBytesUpstream.value;

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
          inservicesAPs.push([eventTimestamp, equipmentInServiceCount]);
          Object.keys(radios).forEach(key => {
            if (!clientDevicesData[key]) {
              clientDevicesData[key] = {
                key: USER_FRIENDLY_RADIOS[key] || key,
                value: [],
              };
            }
            clientDevicesData[key].value.push([eventTimestamp, radios[key]]);
          });

          trafficBytesDownstreamData.push([eventTimestamp, trafficBytesDownstream]);
          trafficBytesUpstreamData.push([eventTimestamp, trafficBytesUpstream]);
        }
      );
      const result = {
        ...lineChartData,
        inservicesAPs: {
          ...lineChartData.inservicesAPs,
          data: { ...lineChartData.inservicesAPs.data, value: inservicesAPs },
        },
        clientDevices: {
          ...lineChartData.clientDevices,
          data: { ...clientDevicesData },
        },
        traffic: {
          ...lineChartData.traffic,
          data: {
            ...lineChartData.traffic.data,
            trafficBytesDownstream: {
              ...lineChartData.traffic.data.trafficBytesDownstream,
              value: trafficBytesDownstreamData,
            },
            trafficBytesUpstream: {
              ...lineChartData.traffic.data.trafficBytesUpstream,
              value: trafficBytesUpstreamData,
            },
          },
        },
      };
      setLineChartData(result);
    }
  };

  useEffect(() => formatLineChartData(metricsData?.filterSystemEvents?.items), [metricsData]);

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
      lineChartDetails={lineChartData}
      lineChartLoading={metricsLoading && networkStatus === NetworkStatus.loading}
      lineChartError={metricsError}
    />
  );
};

export default Dashboard;
