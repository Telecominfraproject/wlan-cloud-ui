import React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Alert, notification } from 'antd';
import { GET_ALL_FIRMWARE, GET_TRACK_ASSIGNMENTS } from 'graphql/queries';
import {
  DELETE_TRACK_ASSIGNMENT,
  DELETE_FIRMWARE,
  CREATE_FIRMWARE,
  UPDATE_FIRMWARE,
} from 'graphql/mutations';
import { Firmware as FirmwarePage, Loading } from '@tip-wlan/wlan-cloud-ui-library';

const Firmware = () => {
  const { data, error, loading, refetch } = useQuery(GET_ALL_FIRMWARE);
  const {
    data: trackAssignmentData,
    error: trackAssignmentError,
    loading: trackAssignmentLoading,
    refetch: refetchAssignmentData,
  } = useQuery(GET_TRACK_ASSIGNMENTS);

  const [deleteTrackAssignment] = useMutation(DELETE_TRACK_ASSIGNMENT);
  const [deleteFirmware] = useMutation(DELETE_FIRMWARE);
  const [createFirmware] = useMutation(CREATE_FIRMWARE);
  const [updateFirmware] = useMutation(UPDATE_FIRMWARE);

  const handleDeleteTrackAssignment = (firmwareTrackId, firmwareVersionId) => {
    deleteTrackAssignment({
      variables: {
        firmwareTrackId,
        firmwareVersionId,
      },
    })
      .then(() => {
        refetchAssignmentData();
        notification.success({
          message: 'Success',
          description: 'Track Assignment successfully deleted.',
        });
      })
      .catch(() =>
        notification.error({
          message: 'Error',
          description: 'Track Assignment could not be deleted.',
        })
      );
  };
  const handleCreateFirmware = (
    modelId,
    versionName,
    description,
    filename,
    commit,
    releaseDate,
    validationCode
  ) => {
    createFirmware({
      variables: {
        modelId,
        versionName,
        description,
        filename,
        commit,
        releaseDate,
        validationCode,
      },
    })
      .then(() => {
        refetch();
        notification.success({
          message: 'Success',
          description: 'Firmware version successfully created.',
        });
      })
      .catch(() =>
        notification.error({
          message: 'Error',
          description: 'Firmware version could not be created.',
        })
      );
  };

  const handleUpdateFirmware = (
    id,
    modelId,
    versionName,
    description,
    filename,
    commit,
    releaseDate,
    validationCode,
    createdTimestamp,
    lastModifiedTimestamp
  ) => {
    updateFirmware({
      variables: {
        id,
        modelId,
        versionName,
        description,
        filename,
        commit,
        releaseDate,
        validationCode,
        createdTimestamp,
        lastModifiedTimestamp,
      },
    })
      .then(() => {
        refetch();
        notification.success({
          message: 'Success',
          description: 'Firmware version successfully updated.',
        });
      })
      .catch(() =>
        notification.error({
          message: 'Error',
          description: 'Firmware version could not be updated.',
        })
      );
  };

  const handleDeleteFirmware = id => {
    deleteFirmware({
      variables: {
        id,
      },
    })
      .then(() => {
        refetch();
        notification.success({
          message: 'Success',
          description: 'Firmware version successfully deleted.',
        });
      })
      .catch(() =>
        notification.error({
          message: 'Error',
          description: 'Firmware version could not be deleted.',
        })
      );
  };

  if (error) {
    return (
      <Alert message="Error" description="Failed to load Firmware data." type="error" showIcon />
    );
  }

  if (trackAssignmentError) {
    return (
      <Alert
        message="Error"
        description="Failed to load Firmware Track Assignment data."
        type="error"
        showIcon
      />
    );
  }

  if (loading || trackAssignmentLoading) {
    return <Loading />;
  }

  return (
    <FirmwarePage
      firmwareData={data && data.getAllFirmware}
      trackAssignmentData={trackAssignmentData && trackAssignmentData.getAllFirmwareTrackAssignment}
      onDeleteTrackAssignment={handleDeleteTrackAssignment}
      onDeleteFirmware={handleDeleteFirmware}
      onCreateFirnware={handleCreateFirmware}
      onUpdateFirmware={handleUpdateFirmware}
    />
  );
};

export default Firmware;
