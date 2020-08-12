import { GET_ALL_ALARMS } from 'graphql/queries';

export const alarmsQueryMock = {
  success: {
    request: {
      query: GET_ALL_ALARMS,
      variables: { customerId: 2 },
      errorPolicy: 'all',
    },
    result: {
      data: {
        getAllAlarms: {
          items: [
            {
              severity: 'error',
              alarmCode: 'MemoryUtilization',
              details: {
                model_type: 'AlarmDetails',
                message: 'Available memory is too low',
                affectedEquipmentIds: null,
                generatedBy: null,
                contextAttrs: null,
              },
              createdTimestamp: '1596564234684',
              equipment: {
                id: '7',
                name: 'AP 7',
              },
            },
            {
              severity: 'error',
              alarmCode: 'MemoryUtilization',
              details: {
                model_type: 'AlarmDetails',
                message: 'Available memory is too low',
                affectedEquipmentIds: null,
                generatedBy: null,
                contextAttrs: null,
              },
              createdTimestamp: '1596564234796',
              equipment: {
                id: '14',
                name: 'AP 14',
              },
            },
            {
              severity: 'error',
              alarmCode: 'MemoryUtilization',
              details: {
                model_type: 'AlarmDetails',
                message: 'Available memory is too low',
                affectedEquipmentIds: null,
                generatedBy: null,
                contextAttrs: null,
              },
              createdTimestamp: '1596564234885',
              equipment: {
                id: '21',
                name: 'AP 21',
              },
            },
            {
              severity: 'error',
              alarmCode: 'MemoryUtilization',
              details: {
                model_type: 'AlarmDetails',
                message: 'Available memory is too low',
                affectedEquipmentIds: null,
                generatedBy: null,
                contextAttrs: null,
              },
              createdTimestamp: '1596564234957',
              equipment: {
                id: '28',
                name: 'AP 28',
              },
            },
            {
              severity: 'error',
              alarmCode: 'MemoryUtilization',
              details: {
                model_type: 'AlarmDetails',
                message: 'Available memory is too low',
                affectedEquipmentIds: null,
                generatedBy: null,
                contextAttrs: null,
              },
              createdTimestamp: '1596564235022',
              equipment: {
                id: '35',
                name: 'AP 35',
              },
            },
            {
              severity: 'error',
              alarmCode: 'MemoryUtilization',
              details: {
                model_type: 'AlarmDetails',
                message: 'Available memory is too low',
                affectedEquipmentIds: null,
                generatedBy: null,
                contextAttrs: null,
              },
              createdTimestamp: '1596564235082',
              equipment: {
                id: '42',
                name: 'AP 42',
              },
            },
            {
              severity: 'error',
              alarmCode: 'MemoryUtilization',
              details: {
                model_type: 'AlarmDetails',
                message: 'Available memory is too low',
                affectedEquipmentIds: null,
                generatedBy: null,
                contextAttrs: null,
              },
              createdTimestamp: '1596564235155',
              equipment: {
                id: '49',
                name: 'AP 49',
              },
            },
          ],
          context: {
            cursor: 'test',
            lastPage: false,
          },
        },
      },
      loading: false,
      networkStatus: 7,
      stale: false,
    },
  },
  loadmore: {
    request: {
      query: GET_ALL_ALARMS,
      variables: { customerId: 2, cursor: 'test' },
      errorPolicy: 'all',
    },
    result: {
      data: {
        getAllAlarms: {
          items: [
            {
              severity: 'error',
              alarmCode: 'MemoryUtilization',
              details: {
                model_type: 'AlarmDetails',
                message: 'Available memory is too low',
                affectedEquipmentIds: null,
                generatedBy: null,
                contextAttrs: null,
              },
              createdTimestamp: '1596564234684',
              equipment: {
                id: '7',
                name: 'AP 7',
              },
            },
          ],
          context: {
            cursor: 'test2',
            lastPage: true,
          },
        },
      },
      loading: false,
      networkStatus: 7,
      stale: false,
    },
  },

  error: {
    request: {
      query: GET_ALL_ALARMS,
      variables: { customerId: 2 },
      errorPolicy: 'all',
    },
    result: {
      data: null,
      loading: false,
      errors: [{}],
      networkStatus: 7,
      stale: false,
    },
  },
};
