import React, { useContext } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Alert, notification } from 'antd';
import { GET_CUSTOMER, GET_ALL_LOCATIONS, GET_ALL_PROFILES } from 'graphql/queries';
import { UPDATE_CUSTOMER } from 'graphql/mutations';

import UserContext from 'contexts/UserContext';
import { AutoProvision as AutoProvisionPage, Loading } from '@tip-wlan/wlan-cloud-ui-library';

const AutoProvision = () => {
  const { customerId } = useContext(UserContext);
  const { data, loading, error, refetch } = useQuery(GET_CUSTOMER, {
    variables: { id: customerId },
  });
  const [updateCustomer] = useMutation(UPDATE_CUSTOMER);

  const { data: dataLocation, loading: loadingLoaction, error: errorLocation } = useQuery(
    GET_ALL_LOCATIONS,
    {
      variables: { customerId },
    }
  );
  const { data: dataProfile, loading: loadingProfile, error: errorProfile } = useQuery(
    GET_ALL_PROFILES,
    {
      variables: { customerId, type: 'equipment_ap' },
    }
  );

  const handleUpdateCustomer = (
    id,
    email,
    name,
    details,
    createdTimestamp,
    lastModifiedTimestamp
  ) => {
    updateCustomer({
      variables: {
        id,
        email,
        name,
        details,
        createdTimestamp,
        lastModifiedTimestamp,
      },
    })
      .then(() => {
        refetch();
        notification.success({
          message: 'Success',
          description: 'Settings successfully updated.',
        });
      })
      .catch(() =>
        notification.error({
          message: 'Error',
          description: 'Settings could not be updated.',
        })
      );
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Alert message="Error" description="Failed to load Customer Data." type="error" showIcon />
    );
  }

  return (
    <AutoProvisionPage
      data={data && data.getCustomer}
      dataLocation={dataLocation && dataLocation.getAllLocations}
      dataProfile={dataProfile && dataProfile.getAllProfiles.items}
      loadingLoaction={loadingLoaction}
      loadingProfile={loadingProfile}
      errorLocation={errorLocation}
      errorProfile={errorProfile}
      onUpdateCustomer={handleUpdateCustomer}
    />
  );
};

export default AutoProvision;
