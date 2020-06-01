import React from 'react';
import { ProfileDetails as ProfileDetailsPage } from '@tip-wlan/wlan-cloud-ui-library';
import { useParams } from 'react-router-dom';
import gql from 'graphql-tag';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import { Alert, Spin, notification } from 'antd';

const GET_PROFILE = gql`
  query GetProfile($id: Int!) {
    getProfile(id: $id) {
      id
      name
      profileType
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

const ProfileDetails = () => {
  const { id } = useParams();

  const { loading, error, data } = useQuery(GET_PROFILE, {
    variables: { id: parseInt(id, 10) },
  });

  const [deleteProfile] = useLazyQuery(DELETE_PROFILE, {
    onCompleted: () => {
      notification.success({
        message: 'Success',
        description: 'Profile successfully deleted.',
      });
    },
    onError: () => {
      notification.error({
        message: 'Error',
        description: 'Profile could not be deleted.',
      });
    },
  });

  const handleDeleteProfile = () => {
    deleteProfile({ variables: { id: parseInt(id, 10) } });
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return (
      <Alert message="Error" description="Failed to load profile data." type="error" showIcon />
    );
  }
  return (
    <ProfileDetailsPage
      name={data.getProfile.name}
      profileType={data.getProfile.profileType}
      onDeleteProfile={handleDeleteProfile}
    />
  );
};

export default ProfileDetails;
