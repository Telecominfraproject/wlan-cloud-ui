import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { Alert } from 'antd';
import { Loading } from '@tip-wlan/wlan-cloud-ui-library';

import UserContext from 'contexts/UserContext';
import { GET_CLIENT_SESSION } from 'graphql/queries';

const ClientDeviceDetails = () => {
  const { id } = useParams();
  const { customerId } = useContext(UserContext);
  const { loading, error, data } = useQuery(GET_CLIENT_SESSION, {
    variables: { customerId, macAddress: id },
  });

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Alert message="Error" description="Failed to load Client Device." type="error" showIcon />
    );
  }

  const { macAddress } = data.getClientSession[0];

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
  rxRateKbps = Rx Rate
  txRateKbps = Tx Rate

  Data Transfered = rxBytes + txBytes
  rxMbps = Rx Throughput
  txMbps = Tx Throughputhttps://www.lowes.ca/product/bathtub-shower-door-glass/jade-bath-60-in-sliding-bathroom-door-330585448
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

  return <h1>Client Device Details: {macAddress}</h1>;
};

export default ClientDeviceDetails;
