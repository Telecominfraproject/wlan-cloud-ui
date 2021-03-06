import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Alert, notification } from 'antd';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { BulkEditAccessPoints, Loading } from '@tip-wlan/wlan-cloud-ui-library';

import { FILTER_EQUIPMENT_BULK_EDIT_APS } from 'graphql/queries';
import { UPDATE_EQUIPMENT_BULK } from 'graphql/mutations';

import UserContext from 'contexts/UserContext';
import styles from './index.module.scss';

const defaultAppliedRadios = { is5GHzL: 'is5GHzL', is2dot4GHz: 'is2dot4GHz', is5GHzU: 'is5GHzU' };

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
  { title: 'Name', dataIndex: 'name', key: 'name', width: 250, render: renderTableCell },
  {
    title: 'Manual Active Channel',
    dataIndex: 'manualChannelNumber',
    key: 'manualChannelNumber',
    editable: true,
    width: 200,
    render: renderTableCell,
  },

  {
    title: 'Manual Backup Channel',
    dataIndex: 'manualBackupChannelNumber',
    key: 'manualBackupChannelNumber',
    editable: true,
    width: 210,
    render: renderTableCell,
  },
  {
    title: 'Cell Size',
    dataIndex: 'cellSize',
    key: 'cellSize',
    editable: true,
    width: 150,
    render: renderTableCell,
  },
  {
    title: 'Probe Response Threshold',
    dataIndex: 'probeResponseThreshold',
    key: 'probeResponseThreshold',
    editable: true,
    width: 210,
    render: renderTableCell,
  },
  {
    title: 'Client Disconnect Threshold',
    dataIndex: 'clientDisconnectThreshold',
    key: 'clientDisconnectThreshold',
    editable: true,
    width: 210,

    render: renderTableCell,
  },
  {
    title: 'SNR (% Drop)',
    dataIndex: 'snrDrop',
    key: 'snrDrop',
    editable: true,
    width: 150,
    render: renderTableCell,
  },
  {
    title: 'Min Load',
    dataIndex: 'minLoad',
    key: 'minLoad',
    editable: true,
    width: 150,
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
    if (type === 'manualChannelNumber') {
      const manualChannelNumbers = [];
      Object.keys(radioDetails?.radioMap || {}).map(i => {
        return manualChannelNumbers.push(radioDetails.radioMap[i]?.manualChannelNumber);
      });
      return manualChannelNumbers;
    }

    if (type === 'manualBackupChannelNumber') {
      const manualBackupChannelNumbers = [];
      Object.keys(radioDetails?.radioMap || {}).map(i => {
        return manualBackupChannelNumbers.push(radioDetails.radioMap[i]?.manualBackupChannelNumber);
      });
      return manualBackupChannelNumbers;
    }
    if (type === 'cellSize') {
      const cellSizeValues = [];
      Object.keys(radioDetails?.radioMap || {}).map(i => {
        return cellSizeValues.push(radioDetails.radioMap[i]?.rxCellSizeDb?.value);
      });
      return cellSizeValues;
    }
    if (type === 'probeResponseThreshold') {
      const probeResponseThresholdValues = [];
      Object.keys(radioDetails?.radioMap || {}).map(i => {
        return probeResponseThresholdValues.push(
          radioDetails.radioMap[i]?.probeResponseThresholdDb?.value
        );
      });
      return probeResponseThresholdValues;
    }
    if (type === 'clientDisconnectThreshold') {
      const clientDisconnectThresholdValues = [];
      Object.keys(radioDetails?.radioMap || {}).map(i => {
        return clientDisconnectThresholdValues.push(
          radioDetails.radioMap[i]?.clientDisconnectThresholdDb?.value
        );
      });
      return clientDisconnectThresholdValues;
    }
    if (type === 'snrDrop') {
      const snrDropValues = [];
      Object.keys(radioDetails?.radioMap || {}).map(i => {
        return snrDropValues.push(
          radioDetails.advancedRadioMap[i]?.bestApSettings?.value?.dropInSnrPercentage
        );
      });
      return snrDropValues;
    }

    const minLoadValue = [];
    Object.keys(radioDetails?.radioMap || {}).map(i => {
      return minLoadValue.push(
        radioDetails.advancedRadioMap[i]?.bestApSettings?.value?.minLoadFactor
      );
    });
    return minLoadValue;
  };

  const setAccessPointsBulkEditTableData = (dataSource = []) =>
    dataSource.items.map(({ id: key, name, details }) => ({
      key,
      id: key,
      name,
      manualChannelNumber: getRadioDetails(details, 'manualChannelNumber'),
      manualBackupChannelNumber: getRadioDetails(details, 'manualBackupChannelNumber'),
      cellSize: getRadioDetails(details, 'cellSize'),
      probeResponseThreshold: getRadioDetails(details, 'probeResponseThreshold'),
      clientDisconnectThreshold: getRadioDetails(details, 'clientDisconnectThreshold'),
      snrDrop: getRadioDetails(details, 'snrDrop'),
      minLoad: getRadioDetails(details, 'minLoad'),
      radioMap: Object.keys(details?.radioMap || {}),
    }));

  const setUpdatedBulkEditTableData = (
    equipmentId,
    manualChannelNumber,
    manualBackupChannelNumber,
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
        Object.keys(details?.radioMap || defaultAppliedRadios).forEach((i, dataIndex) => {
          const frequencies = {};
          dropInSnrPercentage = snrDrop[dataIndex];
          minLoadFactor = minLoad[dataIndex];

          frequencies[`${i}`] = {
            channelNumber: manualChannelNumber[dataIndex],
            backupChannelNumber: manualBackupChannelNumber[dataIndex],
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
    Object.keys(updatedRows).forEach(key => {
      const {
        id: equipmentId,
        manualChannelNumber,
        manualBackupChannelNumber,
        cellSize,
        probeResponseThreshold,
        clientDisconnectThreshold,
        snrDrop,
        minLoad,
      } = updatedRows[key];
      const updatedEuips = setUpdatedBulkEditTableData(
        equipmentId,
        manualChannelNumber,
        manualBackupChannelNumber,
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
    });
    updateEquipments(editedRowsArr);
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
      tableData={setAccessPointsBulkEditTableData(equipData?.filterEquipment)}
      onLoadMore={handleLoadMore}
      isLastPage={equipData?.filterEquipment?.context?.lastPage}
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
