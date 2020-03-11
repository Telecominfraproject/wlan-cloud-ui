import { fromJS } from 'immutable';

export const AP_SETTING_BULK_UPDATE_REQUEST = fromJS({
  _type: 'ApSettingBulkUpdateRequest',
  equipmentIds: [],
  settingChangeSet: {
    is5GHz: [],
    is2dot4GHz: [],
  },
});

export const AP_SETTINGS = {
  AUTO_EIRP_TX_POWER: 'AUTO_EIRP_TX_POWER',
  AUTO_CELL_SIZE: 'AUTO_CELL_SIZE',
  RADIO_MODE: 'RADIO_MODE',
  LEGACY_BSS_RATE: 'LEGACY_BSS_RATE',
};

export const AP_SETTING_CHANGE = fromJS({
  _type: 'ApSettingChange',
  apSetting: null, // eg. AUTO_EIRP_TX_POWER or AUTO_CELL_SIZE
  value: {
    _type: 'AutoOrManualValue',
    // auto: null,
    // value: null,
  },
});

export const AP_SETTING_CHANGE_STATE = fromJS({
  _type: 'ApSettingChange',
  apSetting: null, // eg. LEGACY_BSS_RATE
  state: null,
});

export const AP_SETTING_CHANGE_RADIO_MODE = fromJS({
  _type: 'ApSettingChange',
  apSetting: 'RADIO_MODE',
  radioMode: null,
});
