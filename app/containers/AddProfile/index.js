import React, { useContext } from 'react';
import { AddProfile as AddProfilePage } from '@tip-wlan/wlan-cloud-ui-library';
import { useMutation, useQuery, gql } from '@apollo/client';
import { notification } from 'antd';
import { useHistory } from 'react-router-dom';

import { ROUTES, AUTH_TOKEN } from 'constants/index';
import UserContext from 'contexts/UserContext';
import { GET_ALL_PROFILES, GET_API_URL } from 'graphql/queries';
import { fetchMoreProfiles } from 'graphql/functions';
import { getItem } from 'utils/localStorage';

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

  const { data: apiUrl } = useQuery(GET_API_URL);

  const { data: ssidProfiles, fetchMore } = useQuery(GET_ALL_PROFILES(), {
    variables: { customerId, type: 'ssid' },
    fetchPolicy: 'network-only',
  });
  const { data: radiusProfiles, fetchMore: fetchMoreRadiusProfiles } = useQuery(
    GET_ALL_PROFILES(),
    {
      variables: { customerId, type: 'radius' },
      fetchPolicy: 'network-only',
    }
  );
  const { data: captiveProfiles, fetchMore: fetchMoreCaptiveProfiles } = useQuery(
    GET_ALL_PROFILES(),
    {
      variables: { customerId, type: 'captive_portal' },
      fetchPolicy: 'network-only',
    }
  );
  const { data: venueProfiles, fetchMore: fetchMoreVenueProfiles } = useQuery(GET_ALL_PROFILES(), {
    variables: { customerId, type: 'passpoint_venue' },
    fetchPolicy: 'network-only',
  });
  const { data: operatorProfiles, fetchMore: fetchMoreOperatorProfiles } = useQuery(
    GET_ALL_PROFILES(),
    {
      variables: { customerId, type: 'passpoint_operator' },
      fetchPolicy: 'network-only',
    }
  );
  const { data: idProviderProfiles, fetchMore: fetchMoreIdProviderProfiles } = useQuery(
    GET_ALL_PROFILES(),
    {
      variables: { customerId, type: 'passpoint_osu_id_provider' },
      fetchPolicy: 'network-only',
    }
  );
  const { data: rfProfiles, fetchMore: fetchMoreRfProfiles } = useQuery(GET_ALL_PROFILES(), {
    variables: { customerId, type: 'rf' },
    fetchPolicy: 'network-only',
  });

  const { data: passpointProfiles, fetchMore: fetchMorePasspointProfiles } = useQuery(
    GET_ALL_PROFILES(),
    {
      variables: { customerId, type: 'passpoint' },
      fetchPolicy: 'network-only',
    }
  );

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

  const handleFetchMoreProfiles = (e, key) => {
    if (key === 'radius') fetchMoreProfiles(e, radiusProfiles, fetchMoreRadiusProfiles);
    else if (key === 'captive_portal')
      fetchMoreProfiles(e, captiveProfiles, fetchMoreCaptiveProfiles);
    else if (key === 'rf') fetchMoreProfiles(e, rfProfiles, fetchMoreRfProfiles);
    else if (key === 'passpoint_venue') fetchMoreProfiles(e, venueProfiles, fetchMoreVenueProfiles);
    else if (key === 'passpoint_operator')
      fetchMoreProfiles(e, operatorProfiles, fetchMoreOperatorProfiles);
    else if (key === 'passpoint_osu_id_provider')
      fetchMoreProfiles(e, idProviderProfiles, fetchMoreIdProviderProfiles);
    else if (key === 'passpoint')
      fetchMoreProfiles(e, passpointProfiles, fetchMorePasspointProfiles);
    else fetchMoreProfiles(e, ssidProfiles, fetchMore);
  };

  const handleFileUpload = async (fileName, file) => {
    const token = getItem(AUTH_TOKEN);

    if (apiUrl?.getApiUrl) {
      fetch(`${apiUrl?.getApiUrl}filestore/${fileName}`, {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token.access_token}` : '',
          'Content-Type': 'application/octet-stream',
        },
        body: file,
      })
        .then(response => response.json())
        .then(resp => {
          if (resp?.success) {
            notification.success({
              message: 'Success',
              description: 'File successfully uploaded.',
            });
          } else {
            notification.error({
              message: 'Error',
              description: 'File could not be uploaded.',
            });
          }
        })
        .catch(() => {
          notification.error({
            message: 'Error',
            description: 'File could not be uploaded.',
          });
        });
    } else {
      notification.error({
        message: 'Error',
        description: 'File could not be uploaded.',
      });
    }
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
      passpointProfiles={passpointProfiles?.getAllProfiles?.items}
      onFetchMoreProfiles={handleFetchMoreProfiles}
      fileUpload={handleFileUpload}
    />
  );
};

export default AddProfile;
