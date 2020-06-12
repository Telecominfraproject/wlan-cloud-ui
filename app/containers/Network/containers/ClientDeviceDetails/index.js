import React, { useContext, useState } from 'react';
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
  const [generalCardState, setGeneralcardState] = useState([
    {
      Status: '',
      'Associated On': '',
      'Access Point': '',
      SSID: '',
      'Radio Band': '',
      'Signal Strength': '',
      'Tx Rate': '',
      'Rx Rate': '',
    },
  ]);
  const [trafficCardState, setTrafficcardState] = useState([
    {
      'Data Transferred': '',
      'Tx Throughput': '',
      'Rx Throughput': '',
      'Total Tx Packets': '',
      'Total Rx Packets': '',
    },
  ]);
  const [ipLanCardState, setIpLancardState] = useState([
    {
      'IPv4 Address': '',
      'DHCP Server': '',
      'Primary DNS': '',
      'Secondary DNS': '',
      'Gateway ': '',
      'Subnet Mask': '',
      'IP Lease Time': '',
      'IP Lease Start': '',
    },
  ]);

  const [detailsObject, setDetailsObject] = useState({
    macAddress: '',
    ipAddress: '',
    hostName: '',
    ssid: '',
    radioType: '',
    signal: '',
    equipmentName: '',
  });

  const { id } = useParams();
  const { customerId } = useContext(UserContext);
  const { loading, error, data } = useQuery(GET_CLIENT_SESSION, {
    variables: { customerId, macAddress: id },
    onCompleted: () => {
      const {
        macAddress,
        ipAddress,
        hostName,
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

      const {
        dhcpServerIp,
        primaryDns,
        secondaryDns,
        gatewayIp,
        subnetMask,
        leaseTimeInSeconds,
        leaseStartTimestamp,
      } = dhcpDetails || {};

      setDetailsObject({
        macAddress,
        ipAddress,
        hostName,
        radioType,
        signal,
        equipmentName: name,
      });

      setGeneralcardState([
        {
          Status: '',
          'Associated On': assocTimestamp,
          'Access Point': name,
          SSID: ssid,
          'Radio Band': radioType,
          'Signal Strength': signal,
          'Tx Rate': rxMbps,
          'Rx Rate': txMbps,
        },
      ]);
      setTrafficcardState([
        {
          'Data Transferred': '',
          'Tx Throughput': txBytes,
          'Rx Throughput': rxBytes,
          'Total Tx Packets': totalTxPackets,
          'Total Rx Packets': totalRxPackets,
        },
      ]);
      setIpLancardState([
        {
          'IPv4 Address': '',
          'DHCP Server': dhcpServerIp,
          'Primary DNS': primaryDns,
          'Secondary DNS': secondaryDns,
          'Gateway ': gatewayIp,
          'Subnet Mask': subnetMask,
          'IP Lease Time': leaseTimeInSeconds,
          'IP Lease Start': leaseStartTimestamp,
        },
      ]);
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
  const { macAddress, ipAddress, hostName, radioType, signal, equipmentName } = detailsObject;

  return (
    <>
      <ClientDevicesDetails
        macAddress={macAddress}
        ipAddress={ipAddress}
        hostname={hostName}
        radioType={radioType}
        signal={signal}
        name={equipmentName}
        generalCardState={generalCardState}
        trafficCardState={trafficCardState}
        ipLanCardState={ipLanCardState}
      />
    </>
  );
};

export default ClientDeviceDetails;
