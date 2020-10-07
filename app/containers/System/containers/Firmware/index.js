import React from 'react';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { notification } from 'antd';
import {
  GET_ALL_FIRMWARE,
  GET_TRACK_ASSIGNMENTS,
  GET_FIRMWARE_TRACK,
  GET_ALL_FIRMWARE_MODELS,
} from 'graphql/queries';
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

  const [
    getAllFirmware,
    { data: firmwareVersionData, loading: firmwareVersionLoading },
  ] = useLazyQuery(GET_ALL_FIRMWARE);

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

  const {
    data: firmwareModelData,
    error: firmwareModelError,
    loading: firmwareModelLoading,
    refetch: refetchFirmwareModels,
  } = useQuery(GET_ALL_FIRMWARE_MODELS);

  const [updateTrackAssignment] = useMutation(UPDATE_TRACK_ASSIGNMENT);
  const [deleteTrackAssignment] = useMutation(DELETE_TRACK_ASSIGNMENT);
  const [createFirmware] = useMutation(CREATE_FIRMWARE);
  const [updateFirmware] = useMutation(UPDATE_FIRMWARE);
  const [deleteFirmware] = useMutation(DELETE_FIRMWARE);

  const handleSearchFirmware = modelId => {
    getAllFirmware({ variables: { modelId } });
  };

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
          description: 'Model Target Version successfully created.',
        });
      })
      .catch(() =>
        notification.error({
          message: 'Error',
          description: 'Model Target Version could not be created.',
        })
      );
  };

  const handleUpdateTrackAssignment = (
    firmwareVersionRecordId,
    modelId,
    createdTimestamp,
    lastModifiedTimestamp,
    prevFirmwareVersionRecordId
  ) => {
    if (prevFirmwareVersionRecordId !== firmwareVersionRecordId) {
      deleteTrackAssignment({
        variables: {
          firmwareTrackId: firmwareTrackData.getFirmwareTrack.recordId,
          firmwareVersionId: prevFirmwareVersionRecordId,
        },
      });
    }

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
          description: 'Model Target Version successfully updated.',
        });
      })
      .catch(() =>
        notification.error({
          message: 'Error',
          description: 'Model Target Version could not be updated.',
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
          description: 'Model Target Version successfully deleted.',
        });
      })
      .catch(() =>
        notification.error({
          message: 'Error',
          description: 'Model Target Version could not be deleted.',
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
        refetchFirmwareModels();
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
        refetchFirmwareModels();
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
        refetchFirmwareModels();
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
      onCreateFirmware={handleCreateFirmware}
      onUpdateFirmware={handleUpdateFirmware}
      onDeleteFirmware={handleDeleteFirmware}
      firmwareError={error}
      firmwareLoading={loading}
      trackAssignmentError={trackAssignmentError}
      trackAssignmentLoading={trackAssignmentLoading}
      firmwareTrackLoading={firmwareTrackLoading}
      firmwareTrackError={firmwareTrackError}
      firmwareModelData={firmwareModelData && firmwareModelData.getAllFirmwareModelId}
      handleSearchFirmware={handleSearchFirmware}
      firmwareVersionData={firmwareVersionData && firmwareVersionData.getAllFirmware}
      firmwareVersionLoading={firmwareVersionLoading}
      firmwareModelError={firmwareModelError}
      firmwareModelLoading={firmwareModelLoading}
    />
  );
};

export default Firmware;
