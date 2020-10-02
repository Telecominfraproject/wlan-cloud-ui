import React from 'react';
import { useMutation, useLazyQuery, gql } from '@apollo/client';
import { notification } from 'antd';
import { Manufacturer as ManufacturerPage } from '@tip-wlan/wlan-cloud-ui-library';
import { OUI_UPLOAD } from 'graphql/mutations';

const GET_OUI = gql`
  query GetOui($oui: String!) {
    getOui(oui: $oui) {
      manufacturerAlias
      manufacturerName
      oui
    }
  }
`;

const UPDATE_OUI = gql`
  mutation UpdateOui($oui: String, $manufacturerAlias: String, $manufacturerName: String) {
    updateOui(
      oui: $oui
      manufacturerAlias: $manufacturerAlias
      manufacturerName: $manufacturerName
    ) {
      manufacturerAlias
      manufacturerName
      oui
    }
  }
`;
const System = () => {
  const [updateOUI] = useMutation(UPDATE_OUI);
  const [searchOUI, { data }] = useLazyQuery(GET_OUI, {
    onError: () => {
      notification.error({
        message: 'Error',
        description: 'No matching manufacturer found for OUI',
      });
    },
    onCompleted: () => {
      if (!data.getOui.oui) {
        notification.error({
          message: 'Error',
          description: 'No matching manufacturer found for OUI',
        });
      }
    },
    fetchPolicy: 'no-cache',
  });
  const [fileUpload] = useMutation(OUI_UPLOAD);

  const handleUpdateOUI = (oui, manufacturerAlias, manufacturerName) => {
    updateOUI({
      variables: {
        oui,
        manufacturerAlias,
        manufacturerName,
      },
    })
      .then(() => {
        notification.success({
          message: 'Success',
          description: 'Alias successfully updated.',
        });
      })
      .catch(() =>
        notification.error({
          message: 'Error',
          description: 'Alias could not be updated.',
        })
      );
  };

  const handleSearchOUI = oui => {
    searchOUI({ variables: { oui } });
  };

  const handleFileUpload = (fileName, file) =>
    fileUpload({ variables: { fileName, file } })
      .then(resp => {
        if (resp?.ouiUpload?.success) {
          notification.success({
            message: 'Success',
            description: 'File successfully uploaded.',
          });
        } else {
          notification.error({
            message: 'Error',
            description: 'File could not be uploaded.',
          });
        }
      })
      .catch(() =>
        notification.error({
          message: 'Error',
          description: 'File could not be uploaded.',
        })
      );
  return (
    <ManufacturerPage
      onSearchOUI={handleSearchOUI}
      onUpdateOUI={handleUpdateOUI}
      returnedOUI={data && data.getOui}
      fileUpload={handleFileUpload}
    />
  );
};

export default System;
