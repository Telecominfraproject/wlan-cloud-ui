import React, { useContext, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Alert, notification } from 'antd';
import { AutoProvision as AutoProvisionPage, Loading } from '@tip-wlan/wlan-cloud-ui-library';

import UserContext from 'contexts/UserContext';
import { GET_CUSTOMER, GET_ALL_LOCATIONS, GET_ALL_PROFILES } from 'graphql/queries';
import { UPDATE_CUSTOMER } from 'graphql/mutations';
import { fetchMoreProfiles } from 'graphql/functions';
import { formatLocations } from 'utils/locations';

const AutoProvision = () => {
  const { customerId } = useContext(UserContext);
  const { data, loading, error, refetch } = useQuery(GET_CUSTOMER, {
    variables: { id: customerId },
  });
  const [updateCustomer] = useMutation(UPDATE_CUSTOMER);

  const { data: dataLocation, loading: loadingLocation, error: errorLocation } = useQuery(
    GET_ALL_LOCATIONS,
    {
      variables: { customerId },
    }
  );
  const { data: dataProfile, loading: loadingProfile, error: errorProfile, fetchMore } = useQuery(
    GET_ALL_PROFILES(),
    {
      variables: { customerId, type: 'equipment_ap', limit: 100 },
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

  const handleFetchMoreProfiles = e => {
    fetchMoreProfiles(e, dataProfile, fetchMore);
  };

  const locationsTree = useMemo(() => {
    return formatLocations(dataLocation?.getAllLocations, true);
  }, [dataLocation?.getAllLocations]);

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
      data={data?.getCustomer}
      locationsTree={locationsTree}
      dataProfile={dataProfile?.getAllProfiles?.items}
      loadingLocation={loadingLocation}
      loadingProfile={loadingProfile}
      errorLocation={errorLocation}
      errorProfile={errorProfile}
      onUpdateCustomer={handleUpdateCustomer}
      onFetchMoreProfiles={handleFetchMoreProfiles}
    />
  );
};

export default AutoProvision;
