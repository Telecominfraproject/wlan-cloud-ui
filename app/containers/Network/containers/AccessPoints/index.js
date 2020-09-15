import React, { useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useLazyQuery } from '@apollo/client';
import { notification } from 'antd';
import { floor, padStart } from 'lodash';
import { NetworkTableContainer } from '@tip-wlan/wlan-cloud-ui-library';

import UserContext from 'contexts/UserContext';
import { FILTER_EQUIPMENT } from 'graphql/queries';

import styles from './index.module.scss';

const renderTableCell = (text, _record, _index, defaultValue = 'N/A') => {
  if (Array.isArray(text)) {
    if (text.length < 1) {
      return defaultValue;
    }
    return (
      <div className={styles.tabColumn}>
        {text.map((i, key) => (
          // eslint-disable-next-line react/no-array-index-key
          <span key={key}>{i}</span>
        ))}
      </div>
    );
  }
  return text !== null ? text : defaultValue;
};

const durationToString = duration =>
  `${floor(duration.asDays())}d ${floor(duration.hours())}h ${padStart(
    duration.minutes(),
    2,
    0
  )}m ${padStart(duration.seconds(), 2, 0)}s`;

const accessPointsTableColumns = [
  {
    title: 'NAME',
    dataIndex: 'name',
    render: renderTableCell,
  },
  {
    title: 'ALARMS',
    dataIndex: 'alarmsCount',
    render: renderTableCell,
  },
  {
    title: 'MODEL',
    dataIndex: 'model',
    render: renderTableCell,
  },
  {
    title: 'IP',
    dataIndex: ['status', 'protocol', 'details', 'reportedIpV4Addr'],
    render: renderTableCell,
  },
  {
    title: 'MAC',
    dataIndex: ['status', 'protocol', 'details', 'reportedMacAddr'],
    render: renderTableCell,
  },
  {
    title: 'MANUFACTURER',
    dataIndex: ['status', 'protocol', 'details', 'manufacturer'],
    render: renderTableCell,
  },
  {
    title: 'FIRMWARE',
    dataIndex: ['status', 'firmware', 'detailsJSON', 'activeSwVersion'],
    render: renderTableCell,
  },
  {
    title: 'ASSET ID',
    dataIndex: 'inventoryId',
    render: renderTableCell,
  },
  {
    title: 'UP TIME',
    dataIndex: ['status', 'osPerformance', 'details', 'uptimeInSeconds'],
    render: upTimeInSeconds => durationToString(moment.duration(upTimeInSeconds, 'seconds')),
  },
  {
    title: 'PROFILE',
    dataIndex: ['profile', 'name'],
    render: renderTableCell,
  },
  {
    title: 'CHANNEL',
    dataIndex: 'channel',
    render: renderTableCell,
  },
  {
    title: 'OCCUPANCY',
    dataIndex: ['status', 'radioUtilization', 'details', 'capacityDetails'],
    render: renderTableCell,
  },
  {
    title: 'NOISE FLOOR',
    dataIndex: ['status', 'radioUtilization', 'details', 'noiseFloorDetails'],
    render: renderTableCell,
  },
  {
    title: 'DEVICES',
    dataIndex: ['status', 'clientDetails', 'details', 'numClientsPerRadio'],
    render: (text, record, index) => renderTableCell(text, record, index, 0),
  },
];

const AccessPoints = ({ checkedLocations }) => {
  const { customerId } = useContext(UserContext);
  const [filterEquipment, { loading, error, data: equipData, refetch, fetchMore }] = useLazyQuery(
    FILTER_EQUIPMENT,
    {
      errorPolicy: 'all',
    }
  );

  const handleOnRefresh = () => {
    refetch()
      .then(() => {
        notification.success({
          message: 'Success',
          description: 'Access points reloaded.',
        });
      })
      .catch(() =>
        notification.error({
          message: 'Error',
          description: 'Access points could not be reloaded.',
        })
      );
  };

  const handleLoadMore = () => {
    if (!equipData.filterEquipment.context.lastPage) {
      fetchMore({
        variables: { context: equipData.filterEquipment.context },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const previousEntry = previousResult.filterEquipment;
          const newItems = fetchMoreResult.filterEquipment.items;

          return {
            filterEquipment: {
              context: fetchMoreResult.filterEquipment.context,
              items: [...previousEntry.items, ...newItems],
              __typename: previousEntry.__typename,
            },
          };
        },
      });
    }
  };

  const fetchFilterEquipment = async () => {
    filterEquipment({
      variables: { customerId, locationIds: checkedLocations, equipmentType: 'AP' },
    });
  };

  useEffect(() => {
    fetchFilterEquipment();
  }, [checkedLocations]);

  return (
    <NetworkTableContainer
      activeTab="/network/access-points"
      onRefresh={handleOnRefresh}
      tableColumns={accessPointsTableColumns}
      tableData={equipData && equipData.filterEquipment && equipData.filterEquipment.items}
      onLoadMore={handleLoadMore}
      isLastPage={
        equipData && equipData.filterEquipment && equipData.filterEquipment.context.lastPage
      }
      loading={loading}
      error={error && !equipData?.filterEquipment?.items && 'Failed to load equipment.'}
    />
  );
};

AccessPoints.propTypes = {
  checkedLocations: PropTypes.instanceOf(Array).isRequired,
};

export default AccessPoints;
