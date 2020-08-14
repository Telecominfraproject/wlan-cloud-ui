import { UPDATE_TRACK_ASSIGNMENT } from 'graphql/mutations';
import {
  GET_ALL_FIRMWARE,
  GET_ALL_FIRMWARE_MODELS,
  GET_FIRMWARE_TRACK,
  GET_TRACK_ASSIGNMENTS,
} from 'graphql/queries';

export const firmwareQueryMock = {
  getAllFirmwareSuccess: {
    request: {
      query: GET_ALL_FIRMWARE,
    },
    result: {
      data: {
        getAllFirmware: [
          {
            id: '1',
            modelId: 'ap2220',
            versionName: 'ap2220-2020-06-25-ce03472',
            description: '',
            filename:
              'https://tip-read:tip-read@tip.jfrog.io/artifactory/tip-wlan-ap-firmware/ap2220/ap2220-2020-06-25-ce03472.tar.gz',
            commit: 'ce03472',
            releaseDate: '1597329017106',
            validationCode: 'c69370aa5b6622d91a0fba3a5441f31c',
            createdTimestamp: '1597329017115',
            lastModifiedTimestamp: '1597329017115',
            __typename: 'Firmware',
          },
          {
            id: '2',
            modelId: 'ea8300',
            versionName: 'ea8300-2020-06-25-ce03472',
            description: '',
            filename:
              'https://tip-read:tip-read@tip-read:tip-read@tip.jfrog.io/artifactory/tip-wlan-ap-firmware/ea8300/ea8300-2020-06-25-ce03472.tar.gz',
            commit: 'ce03472',
            releaseDate: '1597329017115',
            validationCode: 'b209deb9847bdf40a31e45edf2e5a8d7',
            createdTimestamp: '1597329017115',
            lastModifiedTimestamp: '1597329017115',
            __typename: 'Firmware',
          },
          {
            id: '3',
            modelId: 'ea8300-ca',
            versionName: 'ea8300-2020-06-25-ce03472',
            description: '',
            filename:
              'https://tip-read:tip-read@tip.jfrog.io/artifactory/tip-wlan-ap-firmware/ea8300/ea8300-2020-06-25-ce03472.tar.gz',
            commit: 'ce03472',
            releaseDate: '1597329017115',
            validationCode: 'b209deb9847bdf40a31e45edf2e5a8d7',
            createdTimestamp: '1597329017115',
            lastModifiedTimestamp: '1597329017115',
            __typename: 'Firmware',
          },
          {
            id: '4',
            modelId: 'ecw5211',
            versionName: 'ecw5211-2020-06-26-4ff7208',
            description: '',
            filename:
              'https://tip-read:tip-read@tip.jfrog.io/artifactory/tip-wlan-ap-firmware/ecw5211/ecw5211-2020-06-26-4ff7208.tar.gz',
            commit: '4ff7208',
            releaseDate: '1597329017115',
            validationCode: '133072b0e8a440063109604375938fba',
            createdTimestamp: '1597329017115',
            lastModifiedTimestamp: '1597329017115',
            __typename: 'Firmware',
          },
          {
            id: '5',
            modelId: 'ecw5410',
            versionName: 'ecw5410-2020-06-25-ce03472',
            description: '',
            filename:
              'https://tip-read:tip-read@tip.jfrog.io/artifactory/tip-wlan-ap-firmware/ecw5410/ecw5410-2020-06-25-ce03472.tar.gz',
            commit: 'ce03472',
            releaseDate: '1597329017115',
            validationCode: '2940ca34eeab85be18f3a4b79f4da6d9',
            createdTimestamp: '1597329017115',
            lastModifiedTimestamp: '1597329017115',
            __typename: 'Firmware',
          },
        ],
      },
      loading: false,
      networkStatus: 7,
      stale: false,
    },
  },

  getAllFirmwareModelsSuccess: {
    request: {
      query: GET_ALL_FIRMWARE_MODELS,
    },
    result: {
      data: {
        getAllFirmwareModelId: ['ea8300-ca', 'ap2220', 'ecw5211', 'ea8300', 'ecw5410'],
      },
      loading: false,
      networkStatus: 7,
      stale: false,
    },
  },

  getFirmwareTrackAssignmentSuccess: {
    request: {
      query: GET_TRACK_ASSIGNMENTS,
    },
    result: {
      data: {
        getAllFirmwareTrackAssignment: [
          {
            modelId: 'ap2220',
            firmwareVersionRecordId: '1',
            trackRecordId: '1',
            lastModifiedTimestamp: '1597342689340',
            __typename: 'FirmwareTrackAssignment',
          },
          {
            modelId: 'ea8300',
            firmwareVersionRecordId: '2',
            trackRecordId: '1',
            lastModifiedTimestamp: '1597172802693',
            __typename: 'FirmwareTrackAssignment',
          },
          {
            modelId: 'ea8300-ca',
            firmwareVersionRecordId: '3',
            trackRecordId: '1',
            lastModifiedTimestamp: '1597172802693',
            __typename: 'FirmwareTrackAssignment',
          },
          {
            modelId: 'ecw5211',
            firmwareVersionRecordId: '4',
            trackRecordId: '1',
            lastModifiedTimestamp: '1597172802693',
            __typename: 'FirmwareTrackAssignment',
          },
        ],
      },
      loading: false,
      networkStatus: 7,
      stale: false,
    },
  },

  getFirmwareTrackSuccess: {
    request: {
      query: GET_FIRMWARE_TRACK,
      variables: { firmwareTrackName: 'DEFAULT' },
    },
    result: {
      data: {
        getFirmwareTrack: {
          recordId: '1',
          trackName: 'DEFAULT',
          createdTimestamp: '1597329017117',
          lastModifiedTimestamp: '1597329017117',
          __typename: 'FirmwareTrack',
        },
      },
      loading: false,
      networkStatus: 7,
      stale: false,
    },
  },
  error: {
    request: {
      query: GET_FIRMWARE_TRACK,
      variables: { customerId: 2 },
    },
    result: {
      data: null,
      errors: [{}],
    },
  },
};

export const firmwareMutationMock = {
  updateTrackAssignmentSuccess: {
    request: {
      query: UPDATE_TRACK_ASSIGNMENT,
      variables: {
        trackRecordId: '1',
        firmwareVersionRecordId: '1',
        modelId: 'ap2220',
        lastModifiedTimestamp: '1597342689340',
      },
    },
    result: {
      data: {
        updateFirmwareTrackAssignment: {
          trackRecordId: '1',
          firmwareVersionRecordId: '1',
          modelId: 'ap2220',
          createdTimestamp: '0',
          lastModifiedTimestamp: '1597342689340',
          __typename: 'FirmwareTrackAssignment',
        },
      },
    },
  },
  updateTrackAssignmentError: {
    request: {
      query: UPDATE_TRACK_ASSIGNMENT,
      variables: {
        trackRecordId: '1',
        firmwareVersionRecordId: '1',
        modelId: 'ap2220',
        lastModifiedTimestamp: '1597342689340',
      },
    },
    result: {
      data: null,
      errors: [{}],
    },
  },
};
