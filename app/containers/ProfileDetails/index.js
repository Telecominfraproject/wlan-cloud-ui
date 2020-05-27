import React from 'react';
import { ProfileDetails as ProfileDetailsPage } from '@tip-wlan/wlan-cloud-ui-library';
import { useParams } from 'react-router-dom';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { Alert, Spin } from 'antd';

const GET_PROFILE = gql`
  query GetProfile($id: Int!) {
    getProfile(id: $id) {
      id
      name
    }
  }
`;

const ProfileDetails = () => {
  let { id } = useParams();

  id = parseInt(id, 10);

  const { loading, error, data } = useQuery(GET_PROFILE, {
    variables: { id },
  });

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return (
      <Alert message="Error" description="Failed to load profile data." type="error" showIcon />
    );
  }
  return <ProfileDetailsPage name={data.getProfile.name} />;
};

export default ProfileDetails;
