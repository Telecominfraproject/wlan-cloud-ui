import React, { useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useLazyQuery } from '@apollo/react-hooks';
import { Alert } from 'antd';
import { NetworkTable, Loading } from '@tip-wlan/wlan-cloud-ui-library';

import UserContext from 'contexts/UserContext';
import { FILTER_EQUIPMENT } from 'graphql/queries';
import styles from './index.module.scss';

const renderTableCell = tabCell => {
  if (Array.isArray(tabCell)) {
    return (
      <div className={styles.tabColumn}>
        {tabCell.map((i, key) => (
          // eslint-disable-next-line react/no-array-index-key
          <span key={key}>{i}</span>
        ))}
      </div>
    );
  }
  return tabCell;
};

const accessPointsTableColumns = [
  {
    title: 'NAME',
    dataIndex: 'name',
    render: renderTableCell,
  },
  {
    title: 'ALARMS',
    dataIndex: 'alarms',
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
    title: 'ASSET ID',
    dataIndex: 'inventoryId',
    render: renderTableCell,
  },
  {
    title: 'UP TIME',
    dataIndex: ['status', 'osPerformance', 'details', 'uptimeInSeconds'],
    render: renderTableCell,
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
    title: 'CAPACITY',
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
    dataIndex: 'devices',
    render: renderTableCell,
  },
];

const AccessPoints = ({ checkedLocations }) => {
  const { customerId } = useContext(UserContext);
  const [filterEquipment, { loading, error, data: equipData, fetchMore }] = useLazyQuery(
    FILTER_EQUIPMENT
  );

  const handleLoadMore = () => {
    if (!equipData.filterEquipment.context.lastPage) {
      fetchMore({
        variables: { cursor: equipData.filterEquipment.context.cursor },
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

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Alert message="Error" description="Failed to load equipment." type="error" showIcon />;
  }

  return (
    <NetworkTable
      tableColumns={accessPointsTableColumns}
      tableData={equipData && equipData.filterEquipment && equipData.filterEquipment.items}
      onLoadMore={handleLoadMore}
      isLastPage={
        equipData && equipData.filterEquipment && equipData.filterEquipment.context.lastPage
      }
    />
  );
};

AccessPoints.propTypes = {
  checkedLocations: PropTypes.instanceOf(Array).isRequired,
};

export default AccessPoints;
