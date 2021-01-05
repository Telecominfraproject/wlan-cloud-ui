import React, { useContext } from 'react';
import { AddProfile as AddProfilePage } from '@tip-wlan/wlan-cloud-ui-library';
import { useMutation, useQuery, gql } from '@apollo/client';
import { notification } from 'antd';
import { useHistory } from 'react-router-dom';

import { ROUTES } from 'constants/index';
import UserContext from 'contexts/UserContext';
import { GET_ALL_PROFILES } from 'graphql/queries';
import { updateQueryGetAllProfiles } from 'graphql/functions';

const CREATE_PROFILE = gql`
  mutation CreateProfile(
    $profileType: String!
    $customerId: ID!
    $name: String!
    $childProfileIds: [ID]
    $details: JSONObject
  ) {
    createProfile(
      profileType: $profileType
      customerId: $customerId
      name: $name
      childProfileIds: $childProfileIds
      details: $details
    ) {
      profileType
      customerId
      name
      childProfileIds
      details
    }
  }
`;

const AddProfile = () => {
  const { customerId } = useContext(UserContext);
  const { data: ssidProfiles, fetchMore } = useQuery(GET_ALL_PROFILES(), {
    variables: { customerId, type: 'ssid' },
  });
  const { data: radiusProfiles, fetchMore: fetchMoreRadiusProfiles } = useQuery(
    GET_ALL_PROFILES(),
    {
      variables: { customerId, type: 'radius' },
    }
  );
  const { data: captiveProfiles, fetchMore: fetchMoreCaptiveProfiles } = useQuery(
    GET_ALL_PROFILES(),
    {
      variables: { customerId, type: 'captive_portal' },
    }
  );
  const { data: venueProfiles, fetchMore: fetchMoreVenueProfiles } = useQuery(GET_ALL_PROFILES(), {
    variables: { customerId, type: 'passpoint_venue' },
  });
  const { data: operatorProfiles, fetchMore: fetchMoreOperatorProfiles } = useQuery(
    GET_ALL_PROFILES(),
    {
      variables: { customerId, type: 'passpoint_operator' },
    }
  );
  const { data: idProviderProfiles, fetchMore: fetchMoreIdProviderProfiles } = useQuery(
    GET_ALL_PROFILES(),
    {
      variables: { customerId, type: 'passpoint_osu_id_provider' },
    }
  );
  const { data: rfProfiles, fetchMore: fetchMoreRfProfiles } = useQuery(GET_ALL_PROFILES(), {
    variables: { customerId, type: 'rf' },
  });
  const [createProfile] = useMutation(CREATE_PROFILE);
  const history = useHistory();

  const handleAddProfile = (profileType, name, details, childProfileIds = []) => {
    createProfile({
      variables: {
        profileType,
        customerId,
        name,
        childProfileIds,
        details,
      },
    })
      .then(() => {
        notification.success({
          message: 'Success',
          description: 'Profile successfully created.',
        });
        history.push(ROUTES.profiles, { refetch: true });
      })
      .catch(() =>
        notification.error({
          message: 'Error',
          description: 'Profile could not be created.',
        })
      );
  };

  const handleFetchProfiles = e => {
    if (ssidProfiles.getAllProfiles.context.lastPage) {
      return false;
    }

    e.persist();
    const { target } = e;

    if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
      fetchMore({
        variables: { context: { ...ssidProfiles.getAllProfiles.context } },
        updateQuery: updateQueryGetAllProfiles,
      });
    }

    return true;
  };

  const handleFetchRadiusProfiles = e => {
    if (radiusProfiles.getAllProfiles.context.lastPage) {
      return false;
    }

    e.persist();
    const { target } = e;

    if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
      fetchMoreRadiusProfiles({
        variables: { context: { ...radiusProfiles.getAllProfiles.context } },
        updateQuery: updateQueryGetAllProfiles,
      });
    }

    return true;
  };

  const handleFetchCaptiveProfiles = e => {
    if (captiveProfiles.getAllProfiles.context.lastPage) {
      return false;
    }

    e.persist();
    const { target } = e;

    if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
      fetchMoreCaptiveProfiles({
        variables: { context: { ...captiveProfiles.getAllProfiles.context } },
        updateQuery: updateQueryGetAllProfiles,
      });
    }

    return true;
  };

  const handleFetchVenueProfiles = e => {
    if (venueProfiles.getAllProfiles.context.lastPage) {
      return false;
    }

    e.persist();
    const { target } = e;

    if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
      fetchMoreVenueProfiles({
        variables: { context: { ...venueProfiles.getAllProfiles.context } },
        updateQuery: updateQueryGetAllProfiles,
      });
    }

    return true;
  };

  const handleFetchRfProfiles = e => {
    if (rfProfiles.getAllProfiles.context.lastPage) {
      return false;
    }

    e.persist();
    const { target } = e;

    if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
      fetchMoreRfProfiles({
        variables: { context: { ...rfProfiles.getAllProfiles.context } },
        updateQuery: updateQueryGetAllProfiles,
      });
    }

    return true;
  };

  const handleFetchOperatorProfiles = e => {
    if (operatorProfiles.getAllProfiles.context.lastPage) {
      return false;
    }

    e.persist();
    const { target } = e;

    if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
      fetchMoreOperatorProfiles({
        variables: { context: { ...operatorProfiles.getAllProfiles.context } },
        updateQuery: updateQueryGetAllProfiles,
      });
    }

    return true;
  };

  const handleFetchIdProviderProfiles = e => {
    if (idProviderProfiles.getAllProfiles.context.lastPage) {
      return false;
    }

    e.persist();
    const { target } = e;

    if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
      fetchMoreIdProviderProfiles({
        variables: { context: { ...idProviderProfiles.getAllProfiles.context } },
        updateQuery: updateQueryGetAllProfiles,
      });
    }

    return true;
  };

  return (
    <AddProfilePage
      onCreateProfile={handleAddProfile}
      ssidProfiles={ssidProfiles?.getAllProfiles?.items}
      radiusProfiles={radiusProfiles?.getAllProfiles?.items}
      captiveProfiles={captiveProfiles?.getAllProfiles?.items}
      venueProfiles={venueProfiles?.getAllProfiles?.items}
      operatorProfiles={operatorProfiles?.getAllProfiles?.items}
      idProviderProfiles={idProviderProfiles?.getAllProfiles?.items}
      rfProfiles={rfProfiles?.getAllProfiles?.items}
      onFetchMoreProfiles={handleFetchProfiles}
      onFetchMoreRadiusProfiles={handleFetchRadiusProfiles}
      onFetchMoreCaptiveProfiles={handleFetchCaptiveProfiles}
      onFetchMoreVenueProfiles={handleFetchVenueProfiles}
      onFetchMoreOperatorProfiles={handleFetchOperatorProfiles}
      onFetchMoreIdProviderProfiles={handleFetchIdProviderProfiles}
      onFetchMoreRfProfiles={handleFetchRfProfiles}
    />
  );
};

export default AddProfile;
