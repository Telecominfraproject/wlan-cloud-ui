import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Alert, notification } from 'antd';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { BulkEditAccessPoints, Loading } from '@tip-wlan/wlan-cloud-ui-library';

import { FILTER_EQUIPMENT_BULK_EDIT_APS } from 'graphql/queries';
import { UPDATE_EQUIPMENT_BULK } from 'graphql/mutations';

import UserContext from 'contexts/UserContext';
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

const getBreadcrumbPath = (id, locations) => {
  const locationsPath = [];
  const treeRecurse = (parentNodeId, node) => {
    if (node.id === parentNodeId) {
      locationsPath.unshift(node);
      return node;
    }
    if (node.children) {
      let parent;
      node.children.some(i => {
        parent = treeRecurse(parentNodeId, i);
        return parent;
      });
      if (parent) {
        locationsPath.unshift(node);
      }
      return parent;
    }
    return null;
  };

  treeRecurse(id, {
    id: 0,
    children: locations,
  });

  return locationsPath;
};

const getLocationPath = (selectedId, locations) => {
  const locationsPath = [];

  const treeRecurse = (parentNodeId, node) => {
    if (node.id === parentNodeId) {
      locationsPath.unshift(node.id);

      if (node.children) {
        const flatten = children => {
          children.forEach(i => {
            locationsPath.unshift(i.id);
            if (i.children) {
              flatten(i.children);
            }
          });
        };

        flatten(node.children);
      }
      return node;
    }
    if (node.children) {
      let parent;
      node.children.some(i => {
        parent = treeRecurse(parentNodeId, i);
        return parent;
      });
      return parent;
    }

    return null;
  };

  if (selectedId) {
    treeRecurse(selectedId, { id: 0, children: locations });
  }

  return locationsPath;
};

const BulkEditAPs = ({ locations, checkedLocations }) => {
  const { id } = useParams();
  const { customerId } = useContext(UserContext);
  const locationIds = useMemo(() => {
    const locationPath = getLocationPath(id, locations);
    return locationPath.filter(f => checkedLocations.includes(f));
  }, [id, locations, checkedLocations]);

  const {
    loading: filterEquipmentLoading,
    error: filterEquipmentError,
    refetch,
    data: equipData,
    fetchMore,
  } = useQuery(FILTER_EQUIPMENT_BULK_EDIT_APS, {
    variables: { customerId, locationIds, equipmentType: 'AP' },
  });

  const [updateEquipmentBulk] = useMutation(UPDATE_EQUIPMENT_BULK);

  const getRadioDetails = (radioDetails, type) => {
    if (type === 'cellSize') {
      const cellSizeValues = [];
      Object.keys(radioDetails.radioMap).map(i => {
        return cellSizeValues.push(radioDetails.radioMap[i].rxCellSizeDb.value);
      });
      return cellSizeValues;
    }
    if (type === 'probeResponseThreshold') {
      const probeResponseThresholdValues = [];
      Object.keys(radioDetails.radioMap).map(i => {
        return probeResponseThresholdValues.push(
          radioDetails.radioMap[i].probeResponseThresholdDb.value
        );
      });
      return probeResponseThresholdValues;
    }
    if (type === 'clientDisconnectThreshold') {
      const clientDisconnectThresholdValues = [];
      Object.keys(radioDetails.radioMap).map(i => {
        return clientDisconnectThresholdValues.push(
          radioDetails.radioMap[i].clientDisconnectThresholdDb.value
        );
      });
      return clientDisconnectThresholdValues;
    }
    if (type === 'snrDrop') {
      const snrDropValues = [];
      Object.keys(radioDetails.advancedRadioMap).map(i => {
        return snrDropValues.push(
          radioDetails.advancedRadioMap[i].bestApSettings.dropInSnrPercentage
        );
      });
      return snrDropValues;
    }

    const minLoadValue = [];
    Object.keys(radioDetails.advancedRadioMap).map(i => {
      return minLoadValue.push(radioDetails.advancedRadioMap[i].bestApSettings.minLoadFactor);
    });
    return minLoadValue;
  };

  const setAccessPointsBulkEditTableData = (dataSource = []) => {
    const tableData = dataSource.items.map(({ id: key, name, channel, details }) => {
      return {
        key,
        id: key,
        name,
        channel,
        cellSize: getRadioDetails(details, 'cellSize'),
        probeResponseThreshold: getRadioDetails(details, 'probeResponseThreshold'),
        clientDisconnectThreshold: getRadioDetails(details, 'clientDisconnectThreshold'),
        snrDrop: getRadioDetails(details, 'snrDrop'),
        minLoad: getRadioDetails(details, 'minLoad'),
      };
    });
    return tableData;
  };

  const setUpdatedBulkEditTableData = (
    equipmentId,
    channel,
    cellSize,
    probeResponseThreshold,
    clientDisconnectThreshold,
    snrDrop,
    minLoad,
    dataSource = []
  ) => {
    const updatedItems = [];
    let dropInSnrPercentage;
    let minLoadFactor;
    dataSource.items.forEach(({ id: itemId, details }) => {
      if (equipmentId === itemId) {
        Object.keys(details.radioMap).forEach((i, dataIndex) => {
          const frequencies = {};
          dropInSnrPercentage = snrDrop[dataIndex];
          minLoadFactor = minLoad[dataIndex];

          frequencies[`${i}`] = {
            channelNumber: channel[dataIndex],
            rxCellSizeDb: {
              auto: true,
              value: cellSize[dataIndex],
            },
            probeResponseThresholdDb: {
              auto: true,
              value: probeResponseThreshold[dataIndex],
            },
            clientDisconnectThresholdDb: {
              auto: true,
              value: clientDisconnectThreshold[dataIndex],
            },
            dropInSnrPercentage,
            minLoadFactor,
          };
          updatedItems.push(frequencies);
        });
      }
    });
    return updatedItems;
  };

  const updateEquipments = editedRowsArr => {
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
  };

  const handleSaveChanges = updatedRows => {
    const editedRowsArr = [];
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
          const updatedEuips = setUpdatedBulkEditTableData(
            equipmentId,
            channel,
            cellSize,
            probeResponseThreshold,
            clientDisconnectThreshold,
            snrDrop,
            minLoad,
            equipData && equipData.filterEquipment
          );
          const tempObj = {
            equipmentId,
            perRadioDetails: {},
          };
          updatedEuips.map(item => {
            Object.keys(item).forEach(i => {
              tempObj.perRadioDetails[i] = item[i];
            });
            return tempObj;
          });
          return editedRowsArr.push(tempObj);
        }
      );
      updateEquipments(editedRowsArr);
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
        equipData &&
        equipData.filterEquipment &&
        equipData.filterEquipment.context &&
        equipData.filterEquipment.context.lastPage
      }
      onSaveChanges={handleSaveChanges}
      breadcrumbPath={getBreadcrumbPath(id, locations)}
    />
  );
};

BulkEditAPs.propTypes = {
  locations: PropTypes.instanceOf(Array),
  checkedLocations: PropTypes.instanceOf(Array),
};

BulkEditAPs.defaultProps = {
  locations: [],
  checkedLocations: [],
};

export default BulkEditAPs;
