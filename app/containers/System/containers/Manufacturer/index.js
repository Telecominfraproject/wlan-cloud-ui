import React from 'react';
import gql from 'graphql-tag';
import { useMutation, useLazyQuery } from '@apollo/react-hooks';
import { notification } from 'antd';
import { Manufacturer as ManufacturerPage } from '@tip-wlan/wlan-cloud-ui-library';

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

  return (
    <ManufacturerPage
      onSearchOUI={handleSearchOUI}
      onUpdateOUI={handleUpdateOUI}
      returnedOUI={data && data.getOui}
    />
  );
};

export default System;
