import React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { notification } from 'antd';
import { GET_ALL_FIRMWARE, GET_TRACK_ASSIGNMENTS, GET_FIRMWARE_TRACK } from 'graphql/queries';
import {
  UPDATE_TRACK_ASSIGNMENT,
  DELETE_TRACK_ASSIGNMENT,
  CREATE_FIRMWARE,
  UPDATE_FIRMWARE,
  DELETE_FIRMWARE,
} from 'graphql/mutations';
import { Firmware as FirmwarePage } from '@tip-wlan/wlan-cloud-ui-library';

const Firmware = () => {
  const { data, error, loading, refetch } = useQuery(GET_ALL_FIRMWARE);
  const {
    data: trackAssignmentData,
    error: trackAssignmentError,
    loading: trackAssignmentLoading,
    refetch: refetchAssignmentData,
  } = useQuery(GET_TRACK_ASSIGNMENTS);

  const {
    data: firmwareTrackData,
    error: firmwareTrackError,
    loading: firmwareTrackLoading,
  } = useQuery(GET_FIRMWARE_TRACK, {
    variables: { firmwareTrackName: 'DEFAULT' },
  });

  const [updateTrackAssignment] = useMutation(UPDATE_TRACK_ASSIGNMENT);
  const [deleteTrackAssignment] = useMutation(DELETE_TRACK_ASSIGNMENT);
  const [createFirmware] = useMutation(CREATE_FIRMWARE);
  const [updateFirmware] = useMutation(UPDATE_FIRMWARE);
  const [deleteFirmware] = useMutation(DELETE_FIRMWARE);

  const handleCreateTrackAssignment = (firmwareVersionRecordId, modelId) => {
    updateTrackAssignment({
      variables: {
        trackRecordId: firmwareTrackData.getFirmwareTrack.recordId,
        firmwareVersionRecordId,
        modelId,
      },
    })
      .then(() => {
        refetchAssignmentData();
        notification.success({
          message: 'Success',
          description: 'Track Assignment successfully created.',
        });
      })
      .catch(() =>
        notification.error({
          message: 'Error',
          description: 'Track Assignment could not be created.',
        })
      );
  };

  const handleUpdateTrackAssignment = (
    firmwareVersionRecordId,
    modelId,
    createdTimestamp,
    lastModifiedTimestamp
  ) => {
    updateTrackAssignment({
      variables: {
        trackRecordId: firmwareTrackData.getFirmwareTrack.recordId,
        firmwareVersionRecordId,
        modelId,
        createdTimestamp,
        lastModifiedTimestamp,
      },
    })
      .then(() => {
        refetchAssignmentData();
        notification.success({
          message: 'Success',
          description: 'Track Assignment successfully updated.',
        });
      })
      .catch(() =>
        notification.error({
          message: 'Error',
          description: 'Track Assignment could not be updated.',
        })
      );
  };

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

  return (
    <FirmwarePage
      firmwareData={data && data.getAllFirmware}
      trackAssignmentData={trackAssignmentData && trackAssignmentData.getAllFirmwareTrackAssignment}
      onCreateTrackAssignment={handleCreateTrackAssignment}
      onUpdateTrackAssignment={handleUpdateTrackAssignment}
      onDeleteTrackAssignment={handleDeleteTrackAssignment}
      onCreateFirnware={handleCreateFirmware}
      onUpdateFirmware={handleUpdateFirmware}
      onDeleteFirmware={handleDeleteFirmware}
      firmwareError={error}
      firmwareLoading={loading}
      trackAssignmentError={trackAssignmentError}
      trackAssignmentLoading={trackAssignmentLoading}
      firmwareTrackLoading={firmwareTrackLoading}
      firmwareTrackError={firmwareTrackError}
    />
  );
};

export default Firmware;
