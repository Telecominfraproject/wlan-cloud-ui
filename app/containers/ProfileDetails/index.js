import React, { useState, useContext } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Alert, notification } from 'antd';
import { ProfileDetails as ProfileDetailsPage, Loading } from '@tip-wlan/wlan-cloud-ui-library';

import { ROUTES, AUTH_TOKEN } from 'constants/index';
import UserContext from 'contexts/UserContext';
import { GET_ALL_PROFILES, GET_API_URL } from 'graphql/queries';
import { fetchMoreProfiles } from 'graphql/functions';
import { getItem } from 'utils/localStorage';

const GET_PROFILE = gql`
  query GetProfile($id: ID!) {
    getProfile(id: $id) {
      id
      profileType
      customerId
      name
      childProfiles {
        id
        name
        profileType
        details
      }
      associatedSsidProfiles {
        id
        name
        profileType
        details
      }
      osuSsidProfile {
        id
        name
      }
      childProfileIds
      createdTimestamp
      lastModifiedTimestamp
      details
    }
  }
`;

const UPDATE_PROFILE = gql`
  mutation UpdateProfile(
    $id: ID!
    $profileType: String!
    $customerId: ID!
    $name: String!
    $childProfileIds: [ID]
    $lastModifiedTimestamp: String
    $details: JSONObject
  ) {
    updateProfile(
      id: $id
      profileType: $profileType
      customerId: $customerId
      name: $name
      childProfileIds: $childProfileIds
      lastModifiedTimestamp: $lastModifiedTimestamp
      details: $details
    ) {
      id
      profileType
      customerId
      name
      childProfileIds
      lastModifiedTimestamp
      details
    }
  }
`;

const DELETE_PROFILE = gql`
  mutation DeleteProfile($id: ID!) {
    deleteProfile(id: $id) {
      id
    }
  }
`;

const ProfileDetails = () => {
  const { customerId } = useContext(UserContext);
  const { id } = useParams();

  const [redirect, setRedirect] = useState(false);

  const { data: apiUrl } = useQuery(GET_API_URL);

  const { loading, error, data } = useQuery(GET_PROFILE, {
    variables: { id },
    fetchPolicy: 'network-only',
  });

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

  const [updateProfile] = useMutation(UPDATE_PROFILE);
  const [deleteProfile] = useMutation(DELETE_PROFILE);

  const handleDeleteProfile = () => {
    deleteProfile({ variables: { id } })
      .then(() => {
        notification.success({
          message: 'Success',
          description: 'Profile successfully deleted.',
        });

        setRedirect(true);
      })
      .catch(() =>
        notification.error({
          message: 'Error',
          description: 'Profile could not be deleted.',
        })
      );
  };

  const handleUpdateProfile = (
    name,
    details,
    childProfileIds = data.getProfile.childProfileIds
  ) => {
    updateProfile({
      variables: {
        ...data.getProfile,
        name,
        childProfileIds,
        details,
      },
    })
      .then(() => {
        notification.success({
          message: 'Success',
          description: 'Profile successfully updated.',
        });
      })
      .catch(() =>
        notification.error({
          message: 'Error',
          description: 'Profile could not be updated.',
        })
      );
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

  const handleDownloadFile = async name => {
    const token = getItem(AUTH_TOKEN);
    if (apiUrl?.getApiUrl) {
      return fetch(`${apiUrl?.getApiUrl}filestore/${encodeURIComponent(name)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/octet-stream',
          Authorization: token ? `Bearer ${token.access_token}` : '',
        },
      })
        .then(response => response.blob())
        .then(blob => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        })
        .catch(() => {
          notification.error({
            message: 'Error',
            description: 'File could not be retrieved.',
          });
        });
    }
    return notification.error({
      message: 'Error',
      description: 'File could not be retrieved.',
    });
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
    else fetchMoreProfiles(e, ssidProfiles, fetchMore);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Alert message="Error" description="Failed to load profile data." type="error" showIcon />
    );
  }

  if (redirect) {
    return <Redirect to={ROUTES.profiles} />;
  }

  return (
    <ProfileDetailsPage
      name={data.getProfile.name}
      profileType={data.getProfile.profileType}
      details={data.getProfile.details}
      childProfiles={data.getProfile.childProfiles}
      childProfileIds={data.getProfile.childProfileIds}
      onDeleteProfile={handleDeleteProfile}
      onUpdateProfile={handleUpdateProfile}
      ssidProfiles={ssidProfiles?.getAllProfiles?.items}
      rfProfiles={rfProfiles?.getAllProfiles?.items}
      radiusProfiles={radiusProfiles?.getAllProfiles?.items}
      captiveProfiles={captiveProfiles?.getAllProfiles?.items}
      venueProfiles={venueProfiles?.getAllProfiles?.items}
      operatorProfiles={operatorProfiles?.getAllProfiles?.items}
      idProviderProfiles={idProviderProfiles?.getAllProfiles?.items}
      associatedSsidProfiles={data.getProfile?.associatedSsidProfiles}
      osuSsidProfile={data.getProfile?.osuSsidProfile}
      fileUpload={handleFileUpload}
      onFetchMoreProfiles={handleFetchMoreProfiles}
      onDownloadFile={handleDownloadFile}
    />
  );
};

export default ProfileDetails;
