import React, { useContext, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Alert, notification } from 'antd';
import { useParams } from 'react-router-dom';
import { useLazyQuery, useMutation } from '@apollo/client';
import { BulkEditAccessPoints, sortRadioTypes } from '@tip-wlan/wlan-cloud-ui-library';
import { USER_FRIENDLY_RADIOS } from 'constants/index';

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
  { title: 'Name', dataIndex: 'name', key: 'name', width: 250, render: renderTableCell },

  {
    title: 'Radios',
    dataIndex: 'radioMap',
    width: 150,
    render: text => renderTableCell(text.map(i => USER_FRIENDLY_RADIOS[i])),
  },
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

const getRadioDetails = (radioDetails, type) => {
  const sortedRadios = sortRadioTypes(Object.keys(radioDetails?.radioMap || {}));

  if (type === 'manualChannelNumber') {
    return sortedRadios.map(i => radioDetails.radioMap[i]?.manualChannelNumber);
  }

  if (type === 'manualBackupChannelNumber') {
    return sortedRadios.map(i => radioDetails.radioMap[i]?.manualBackupChannelNumber);
  }
  if (type === 'snrDrop') {
    return sortedRadios.map(
      i => radioDetails.advancedRadioMap[i]?.bestApSettings?.value?.dropInSnrPercentage
    );
  }
  if (type === 'allowedChannels') {
    return sortedRadios.map(i => radioDetails.radioMap[i]?.allowedChannelsPowerLevels);
  }

  if (type === 'minLoad') {
    return sortedRadios.map(
      i => radioDetails.advancedRadioMap[i]?.bestApSettings?.value?.minLoadFactor
    );
  }

  if (type === 'cellSize') {
    return sortedRadios.map(i => radioDetails.radioMap[i]?.rxCellSizeDb?.value);
  }

  if (type === 'probeResponseThreshold') {
    return sortedRadios.map(i => radioDetails.radioMap[i]?.probeResponseThresholdDb?.value);
  }

  if (type === 'clientDisconnectThreshold') {
    return sortedRadios.map(i => radioDetails.radioMap[i]?.clientDisconnectThresholdDb?.value);
  }

  return sortedRadios;
};

const formatRadioFrequencies = ({
  manualChannelNumber,
  manualBackupChannelNumber,
  snrDrop,
  minLoad,
  cellSize,
  probeResponseThreshold,
  clientDisconnectThreshold,
  radioMap = [],
}) => {
  const frequencies = {};
  radioMap.forEach((i, index) => {
    frequencies[i] = {
      channelNumber: manualChannelNumber[index],
      backupChannelNumber: manualBackupChannelNumber[index],
      dropInSnrPercentage: snrDrop[index],
      minLoadFactor: minLoad[index],
      rxCellSizeDb: {
        auto: true,
        value: cellSize[index],
      },
      probeResponseThresholdDb: {
        auto: true,
        value: probeResponseThreshold[index],
      },
      clientDisconnectThresholdDb: {
        auto: true,
        value: clientDisconnectThreshold[index],
      },
    };
  });
  return frequencies;
};

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
    errorPolicy: 'all',
    fetchPolicy: 'cache-first',
  });

  const fetchFilterEquipment = async () => {
    filterEquipment({
      variables: {
        customerId,
        locationIds,
        equipmentType: 'AP',
      },
    });
  };
  const [updateEquipmentBulk] = useMutation(UPDATE_EQUIPMENT_BULK);

  const formattedTableData = useMemo(
    () =>
      equipData?.filterEquipment?.items?.map(({ id: key, name, details = {} }) => ({
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
        radioMap: getRadioDetails(details, 'radioMap'),
        allowedChannels: getRadioDetails(details, 'allowedChannels'),
      })),
    [equipData?.filterEquipment?.items]
  );

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
      return editedRowsArr.push({
        equipmentId: updatedRows[key].id,
        perRadioDetails: formatRadioFrequencies(updatedRows[key]),
      });
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

  useEffect(() => {
    fetchFilterEquipment();
  }, [locationIds]);

  if (filterEquipmentError) {
    return (
      <Alert
        message="Error"
        description="Failed to load equipment(s) data."
        type="error"
        showIcon
      />
    );
  }

  return (
    <BulkEditAccessPoints
      tableColumns={accessPointsChannelTableColumns}
      tableData={formattedTableData}
      onLoadMore={handleLoadMore}
      isLastPage={equipData?.filterEquipment?.context?.lastPage}
      onSaveChanges={handleSaveChanges}
      breadcrumbPath={getBreadcrumbPath(id, locations)}
      loading={filterEquipmentLoading}
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
