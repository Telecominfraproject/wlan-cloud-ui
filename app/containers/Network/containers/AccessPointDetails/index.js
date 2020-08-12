import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Alert, Spin, notification } from 'antd';
import moment from 'moment';
import { AccessPointDetails as AccessPointDetailsPage } from '@tip-wlan/wlan-cloud-ui-library';

import {
  GET_EQUIPMENT,
  GET_ALL_PROFILES,
  GET_ALL_FIRMWARE,
  FILTER_SERVICE_METRICS,
} from 'graphql/queries';
import { UPDATE_EQUIPMENT, UPDATE_EQUIPMENT_FIRMWARE } from 'graphql/mutations';
import UserContext from 'contexts/UserContext';

const toTime = moment();
const fromTime = moment().subtract(1, 'hour');

const AccessPointDetails = ({ locations }) => {
  const { id } = useParams();
  const { customerId } = useContext(UserContext);

  const { loading, error, data, refetch } = useQuery(GET_EQUIPMENT, {
    variables: { id },
  });
  const { data: dataProfiles, error: errorProfiles, loading: landingProfiles } = useQuery(
    GET_ALL_PROFILES,
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

  const { data: dataFirmware, error: errorFirmware, loading: landingFirmware } = useQuery(
    GET_ALL_FIRMWARE
  );

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

  const handleUpdateEquipmentFirmware = (equipmentId, firmwareVersionId) =>
    updateEquipmentFirmware({ variables: { equipmentId, firmwareVersionId } })
      .then(firmwareResp => {
        if (firmwareResp && firmwareResp.updateEquipmentFirmware.success === false) {
          notification.error({
            message: 'Error',
            description: 'Equipment Firmware Upgrade could not be updated.',
          });
        } else {
          notification.success({
            message: 'Success',
            description: 'Equipment Firmware Upgrade in progress',
          });
        }
      })
      .catch(() =>
        notification.error({
          message: 'Error',
          description: 'Equipment Firmware Upgrade could not be updated.',
        })
      );

  if (loading || landingProfiles || landingFirmware) {
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

  if (errorFirmware) {
    return (
      <Alert
        message="Error"
        description="Failed to load Access Point firmware."
        type="error"
        showIcon
      />
    );
  }

  return (
    <AccessPointDetailsPage
      handleRefresh={refetchData}
      onUpdateEquipment={handleUpdateEquipment}
      data={data.getEquipment}
      profiles={dataProfiles.getAllProfiles.items}
      osData={{
        loading: metricsLoading,
        error: metricsError,
        data: metricsData && metricsData.filterServiceMetrics.items,
      }}
      firmware={dataFirmware.getAllFirmware}
      locations={locations}
      onUpdateEquipmentFirmware={handleUpdateEquipmentFirmware}
    />
  );
};

AccessPointDetails.propTypes = {
  locations: PropTypes.instanceOf(Array).isRequired,
};
export default AccessPointDetails;
