import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Alert, Spin, notification } from 'antd';
import { AccessPointDetails as AccessPointDetailsPage } from '@tip-wlan/wlan-cloud-ui-library';
import { OS_STATS_DATA } from 'constants/index';
import UserContext from 'contexts/UserContext';

const GET_EQUIPMENT = gql`
  query GetEquipment($id: Int!) {
    getEquipment(id: $id) {
      id
      equipmentType
      inventoryId
      customerId
      profileId
      locationId
      name
      latitude
      longitude
      serial
      lastModifiedTimestamp
      details
      profile {
        name
        childProfiles {
          id
          name
          details
        }
      }
      status {
        firmware {
          detailsJSON
        }
        protocol {
          detailsJSON
          details {
            reportedMacAddr
            manufacturer
          }
        }
        radioUtilization {
          detailsJSON
        }
        clientDetails {
          detailsJSON
        }
        osPerformance {
          detailsJSON
        }
      }
      model
      alarmsCount
      alarms {
        severity
        alarmCode
        details
        createdTimestamp
      }
    }
  }
`;

export const GET_ALL_FIRMWARE = gql`
  query GetAllFirmware {
    getAllFirmware {
      id
      equipmentId
      modelId
      versionName
      description
      filename
      commit
      releaseDate
    }
  }
`;

const UPDATE_EQUIPMENT = gql`
  mutation UpdateEquipment(
    $id: Int!
    $equipmentType: String!
    $inventoryId: String!
    $customerId: Int!
    $profileId: Int!
    $locationId: Int!
    $name: String!
    $latitude: String
    $longitude: String
    $serial: String
    $lastModifiedTimestamp: String
    $details: JSONObject
  ) {
    updateEquipment(
      id: $id
      equipmentType: $equipmentType
      inventoryId: $inventoryId
      customerId: $customerId
      profileId: $profileId
      locationId: $locationId
      name: $name
      latitude: $latitude
      longitude: $longitude
      serial: $serial
      lastModifiedTimestamp: $lastModifiedTimestamp
      details: $details
    ) {
      id
      equipmentType
      inventoryId
      customerId
      profileId
      locationId
      name
      latitude
      longitude
      serial
      lastModifiedTimestamp
      details
    }
  }
`;

export const GET_ALL_PROFILES = gql`
  query GetAllProfiles($customerId: Int!, $cursor: String, $type: String) {
    getAllProfiles(customerId: $customerId, cursor: $cursor, type: $type) {
      items {
        id
        name
        profileType
        details
      }
      context {
        cursor
        lastPage
      }
    }
  }
`;

const AccessPointDetails = ({ locations }) => {
  const { id } = useParams();
  const { customerId } = useContext(UserContext);

  const { data: dataProfiles, error: errorProfiles, loading: landingProfiles } = useQuery(
    GET_ALL_PROFILES,
    {
      variables: { customerId, type: 'equipment_ap' },
    }
  );

  const { loading, error, data, refetch } = useQuery(GET_EQUIPMENT, {
    variables: { id: parseInt(id, 10) },
  });

  const [updateEquipment] = useMutation(UPDATE_EQUIPMENT);

  if (loading || landingProfiles) {
    return <Spin size="large" />;
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description="Failed to load Access Point data."
        type="error"
        showIcon
      />
    );
  }

  if (errorProfiles) {
    return (
      <Alert
        message="Error"
        description="Failed to load Access Point profiles."
        type="error"
        showIcon
      />
    );
  }

  const refetchData = () => {
    refetch();
  };

  const handleUpdateEquipment = (
    equipmentId,
    equipmentType,
    inventoryId,
    custId,
    profileId,
    locationId,
    name,
    latitude,
    longitude,
    serial,
    lastModifiedTimestamp,
    details
  ) => {
    updateEquipment({
      variables: {
        id: equipmentId,
        equipmentType,
        inventoryId,
        customerId: custId,
        profileId,
        locationId,
        name,
        latitude,
        longitude,
        serial,
        lastModifiedTimestamp,
        details,
      },
    })
      .then(() => {
        notification.success({
          message: 'Success',
          description: 'Equipment settings successfully updated.',
        });
      })

      .catch(() =>
        notification.error({
          message: 'Error',
          description: 'Equipment settings could not be updated.',
        })
      );
  };

  return (
    <AccessPointDetailsPage
      handleRefresh={refetchData}
      onUpdateEquipment={handleUpdateEquipment}
      data={data.getEquipment}
      profiles={dataProfiles.getAllProfiles.items}
      osData={OS_STATS_DATA}
      locations={locations}
    />
  );
};

AccessPointDetails.propTypes = {
  locations: PropTypes.instanceOf(Array).isRequired,
};
export default AccessPointDetails;
