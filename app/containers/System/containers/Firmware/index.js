import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Alert } from 'antd';
import { GET_ALL_FIRMWARE } from 'graphql/queries';
import { Firmware as FirmwarePage, Loading } from '@tip-wlan/wlan-cloud-ui-library';

const Firmware = () => {
  const { data, error, loading } = useQuery(GET_ALL_FIRMWARE);

  if (error) {
    return (
      <Alert message="Error" description="Failed to load Firmware data." type="error" showIcon />
    );
  }

  if (loading) {
    return <Loading />;
  }

  return <FirmwarePage firmwareData={data && data.getAllFirmware} />;
};

export default Firmware;
