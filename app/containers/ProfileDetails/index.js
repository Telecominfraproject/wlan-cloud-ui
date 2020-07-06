import React, { useState, useContext } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import gql from 'graphql-tag';
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks';
import { Alert, Spin, notification } from 'antd';
import { ProfileDetails as ProfileDetailsPage } from '@tip-wlan/wlan-cloud-ui-library';

import UserContext from 'contexts/UserContext';
import { GET_ALL_PROFILES } from 'graphql/queries';
import { FILE_UPLOAD } from 'graphql/mutations';

const GET_PROFILE = gql`
  query GetProfile($id: Int!) {
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
      childProfileIds
      createdTimestamp
      lastModifiedTimestamp
      details
    }
  }
`;

const DELETE_PROFILE = gql`
  query DeleteProfile($id: Int!) {
    deleteProfile(id: $id) {
      id
    }
  }
`;

const UPDATE_PROFILE = gql`
  mutation UpdateProfile(
    $id: Int!
    $profileType: String!
    $customerId: Int!
    $name: String!
    $childProfileIds: [Int]
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

const ProfileDetails = () => {
  const { customerId } = useContext(UserContext);
  const { id } = useParams();

  const [redirect, setRedirect] = useState(false);

  const { loading, error, data } = useQuery(GET_PROFILE, {
    variables: { id: parseInt(id, 10) },
  });
  const { data: ssidProfiles } = useQuery(GET_ALL_PROFILES, {
    variables: { customerId, type: 'ssid' },
  });
  const [updateProfile] = useMutation(UPDATE_PROFILE);

  const [deleteProfile] = useLazyQuery(DELETE_PROFILE, {
    onCompleted: () => {
      notification.success({
        message: 'Success',
        description: 'Profile successfully deleted.',
      });
      setRedirect(true);
    },
    onError: () => {
      notification.error({
        message: 'Error',
        description: 'Profile could not be deleted.',
      });
    },
  });

  const [fileUpload] = useMutation(FILE_UPLOAD);

  const handleDeleteProfile = () => {
    deleteProfile({ variables: { id: parseInt(id, 10) } });
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

  const handleFileUpload = (fileName, file) =>
    fileUpload({ variables: { fileName, file } })
      .then(() => {
        notification.success({
          message: 'Success',
          description: 'File successfully uploaded.',
        });
      })
      .catch(() =>
        notification.error({
          message: 'Error',
          description: 'File could not be uploaded.',
        })
      );

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return (
      <Alert message="Error" description="Failed to load profile data." type="error" showIcon />
    );
  }

  if (redirect) {
    return <Redirect to="/profiles" />;
  }

  return (
    <ProfileDetailsPage
      name={data.getProfile.name}
      profileType={data.getProfile.profileType}
      details={data.getProfile.details}
      childProfileIds={data.getProfile.childProfileIds}
      onDeleteProfile={handleDeleteProfile}
      onUpdateProfile={handleUpdateProfile}
      ssidProfiles={
        (ssidProfiles && ssidProfiles.getAllProfiles && ssidProfiles.getAllProfiles.items) || []
      }
      fileUpload={handleFileUpload}
    />
  );
};

export default ProfileDetails;
