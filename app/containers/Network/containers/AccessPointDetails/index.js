import React from 'react';
import { useParams } from 'react-router-dom';

const AccessPointDetails = () => {
  const { id } = useParams();
  return <h1>Access Point Details: {id}</h1>;
};

export default AccessPointDetails;
