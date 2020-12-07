import React from 'react';
import { Alert } from 'antd';
import { Loading } from '@tip-wlan/wlan-cloud-ui-library';
import { useQuery } from '@apollo/client';
import { Redirect } from 'react-router-dom';

export const withQuery = (Comp, query, getVariables) => props => {
  const { loading, error, data, refetch, fetchMore } = useQuery(query, {
    variables: getVariables(),
  });

  if (loading) {
    return <Loading />;
  }

  if (error) {
    if (error.message === '403: Forbidden' || error.message === '401: Unauthorized') {
      return <Redirect to="/login" />;
    }

    return <Alert message="Error" description="Failed to load profiles." type="error" showIcon />;
  }

  return <Comp {...props} data={data} fetchMore={fetchMore} refetch={refetch} />;
};
