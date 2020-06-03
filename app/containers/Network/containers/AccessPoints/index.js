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
    key: 'name',
    render: renderTableCell,
  },
  {
    title: 'ALARMS',
    dataIndex: 'alarms',
    key: 'alarms',
    render: renderTableCell,
  },
  {
    title: 'MODEL',
    dataIndex: 'model',
    key: 'model',
    render: renderTableCell,
  },
  {
    title: 'IP',
    dataIndex: 'ip',
    key: 'ip',
    render: renderTableCell,
  },
  {
    title: 'MAC',
    dataIndex: 'macAddress',
    key: 'mac',
    render: renderTableCell,
  },
  {
    title: 'ASSET ID',
    dataIndex: 'assetId',
    key: 'assetId',
    render: renderTableCell,
  },
  {
    title: 'UP TIME',
    dataIndex: 'upTime',
    key: 'upTime',
    render: renderTableCell,
  },
  {
    title: 'PROFILE',
    dataIndex: 'profile',
    key: 'profile',
    render: renderTableCell,
  },
  {
    title: 'CHANNEL',
    dataIndex: 'channel',
    key: 'channel',
    render: renderTableCell,
  },
  {
    title: 'CAPACITY',
    dataIndex: 'capacity',
    key: 'capacity',
    render: renderTableCell,
  },
  {
    title: 'NOISE FLOOR',
    dataIndex: 'noiseFloor',
    key: 'noiseFloor',
    render: renderTableCell,
  },
  {
    title: 'DEVICES',
    dataIndex: 'devices',
    key: 'devices',
    render: renderTableCell,
  },
];

const AccessPoints = ({ checkedLocations }) => {
  const { customerId } = useContext(UserContext);
  const [filterEquipment, { loading, error, data: equipData, fetchMore }] = useLazyQuery(
    FILTER_EQUIPMENT
  );

  const mapAccessPointsTableData = (dataSource = []) => {
    return dataSource.map(
      ({ id, name, alarms, model, inventoryId, devices, profile, channel, status }) => {
        return {
          key: id,
          name,
          alarms,
          model,
          ip: status.protocol.details.reportedIpV4Addr,
          macAddress: status.protocol.details.reportedMacAddr,
          assetId: inventoryId,
          upTime: status.osPerformance.details.uptimeInSeconds,
          profile: profile.name,
          channel,
          capacity: status.radioUtilization.details.capacityDetails,
          noiseFloor: status.radioUtilization.details.noiseFloorDetails,
          devices,
        };
      }
    );
  };

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
      tableData={mapAccessPointsTableData(
        equipData && equipData.filterEquipment && equipData.filterEquipment.items
      )}
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
