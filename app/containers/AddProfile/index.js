import React, { useContext } from 'react';
import { AddProfile as AddProfilePage } from '@tip-wlan/wlan-cloud-ui-library';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { notification } from 'antd';
import UserContext from 'contexts/UserContext';

const CREATE_PROFILE = gql`
  mutation CreateProfile(
    $profileType: String!
    $customerId: Int!
    $name: String!
    $childProfileIds: [Int]
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
  const [createProfile] = useMutation(CREATE_PROFILE);

  const handleAddProfile = (profileType, name, childProfileIds, details) => {
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
      })
      .catch(() =>
        notification.error({
          message: 'Error',
          description: 'Profile could not be created.',
        })
      );
  };

  return <AddProfilePage onCreateProfile={handleAddProfile} />;
};

export default AddProfile;
