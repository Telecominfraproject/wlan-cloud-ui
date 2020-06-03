import React from 'react';
import { useParams } from 'react-router-dom';

const ClientDeviceDetails = () => {
  const { id } = useParams();
  return <h1>Client Device Details: {id}</h1>;
};

export default ClientDeviceDetails;
