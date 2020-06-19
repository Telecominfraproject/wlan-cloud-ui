import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, notification } from 'antd';
import { useQuery, useLazyQuery, useMutation } from '@apollo/react-hooks';
import { BulkEditAccessPoints, Loading } from '@tip-wlan/wlan-cloud-ui-library';
import { IS_2DOT4GHZ, IS_5GHZL, IS_5GHZU } from 'constants/index.js';
import { GET_ALL_LOCATIONS, FILTER_EQUIPMENT_BULK_EDIT_APS } from 'graphql/queries';
import { UPDATE_EQUIPMENT_BULK } from 'graphql/mutations';

import UserContext from 'contexts/UserContext';
import styles from './index.module.scss';

const renderTableCell = tabCell => {
  if (Array.isArray(tabCell)) {
    return (
      <div className={styles.tabColumn}>
        {tabCell.map(i => (
          <span>{i}</span>
        ))}
      </div>
    );
  }
  return <span>{tabCell}</span>;
};
const accessPointsChannelTableColumns = [
  { title: 'NAME', dataIndex: 'name', key: 'name', render: renderTableCell },
  {
    title: 'CHANNEL',
    dataIndex: 'channel',
    key: 'channel',
    editable: true,
    render: renderTableCell,
  },
  {
    title: 'CELL SIZE',
    dataIndex: 'cellSize',
    key: 'cellSize',
    editable: true,
    render: renderTableCell,
  },
  {
    title: 'PROB RESPONSE THRESHOLD',
    dataIndex: 'probeResponseThreshold',
    key: 'probeResponseThreshold',
    editable: true,
    render: renderTableCell,
  },
  {
    title: 'CLIENT DISCONNECT THRESHOLD',
    dataIndex: 'clientDisconnectThreshold',
    key: 'clientDisconnectThreshold',
    editable: true,
    render: renderTableCell,
  },
  {
    title: 'SNR (% DROP)',
    dataIndex: 'snrDrop',
    key: 'snrDrop',
    editable: true,
    render: renderTableCell,
  },
  {
    title: 'MIN LOAD',
    dataIndex: 'minLoad',
    key: 'minLoad',
    editable: true,
    render: renderTableCell,
  },
];

