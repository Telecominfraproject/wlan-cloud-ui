import React, { useState } from 'react';
import { useQuery, useMutation, useLazyQuery, gql } from '@apollo/client';
import { notification } from 'antd';
import { Manufacturer as ManufacturerPage } from '@tip-wlan/wlan-cloud-ui-library';

import { AUTH_TOKEN } from 'constants/index';
import { GET_API_URL } from 'graphql/queries';
import { getItem } from 'utils/localStorage';

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
  const token = getItem(AUTH_TOKEN);
  const [loadingFileUpload, setLoadingFileUpload] = useState(false);

  const { data: apiUrl } = useQuery(GET_API_URL);
  const [updateOUI] = useMutation(UPDATE_OUI);
  const [searchOUI, { data }] = useLazyQuery(GET_OUI, {
    onError: () => {
      notification.error({
        message: 'Error',
        description: 'No matching manufacturer found for OUI',
      });
    },
    onCompleted: () => {
      if (!data?.getOui?.oui) {
        notification.error({
          message: 'Error',
          description: 'No matching manufacturer found for OUI',
        });
      }
    },
    fetchPolicy: 'no-cache',
  });

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

  const handleFileUpload = (fileName, file) => {
    if (apiUrl?.getApiUrl) {
      setLoadingFileUpload(true);

      fetch(`${apiUrl?.getApiUrl}portal/manufacturer/oui/upload?fileName=${fileName}`, {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token.access_token}` : '',
          'Content-Type': 'application/octet-stream',
        },
        body: file,
      })
        .then(response => response.json())
        .then(resp => {
          if (resp?.success) {
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
        .catch(() => {
          notification.error({
            message: 'Error',
            description: 'File could not be uploaded.',
          });
        })
        .finally(() => setLoadingFileUpload(false));
    } else {
      notification.error({
        message: 'Error',
        description: 'File could not be uploaded.',
      });
    }
  };

  return (
    <ManufacturerPage
      onSearchOUI={handleSearchOUI}
      onUpdateOUI={handleUpdateOUI}
      returnedOUI={data && data.getOui}
      fileUpload={handleFileUpload}
      loadingFileUpload={loadingFileUpload}
    />
  );
};

export default System;
