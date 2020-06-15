import React from 'react';
import { BulkEditAccessPoints } from '@tip-wlan/wlan-cloud-ui-library';
import { ACCESS_POINTS_CHANNEL_TABLE_DATA } from 'constants/index.js';
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
    render: renderTableCell,
  },
  {
    title: 'CELL SIZE',
    dataIndex: 'cellSize',
    key: 'cellSize',
    render: renderTableCell,
  },
  {
    title: 'PROB RESPONSE THRESHOLD',
    dataIndex: 'probResponseThreshold',
    key: 'probResponseThreshold',
    render: renderTableCell,
  },
  {
    title: 'CLIENT DISCONNECT THRESHOLD',
    dataIndex: 'clientDisconnectThreshold',
    key: 'clientDisconnectThreshold',
    render: renderTableCell,
  },
  {
    title: 'SNR (% DROP)',
    dataIndex: 'snr',
    key: 'snr',
    render: renderTableCell,
  },
  {
    title: 'MIN LOAD',
    dataIndex: 'minLoad',
    key: 'minLoad',
    render: renderTableCell,
  },
];

const BulkEditAPs = () => {
  return (
    <BulkEditAccessPoints
      tableColumns={accessPointsChannelTableColumns}
      tableData={ACCESS_POINTS_CHANNEL_TABLE_DATA}
    />
  );
};
export default BulkEditAPs;
