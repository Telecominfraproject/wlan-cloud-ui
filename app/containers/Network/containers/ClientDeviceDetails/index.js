import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { Alert } from 'antd';
import {
  Loading,
  ClientDeviceDetails as ClientDevicesDetails,
} from '@tip-wlan/wlan-cloud-ui-library';
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

  const {
    macAddress,
    ipAddress,
    hostname,
    ssid,
    radioType,
    signal,
    equipment: { name },
    details: {
      assocTimestamp,
      dhcpDetails,
      metricDetails: { rxBytes, txBytes, rxMbps, txMbps, totalRxPackets, totalTxPackets },
    },
  } = data.getClientSession[0];

  /*
 assocTimestamp = Associated On
 equipment.name = Access Point
 radioType = Radio Band
 signal = Signal Strength
 rxMbps = Rx Rate
 txMbps = Tx Rate

 rxBytes = Rx Throughput
 txBytes = Tx Throughput
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
      <ClientDevicesDetails
        macAddress={macAddress}
        ipAddress={ipAddress}
        hostname={hostname}
        ssid={ssid}
        radioType={radioType}
        signal={signal}
        name={name}
        assocTimestamp={assocTimestamp}
        rxMbps={rxMbps}
        txMbps={txMbps}
        totalRxPackets={totalRxPackets}
        totalTxPackets={totalTxPackets}
        dhcpDetails={dhcpDetails}
        rxBytes={rxBytes}
        txBytes={txBytes}
      />
    </>
  );
};

ClientDeviceDetails.propTypes = {};

export default ClientDeviceDetails;