const BulkEditAPs = () => {
  const { customerId } = useContext(UserContext);
  const [selectedLocationIds, setSelectedLocationIds] = useState([]);
  const { id } = useParams();
  const { data } = useQuery(GET_ALL_LOCATIONS, {
    variables: { customerId },
  });
  const [
    filterEquipment,
    {
      loading: filterEquipmentLoading,
      error: filterEquipmentError,
      refetch,
      data: equipData,
      fetchMore,
    },
  ] = useLazyQuery(FILTER_EQUIPMENT_BULK_EDIT_APS, {
    variables: { customerId },
  });
  const [updateEquipmentBulk] = useMutation(UPDATE_EQUIPMENT_BULK);

  const fetchFilterEquipmentBulkEditAps = locationIds => {
    filterEquipment({
      variables: {
        customerId,
        locationIds,
        equipmentType: 'AP',
      },
    });
  };

  const locationIdsArray = [];
  const getChildNodes = locations => {
    const childArr = [];
    locations.forEach(a => {
      locationIdsArray.push(a);
      data.getAllLocations.forEach(b => {
        if (b.parentId === a) childArr.push(b.id);
      });
    });
    if (childArr.length > 0) {
      getChildNodes(childArr);
    } else {
      setSelectedLocationIds(locationIdsArray);
    }
  };

  useEffect(() => {
    const locationId = parseInt(id, 10);
    getChildNodes([locationId]);
  }, [data, id]);

  useEffect(() => {
    fetchFilterEquipmentBulkEditAps(selectedLocationIds);
  }, [selectedLocationIds]);

  const getRadioDetailsByType = (radioDetails, type, radioType) => {
    if (type === 'cellSize') {
      const cellSize = radioDetails.radioMap[radioType].rxCellSizeDb.value;
      return cellSize;
    }
    if (type === 'probeResponseThreshold') {
      const probeResponseThreshold =
        radioDetails.radioMap[radioType].probeResponseThresholdDb.value;
      return probeResponseThreshold;
    }
    if (type === 'clientDisconnectThreshold') {
      const clientDisconnectThreshold =
        radioDetails.radioMap[radioType].clientDisconnectThresholdDb.value;
      return clientDisconnectThreshold;
    }
    if (type === 'snrDrop') {
      const snrDrop = radioDetails.advancedRadioMap[radioType].bestApSettings.dropInSnrPercentage;
      return snrDrop;
    }
    // if (type === 'minLoad') {
    const minLoad = radioDetails.advancedRadioMap[radioType].bestApSettings.minLoadFactor;
    return minLoad;
    // }
  };

  const getRadioDetails = (radioDetails, type) => {
    const is5GHzU = getRadioDetailsByType(radioDetails, type, IS_5GHZU);
    const is5GHzL = getRadioDetailsByType(radioDetails, type, IS_5GHZL);
    const is2dot4GHz = getRadioDetailsByType(radioDetails, type, IS_2DOT4GHZ);

    return {
      is5GHzU,
      is5GHzL,
      is2dot4GHz,
    };
  };

  const setAccessPointsBulkEditTableData = (dataSource = []) => {
    const tableData = dataSource.items.map(({ id: key, name, channel, details }) => {
      const cellSizeDetails = Object.values(getRadioDetails(details, 'cellSize'));
      const probeResponseThresholdDetails = Object.values(
        getRadioDetails(details, 'probeResponseThreshold')
      );
      const clientDisconnectThresholdDetails = Object.values(
        getRadioDetails(details, 'clientDisconnectThreshold')
      );
      const snrDropDetails = Object.values(getRadioDetails(details, 'snrDrop'));
      const minLoadDetails = Object.values(getRadioDetails(details, 'minLoad'));
      return {
        key,
        id: key,
        name,
        channel,
        cellSize: cellSizeDetails,
        probeResponseThreshold: probeResponseThresholdDetails,
        clientDisconnectThreshold: clientDisconnectThresholdDetails,
        snrDrop: snrDropDetails,
        minLoad: minLoadDetails,
      };
    });
    return tableData;
  };

  const editedRowsArr = [];
  const handleSaveChanges = updatedRows => {
    if (updatedRows.length > 0) {
      updatedRows.map(
        ({
          id: equipmentId,
          channel,
          cellSize,
          probeResponseThreshold,
          clientDisconnectThreshold,
          snrDrop,
          minLoad,
        }) => {
          const tempObj = {
            equipmentId,
            perRadioDetails: {
              is5GHzU: {
                channelNumber: channel[0],
                rxCellSizeDb: {
                  auto: true,
                  value: cellSize[0],
                },
                probeResponseThresholdDb: {
                  auto: true,
                  value: probeResponseThreshold[0],
                },
                clientDisconnectThresholdDb: {
                  auto: true,
                  value: clientDisconnectThreshold[0],
                },
                dropInSnrPercentage: snrDrop[0],
                minLoadFactor: minLoad[0],
              },
              is5GHzL: {
                channelNumber: channel[2],
                rxCellSizeDb: {
                  auto: true,
                  value: cellSize[1],
                },
                probeResponseThresholdDb: {
                  auto: true,
                  value: probeResponseThreshold[1],
                },
                clientDisconnectThresholdDb: {
                  auto: true,
                  value: clientDisconnectThreshold[1],
                },
                dropInSnrPercentage: snrDrop[1],
                minLoadFactor: minLoad[1],
              },
              is2dot4GHz: {
                channelNumber: channel[1],
                rxCellSizeDb: {
                  auto: true,
                  value: cellSize[2],
                },
                probeResponseThresholdDb: {
                  auto: true,
                  value: probeResponseThreshold[2],
                },
                clientDisconnectThresholdDb: {
                  auto: true,
                  value: clientDisconnectThreshold[2],
                },
                dropInSnrPercentage: snrDrop[2],
                minLoadFactor: minLoad[2],
              },
            },
          };
          editedRowsArr.push(tempObj);
          return tempObj;
        }
      );
      updateEquipmentBulk({
        variables: { items: editedRowsArr },
      })
        .then(resp => {
          if (resp.data.updateEquipmentBulk.success) {
            notification.success({
              message: 'Success',
              description: 'Equipment(s) successfully edited.',
            });
            refetch();
          }
        })
        .catch(() => {
          notification.error({
            message: 'Error',
            description: 'Equipment(s) could not be edited.',
          });
        });
    }
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

  if (filterEquipmentLoading) {
    return <Loading />;
  }

  if (filterEquipmentError) {
    return (
      <Alert message="Error" description="Failed to load equipments data." type="error" showIcon />
    );
  }

  return (
    <BulkEditAccessPoints
      tableColumns={accessPointsChannelTableColumns}
      tableData={
        equipData &&
        equipData.filterEquipment &&
        setAccessPointsBulkEditTableData(equipData && equipData.filterEquipment)
      }
      onLoadMore={handleLoadMore}
      isLastPage={
        equipData && equipData.filterEquipment && equipData.filterEquipment.context.lastPage
      }
      onSaveChanges={handleSaveChanges}
    />
  );
};
export default BulkEditAPs;
