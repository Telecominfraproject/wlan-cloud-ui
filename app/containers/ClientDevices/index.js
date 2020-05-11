import React, { useState, useMemo } from 'react';
import { ClientDevices as ClientDevicesPage } from '@tip-wlan/wlan-cloud-ui-library';
import { LOCATIONS_TREE_DATA, CLIENT_DEVICES_TABLE_DATA } from 'constants/index';

const ClientDevices = () => {
  const [checkedLocations, setCheckedLocations] = useState(['0-0-0', '0-1-0', '0-2-0']);
  const [checkboxTouched, setCheckboxTouched] = useState(false);
  const [selected, setSelected] = useState(false);

  const onSelect = () => {
    setSelected(!selected);
  };

  const onCheck = (_checkedKeys, info) => {
    setCheckboxTouched(true);
    if (info.checked) {
      setCheckedLocations([...checkedLocations, info.node.key]);
    } else {
      const index = checkedLocations.indexOf(info.node.key);
      const temp = [...checkedLocations];
      temp.splice(index, 1);
      setCheckedLocations(temp);
    }
  };

  const devicesData = useMemo(() => {
    if (!checkboxTouched) return CLIENT_DEVICES_TABLE_DATA;
    const filteredData = [];
    checkedLocations.forEach(locationId => {
      CLIENT_DEVICES_TABLE_DATA.filter(data => {
        return data.locationId === locationId ? filteredData.push(data) : '';
      });
    });
    return filteredData;
  }, [checkedLocations]);

  return (
    <ClientDevicesPage
      onSelect={onSelect}
      onCheck={onCheck}
      tableData={devicesData}
      treeData={LOCATIONS_TREE_DATA}
      checkedLocations={checkedLocations}
    />
  );
};

export default ClientDevices;
