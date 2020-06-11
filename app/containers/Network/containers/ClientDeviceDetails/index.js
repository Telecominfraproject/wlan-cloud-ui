import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { Alert } from 'antd';
import moment from 'moment';
import { Loading, DeviceHistory } from '@tip-wlan/wlan-cloud-ui-library';

import { METRICS_DATA } from 'constants/index';
import UserContext from 'contexts/UserContext';
import { GET_CLIENT_SESSION, FILTER_SERVICE_METRICS } from 'graphql/queries';

const ClientDeviceDetails = () => {
  const toTime = moment();
  const fromTime = toTime.subtract(4, 'hours');

  const { id } = useParams();
  const { customerId } = useContext(UserContext);
  const { loading, error, data } = useQuery(GET_CLIENT_SESSION, {
    variables: { customerId, macAddress: id },
  });

  const { loading: metricsLoading, error: metricsError } = useQuery(FILTER_SERVICE_METRICS, {
    variables: {
      customerId,
      fromTime: fromTime.unix(),
      toTime: toTime.unix(),
      clientMacs: [id],
      dataTypes: ['Client'],
    },
  });

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Alert message="Error" description="Failed to load Client Device." type="error" showIcon />
    );
  }

  /*
  const {
    macAddress,
    ipAddress,
    hostname,
    ssid,
    radioType,
    signal,
    equipment: { name },
    details: { assocTimestamp, rxMbps, txMbps, rxRateKbps, txRateKbps, 
      dhcpDetails: {dhcpServerIp, primaryDns, secondaryDns, gatewayIp, subnetMask, leaseTimeInSeconds, leaseStartTimestamp}
    },
  } = data.getClientSession[0];

  assocTimestamp = Associated On
  equipment.name = Access Point
  radioType = Radio Band
  signal = Signal Strength
  rxMbps = Rx Rate
  txMbps = Tx Rate

  rxRateKbps = Rx Throughput
  txRateKbps = Tx Throughput
  totalRxPackets = Total Rx Packets
  totalTxPackets = Total Tx Packets
  
  dhcpServerIp = DHCP Server
  primaryDns = Primary DNS
  secondaryDns = Secondary DNS
  gatewayIp = Gateway
  subnetMask = Subnet Mask
  leaseTimeInSeconds = IP Lease Time
  leaseStartTimestamp = IP Lease Start

  */

  return (
    <>
      <h1>Client Device Details: {data.getClientSession[0].macAddress}</h1>
      {metricsError && (
        <Alert message="Error" description="Failed to load History˝." type="error" showIcon />
      )}
      <DeviceHistory loading={metricsLoading} historyDate={toTime} data={METRICS_DATA} />
    </>
  );
};

export default ClientDeviceDetails;
