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

const Dashboard = () => {
  const { customerId } = useContext(UserContext);
  const [clientCountPerOui, setClientCountPerOui] = useState([]);
  const [equipmentCountPerOui, setEquipmentCountPerOui] = useState([]);
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
      inservicesAPs: { title: 'Inservice APs (24hours)', key: 'Inservice APs', value: [] },
      clientDevices: { title: 'Client Devices (24hours)' },
      traffic: {
        title: 'Traffic (24hours)',
        trafficBytesDownstream: { key: 'Down Stream', value: [] },
        trafficBytesUpstream: { key: 'Up Stream', value: [] },
      },
    };
    const clientDevicesData = [];
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
          if (clientDevicesData[key]) {
            clientDevicesData[key].value.push([eventTimestamp, radios[key]]);
            return;
          }
          clientDevicesData[key] = {
            key: clientDevicesKeyMap[key] || key,
            value: [[eventTimestamp, radios[key]]],
          };
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
    return {
      ...lineChartData,
      clientDevices: { ...lineChartData.clientDevices, ...clientDevicesData },
    };
  };

  const lineChartsData = useMemo(
    () => formatLineChartData(metricsData?.filterSystemEvents?.items),
    [metricsData]
  );

  const statsArr = useMemo(() => {
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

    const {
      clientCountPerOui: clientPerOui,
      equipmentCountPerOui: equipmentPerOui,
    } = status.details;

    setClientCountPerOui({ title: 'Client Vendors', ...clientPerOui });
    setEquipmentCountPerOui({ title: 'AP Vendors', ...equipmentPerOui });

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
        ...frequencies,
      },
      {
        title: 'Usage Information',
        'Total Traffic (US)': formatBytes(trafficBytesUpstream),
        'Total Traffic (DS)': formatBytes(trafficBytesDownstream),
      },
    ];
  }, [data]);

  const pieChartsData = useMemo(() => [equipmentCountPerOui, clientCountPerOui], [
    equipmentCountPerOui,
    clientCountPerOui,
  ]);

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
