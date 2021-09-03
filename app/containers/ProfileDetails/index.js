import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { notification } from 'antd';
import { ProfileDetails as ProfileDetailsPage, Loading } from '@tip-wlan/wlan-cloud-ui-library';

import { AUTH_TOKEN } from 'constants/index';
import UserContext from 'contexts/UserContext';
import { GET_ALL_PROFILES, GET_API_URL, GET_PROFILE } from 'graphql/queries';
import { UPDATE_PROFILE, CREATE_PROFILE } from 'graphql/mutations';

import { fetchMoreProfiles } from 'graphql/functions';
import { getItem } from 'utils/localStorage';

const ProfileDetails = () => {
  const { customerId } = useContext(UserContext);
  const { id } = useParams();

  const { data: apiUrl } = useQuery(GET_API_URL);

  const { loading, data } = useQuery(GET_PROFILE, {
    variables: { id },
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
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

  const { data: passpointProfiles, fetchMore: fetchMorePasspointProfiles } = useQuery(
    GET_ALL_PROFILES(),
    {
      variables: { customerId, type: 'passpoint' },
      fetchPolicy: 'network-only',
    }
  );

  const [updateProfile] = useMutation(UPDATE_PROFILE);
  const [createProfile] = useMutation(CREATE_PROFILE);

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
    else if (key === 'passpoint')
      fetchMoreProfiles(e, passpointProfiles, fetchMorePasspointProfiles);
    else fetchMoreProfiles(e, ssidProfiles, fetchMore);
  };

  const handleCreateChildProfile = (profileType, name, details, childProfileIds = []) => {
    return createProfile({
      variables: {
        profileType,
        customerId,
        name,
        childProfileIds,
        details,
      },
      update(cache, { data: { createProfile: newProfile } = {} }) {
        const { getAllProfiles } = cache.readQuery({
          query: GET_ALL_PROFILES(),
          variables: { customerId, type: profileType },
        });

        cache.writeQuery({
          query: GET_ALL_PROFILES(),
          variables: { customerId, type: profileType },
          data: {
            getAllProfiles: {
              ...getAllProfiles,
              items: [...getAllProfiles.items, newProfile],
            },
          },
        });
      },
    })
      .then(({ data: { createProfile: newProfile } = {} }) => {
        notification.success({
          message: 'Success',
          description: 'Profile successfully created.',
        });
        return newProfile;
      })
      .catch(() =>
        notification.error({
          message: 'Error',
          description: 'Profile could not be created.',
        })
      );
  };

  const handleOnUpdateChildProfile = (name, details, childProfileIds = [], fullProfile = {}) => {
    return updateProfile({
      variables: {
        ...fullProfile,
        customerId,
        name,
        childProfileIds,
        details,
      },
      update(cache, { data: { updateProfile: updatedProfile } = {} }) {
        const { getAllProfiles } = cache.readQuery({
          query: GET_ALL_PROFILES(),
          variables: { customerId, type: fullProfile.profileType },
        });

        cache.writeQuery({
          query: GET_ALL_PROFILES(),
          variables: { customerId, type: fullProfile.profileType },
          data: {
            getAllProfiles: {
              ...getAllProfiles,
              items: getAllProfiles.items.map(profile =>
                profile.id === updatedProfile.id ? updatedProfile : profile
              ),
            },
          },
        });
      },
    })
      .then(({ data: { updateProfile: updatedProfile } = {} }) => {
        notification.success({
          message: 'Success',
          description: 'Profile successfully updated.',
        });
        return updatedProfile;
      })
      .catch(() =>
        notification.error({
          message: 'Error',
          description: 'Profile could not be updated.',
        })
      );
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <ProfileDetailsPage
      name={data.getProfile.name}
      profileId={data?.getProfile?.id}
      profileType={data.getProfile.profileType}
      details={data.getProfile.details}
      childProfiles={data.getProfile.childProfiles}
      childProfileIds={data.getProfile.childProfileIds}
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
      passpointProfiles={passpointProfiles?.getAllProfiles?.items}
      fileUpload={handleFileUpload}
      onFetchMoreProfiles={handleFetchMoreProfiles}
      onDownloadFile={handleDownloadFile}
      onCreateChildProfile={handleCreateChildProfile}
      onUpdateChildProfile={handleOnUpdateChildProfile}
    />
  );
};

export default ProfileDetails;
