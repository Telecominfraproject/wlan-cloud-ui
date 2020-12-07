import React, { useContext } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { notification } from 'antd';
import { AutoProvision as AutoProvisionPage } from '@tip-wlan/wlan-cloud-ui-library';

import UserContext from 'contexts/UserContext';
import { GET_CUSTOMER, GET_ALL_LOCATIONS, GET_ALL_PROFILES } from 'graphql/queries';
import { UPDATE_CUSTOMER } from 'graphql/mutations';
import { withQuery } from 'containers/QueryWrapper';

const AutoProvision = withQuery(
  ({ data, refetch }) => {
    const { customerId } = useContext(UserContext);
    const [updateCustomer] = useMutation(UPDATE_CUSTOMER);

    const { data: dataLocation, loading: loadingLoaction, error: errorLocation } = useQuery(
      GET_ALL_LOCATIONS,
      {
        variables: { customerId },
      }
    );
    const { data: dataProfile, loading: loadingProfile, error: errorProfile } = useQuery(
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
  },
  GET_CUSTOMER,
  () => {
    const { customerId } = useContext(UserContext);
    return { id: customerId };
  }
);

export default AutoProvision;
