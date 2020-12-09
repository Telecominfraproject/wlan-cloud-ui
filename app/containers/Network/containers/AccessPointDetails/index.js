import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useParams, useHistory } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Alert, notification } from 'antd';
import moment from 'moment';
import {
  AccessPointDetails as AccessPointDetailsPage,
  Loading,
} from '@tip-wlan/wlan-cloud-ui-library';

import { FILTER_SERVICE_METRICS, GET_ALL_FIRMWARE, GET_ALL_PROFILES } from 'graphql/queries';
import {
  UPDATE_EQUIPMENT_FIRMWARE,
  REQUEST_EQUIPMENT_SWITCH_BANK,
  REQUEST_EQUIPMENT_REBOOT,
} from 'graphql/mutations';
import { updateQueryGetAllProfiles } from 'graphql/functions';
import UserContext from 'contexts/UserContext';

const GET_EQUIPMENT = gql`
  query GetEquipment($id: ID!) {
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
        id
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
          details {
            numClientsPerRadio
          }
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

const UPDATE_EQUIPMENT = gql`
  mutation UpdateEquipment(
    $id: ID!
    $equipmentType: String!
    $inventoryId: String!
    $customerId: ID!
    $profileId: ID!
    $locationId: ID!
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

const DELETE_EQUIPMENT = gql`
  mutation DeleteEquipment($id: ID!) {
    deleteEquipment(id: $id) {
      id
    }
  }
`;

const toTime = moment();
const fromTime = moment().subtract(1, 'hour');

const AccessPointDetails = ({ locations }) => {
  const { id } = useParams();
  const { customerId } = useContext(UserContext);
  const history = useHistory();

  const { loading, error, data, refetch } = useQuery(GET_EQUIPMENT, {
    variables: {
      id,
    },
    fetchPolicy: 'network-only',
  });

  const { data: dataFirmware, error: errorFirmware, loading: loadingFirmware } = useQuery(
    GET_ALL_FIRMWARE,
    {
      skip: !data?.getEquipment?.model,
      variables: { modelId: data?.getEquipment?.model },
    }
  );

  const {
    data: dataProfiles,
    error: errorProfiles,
    loading: loadingProfiles,
    fetchMore,
  } = useQuery(
    GET_ALL_PROFILES(`
    childProfiles {
      id
      name
      details
    }`),
    {
      variables: { customerId, type: 'equipment_ap' },
    }
  );

  const {
    loading: metricsLoading,
    error: metricsError,
    data: metricsData,
    refetch: metricsRefetch,
  } = useQuery(FILTER_SERVICE_METRICS, {
    variables: {
      customerId,
      fromTime: fromTime.valueOf().toString(),
      toTime: toTime.valueOf().toString(),
      equipmentIds: [id],
      dataTypes: ['ApNode'],
      limit: 100,
    },
  });

  const [updateEquipment] = useMutation(UPDATE_EQUIPMENT);
  const [updateEquipmentFirmware] = useMutation(UPDATE_EQUIPMENT_FIRMWARE);
  const [requestEquipmentSwitchBank] = useMutation(REQUEST_EQUIPMENT_SWITCH_BANK);
  const [requestEquipmentReboot] = useMutation(REQUEST_EQUIPMENT_REBOOT);
  const [deleteEquipment] = useMutation(DELETE_EQUIPMENT);

  const refetchData = () => {
    refetch();
    metricsRefetch();
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

  const handleDeleteEquipment = () => {
    deleteEquipment({
      variables: { id },
    })
      .then(() => {
        history.push('/network/access-points');
        notification.success({
          message: 'Success',
          description: 'Equipment successfully deleted',
        });
      })
      .catch(() =>
        notification.error({
          message: 'Error',
          description: 'Equipment could not be deleted.',
        })
      );
  };

  const handleUpdateEquipmentFirmware = (equipmentId, firmwareVersionId) =>
    updateEquipmentFirmware({ variables: { equipmentId, firmwareVersionId } })
      .then(firmwareResp => {
        if (firmwareResp?.data?.updateEquipmentFirmware?.success === true) {
          notification.success({
            message: 'Success',
            description: 'Equipment Firmware Upgrade in progress',
          });
        } else {
          notification.error({
            message: 'Error',
            description: 'Equipment Firmware Upgrade could not be updated.',
          });
        }
      })
      .catch(() =>
        notification.error({
          message: 'Error',
          description: 'Equipment Firmware Upgrade could not be updated.',
        })
      );

  const handleRequestEquipmentSwitchBank = equipmentId =>
    requestEquipmentSwitchBank({ variables: { equipmentId } })
      .then(firmwareResp => {
        if (firmwareResp?.data?.requestEquipmentSwitchBank?.success === true) {
          notification.success({
            message: 'Success',
            description: 'Equipment Firmware in progress',
          });
        } else {
          notification.error({
            message: 'Error',
            description: 'Equipment Firmware could not be updated.',
          });
        }
      })
      .catch(() =>
        notification.error({
          message: 'Error',
          description: 'Equipment Firmware could not be updated.',
        })
      );

  const handleRequestEquipmentReboot = equipmentId =>
    requestEquipmentReboot({ variables: { equipmentId } })
      .then(firmwareResp => {
        if (firmwareResp?.data?.requestEquipmentReboot?.success === true) {
          notification.success({
            message: 'Success',
            description: 'Equipment Firmware in progress',
          });
        } else {
          notification.error({
            message: 'Error',
            description: 'Equipment Firmware could not be updated.',
          });
        }
      })
      .catch(() =>
        notification.error({
          message: 'Error',
          description: 'Equipment Firmware could not be updated.',
        })
      );

  const handleFetchProfiles = e => {
    if (dataProfiles.getAllProfiles.context.lastPage) {
      return false;
    }

    e.persist();
    const { target } = e;

    if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
      fetchMore({
        variables: { context: { ...dataProfiles.getAllProfiles.context } },
        updateQuery: updateQueryGetAllProfiles,
      });
    }

    return true;
  };

  if (loading) {
    return <Loading />;
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

  return (
    <AccessPointDetailsPage
      handleRefresh={refetchData}
      onUpdateEquipment={handleUpdateEquipment}
      onDeleteEquipment={handleDeleteEquipment}
      data={data?.getEquipment}
      profiles={dataProfiles?.getAllProfiles?.items}
      osData={{
        loading: metricsLoading,
        error: metricsError,
        data: metricsData && metricsData.filterServiceMetrics.items,
      }}
      firmware={dataFirmware?.getAllFirmware}
      locations={locations}
      onUpdateEquipmentFirmware={handleUpdateEquipmentFirmware}
      onRequestEquipmentSwitchBank={handleRequestEquipmentSwitchBank}
      onRequestEquipmentReboot={handleRequestEquipmentReboot}
      loadingProfiles={loadingProfiles}
      errorProfiles={errorProfiles}
      loadingFirmware={loadingFirmware}
      errorFirmware={errorFirmware}
      onFetchMoreProfiles={handleFetchProfiles}
      isLastProfilesPage={dataProfiles?.getAllProfiles?.context?.lastPage}
    />
  );
};

AccessPointDetails.propTypes = {
  locations: PropTypes.instanceOf(Array).isRequired,
};
export default AccessPointDetails;
