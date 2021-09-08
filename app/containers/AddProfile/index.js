import React, { useContext } from 'react';
import { AddProfile as AddProfilePage } from '@tip-wlan/wlan-cloud-ui-library';
import { useMutation, useQuery, useLazyQuery } from '@apollo/client';
import { notification } from 'antd';
import { useHistory } from 'react-router-dom';

import { ROUTES, AUTH_TOKEN } from 'constants/index';
import UserContext from 'contexts/UserContext';
import { GET_ALL_PROFILES, GET_API_URL, GET_PROFILE } from 'graphql/queries';
import { CREATE_PROFILE, UPDATE_PROFILE } from 'graphql/mutations';
import { fetchMoreProfiles } from 'graphql/functions';
import { getItem } from 'utils/localStorage';

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

  const [
    fetchChildProfile,
    { data: { getProfile: childProfile } = {}, loading: loadingChildProfile },
  ] = useLazyQuery(GET_PROFILE, {
    errorPolicy: 'all',
  });

  const [createProfile] = useMutation(CREATE_PROFILE);
  const [updateProfile] = useMutation(UPDATE_PROFILE);

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

  const handleFetchChildProfile = profileId => {
    fetchChildProfile({ variables: { id: profileId } });
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

  const handleOnUpdateChildProfile = (name, details, childProfileIds = []) => {
    return updateProfile({
      variables: {
        ...childProfile,
        customerId,
        name,
        childProfileIds,
        details,
      },
      update(cache, { data: { updateProfile: updatedProfile } = {} }) {
        const { getAllProfiles } = cache.readQuery({
          query: GET_ALL_PROFILES(),
          variables: { customerId, type: childProfile.profileType },
        });

        cache.writeQuery({
          query: GET_ALL_PROFILES(),
          variables: { customerId, type: childProfile.profileType },
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
      onCreateChildProfile={handleCreateChildProfile}
      onUpdateChildProfile={handleOnUpdateChildProfile}
      handleFetchChildProfile={handleFetchChildProfile}
      childProfile={childProfile}
      loadingChildProfile={loadingChildProfile}
    />
  );
};

export default AddProfile;
