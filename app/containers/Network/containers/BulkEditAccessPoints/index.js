import React from 'react';
import { BulkEditAccessPoints } from '@tip-wlan/wlan-cloud-ui-library';
import { ACCESS_POINTS_CHANNEL_TABLE_DATA } from 'constants/index.js';

const renderTableCell = tabCell => {
  if (Array.isArray(tabCell)) {
    return (
      <div>
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
    title: 'ACTIVE CHANNEL',
    dataIndex: 'activeChannel',
    key: 'activeChannel',
    render: renderTableCell,
  },
  {
    title: 'BACKUP CHANNEL',
    dataIndex: 'backupChannel',
    key: 'backupChannel',
    render: renderTableCell,
  },
  {
    title: 'CHANNEL BANDWIDTH',
    dataIndex: 'channelBandwidth',
    key: 'channelBandwidth',
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
