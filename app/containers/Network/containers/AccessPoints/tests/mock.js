import { FILTER_EQUIPMENT } from 'graphql/queries';

export const AccessPointsQueryMock = {
  filterEquipment: {
    success: {
      request: {
        query: FILTER_EQUIPMENT,
        variables: {
          customerId: 2,
          locationIds: ['2', '3', '4', '5', '6', '7', '8'],
          equipmentType: 'AP',
        },
      },
      result: {
        data: {
          filterEquipment: {
            items: [
              {
                name: 'AP 1',
                id: '1',
                locationId: '4',
                profileId: '6',
                inventoryId: 'ap-1',
                channel: [6, 149, 36],
                model: 'ecw5211',
                alarmsCount: 0,
                profile: {
                  name: 'ApProfile-3-radios',
                  __typename: 'Profile',
                },
                status: {
                  protocol: {
                    details: {
                      reportedIpV4Addr: '192.168.1.124',
                      reportedMacAddr: '74:9c:e3:10:aa:8a',
                      manufacturer: 'KodaCloud Canada Inc.',
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  osPerformance: {
                    details: {
                      uptimeInSeconds: 2423,
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  radioUtilization: {
                    details: {
                      reportedIpV4Addr: null,
                      capacityDetails: [68, 56, 27],
                      noiseFloorDetails: [-62, -82, -80],
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  clientDetails: {
                    details: null,
                    __typename: 'Status',
                  },
                  __typename: 'EquipmentStatus',
                },
                __typename: 'Equipment',
              },
              {
                name: 'AP 2',
                id: '2',
                locationId: '4',
                profileId: '6',
                inventoryId: 'ap-2',
                channel: [6, 149, 36],
                model: 'ecw5410',
                alarmsCount: 0,
                profile: {
                  name: 'ApProfile-3-radios',
                  __typename: 'Profile',
                },
                status: {
                  protocol: {
                    details: {
                      reportedIpV4Addr: '192.168.1.19',
                      reportedMacAddr: '74:9c:e3:b0:58:94',
                      manufacturer: 'KodaCloud Canada Inc.',
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  osPerformance: {
                    details: {
                      uptimeInSeconds: 6563,
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  radioUtilization: {
                    details: {
                      reportedIpV4Addr: null,
                      capacityDetails: [75, 19, 50],
                      noiseFloorDetails: [-90, -77, -45],
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  clientDetails: {
                    details: null,
                    __typename: 'Status',
                  },
                  __typename: 'EquipmentStatus',
                },
                __typename: 'Equipment',
              },
              {
                name: 'AP 3',
                id: '3',
                locationId: '4',
                profileId: '6',
                inventoryId: 'ap-3',
                channel: [6, 149, 36],
                model: 'ap2220',
                alarmsCount: 0,
                profile: {
                  name: 'ApProfile-3-radios',
                  __typename: 'Profile',
                },
                status: {
                  protocol: {
                    details: {
                      reportedIpV4Addr: '192.168.1.174',
                      reportedMacAddr: '74:9c:e3:42:c9:6c',
                      manufacturer: 'KodaCloud Canada Inc.',
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  osPerformance: {
                    details: {
                      uptimeInSeconds: 9877,
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  radioUtilization: {
                    details: {
                      reportedIpV4Addr: null,
                      capacityDetails: [71, 43, 8],
                      noiseFloorDetails: [-55, -51, -62],
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  clientDetails: {
                    details: null,
                    __typename: 'Status',
                  },
                  __typename: 'EquipmentStatus',
                },
                __typename: 'Equipment',
              },
              {
                name: 'AP 4',
                id: '4',
                locationId: '4',
                profileId: '6',
                inventoryId: 'ap-4',
                channel: [6, 149, 36],
                model: 'ea8300',
                alarmsCount: 0,
                profile: {
                  name: 'ApProfile-3-radios',
                  __typename: 'Profile',
                },
                status: {
                  protocol: {
                    details: {
                      reportedIpV4Addr: '192.168.1.127',
                      reportedMacAddr: '74:9c:e3:92:c6:3c',
                      manufacturer: 'KodaCloud Canada Inc.',
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  osPerformance: {
                    details: {
                      uptimeInSeconds: 8264,
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  radioUtilization: {
                    details: {
                      reportedIpV4Addr: null,
                      capacityDetails: [71, 18, 61],
                      noiseFloorDetails: [-53, -91, -68],
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  clientDetails: {
                    details: null,
                    __typename: 'Status',
                  },
                  __typename: 'EquipmentStatus',
                },
                __typename: 'Equipment',
              },
              {
                name: 'AP 5',
                id: '5',
                locationId: '4',
                profileId: '6',
                inventoryId: 'ap-5',
                channel: [6, 149, 36],
                model: 'ecw5211',
                alarmsCount: 0,
                profile: {
                  name: 'ApProfile-3-radios',
                  __typename: 'Profile',
                },
                status: {
                  protocol: {
                    details: {
                      reportedIpV4Addr: '192.168.1.73',
                      reportedMacAddr: '74:9c:e3:42:98:67',
                      manufacturer: 'KodaCloud Canada Inc.',
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  osPerformance: {
                    details: {
                      uptimeInSeconds: 401,
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  radioUtilization: {
                    details: {
                      reportedIpV4Addr: null,
                      capacityDetails: [26, 59, 34],
                      noiseFloorDetails: [-91, -41, -61],
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  clientDetails: {
                    details: null,
                    __typename: 'Status',
                  },
                  __typename: 'EquipmentStatus',
                },
                __typename: 'Equipment',
              },
              {
                name: 'AP 6',
                id: '6',
                locationId: '4',
                profileId: '6',
                inventoryId: 'ap-6',
                channel: [6, 149, 36],
                model: 'ecw5410',
                alarmsCount: 0,
                profile: {
                  name: 'ApProfile-3-radios',
                  __typename: 'Profile',
                },
                status: {
                  protocol: {
                    details: {
                      reportedIpV4Addr: '192.168.1.40',
                      reportedMacAddr: '74:9c:e3:29:1f:1b',
                      manufacturer: 'KodaCloud Canada Inc.',
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  osPerformance: {
                    details: {
                      uptimeInSeconds: 1173,
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  radioUtilization: {
                    details: {
                      reportedIpV4Addr: null,
                      capacityDetails: [48, 18, 54],
                      noiseFloorDetails: [-54, -64, -58],
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  clientDetails: {
                    details: null,
                    __typename: 'Status',
                  },
                  __typename: 'EquipmentStatus',
                },
                __typename: 'Equipment',
              },
              {
                name: 'AP 7',
                id: '7',
                locationId: '4',
                profileId: '6',
                inventoryId: 'ap-7',
                channel: [6, 149, 36],
                model: 'ap2220',
                alarmsCount: 1,
                profile: {
                  name: 'ApProfile-3-radios',
                  __typename: 'Profile',
                },
                status: {
                  protocol: {
                    details: {
                      reportedIpV4Addr: '192.168.1.5',
                      reportedMacAddr: '74:9c:e3:85:42:0f',
                      manufacturer: 'KodaCloud Canada Inc.',
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  osPerformance: {
                    details: {
                      uptimeInSeconds: 5352,
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  radioUtilization: {
                    details: {
                      reportedIpV4Addr: null,
                      capacityDetails: [14, 6, 37],
                      noiseFloorDetails: [-52, -59, -50],
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  clientDetails: {
                    details: null,
                    __typename: 'Status',
                  },
                  __typename: 'EquipmentStatus',
                },
                __typename: 'Equipment',
              },
              {
                name: 'AP 8',
                id: '8',
                locationId: '4',
                profileId: '6',
                inventoryId: 'ap-8',
                channel: [6, 149, 36],
                model: 'ea8300',
                alarmsCount: 0,
                profile: {
                  name: 'ApProfile-3-radios',
                  __typename: 'Profile',
                },
                status: {
                  protocol: {
                    details: {
                      reportedIpV4Addr: '192.168.1.174',
                      reportedMacAddr: '74:9c:e3:af:70:29',
                      manufacturer: 'KodaCloud Canada Inc.',
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  osPerformance: {
                    details: {
                      uptimeInSeconds: 276,
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  radioUtilization: {
                    details: {
                      reportedIpV4Addr: null,
                      capacityDetails: [46, 31, 54],
                      noiseFloorDetails: [-85, -85, -79],
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  clientDetails: {
                    details: null,
                    __typename: 'Status',
                  },
                  __typename: 'EquipmentStatus',
                },
                __typename: 'Equipment',
              },
              {
                name: 'AP 9',
                id: '9',
                locationId: '4',
                profileId: '6',
                inventoryId: 'ap-9',
                channel: [6, 149, 36],
                model: 'ecw5211',
                alarmsCount: 0,
                profile: {
                  name: 'ApProfile-3-radios',
                  __typename: 'Profile',
                },
                status: {
                  protocol: {
                    details: {
                      reportedIpV4Addr: '192.168.1.36',
                      reportedMacAddr: '74:9c:e3:5e:78:c6',
                      manufacturer: 'KodaCloud Canada Inc.',
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  osPerformance: {
                    details: {
                      uptimeInSeconds: 4501,
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  radioUtilization: {
                    details: {
                      reportedIpV4Addr: null,
                      capacityDetails: [34, 43, 11],
                      noiseFloorDetails: [-59, -84, -79],
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  clientDetails: {
                    details: null,
                    __typename: 'Status',
                  },
                  __typename: 'EquipmentStatus',
                },
                __typename: 'Equipment',
              },
              {
                name: 'AP 10',
                id: '10',
                locationId: '4',
                profileId: '6',
                inventoryId: 'ap-10',
                channel: [6, 149, 36],
                model: 'ecw5410',
                alarmsCount: 0,
                profile: {
                  name: 'ApProfile-3-radios',
                  __typename: 'Profile',
                },
                status: {
                  protocol: {
                    details: {
                      reportedIpV4Addr: '192.168.1.177',
                      reportedMacAddr: '74:9c:e3:3a:52:c0',
                      manufacturer: 'KodaCloud Canada Inc.',
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  osPerformance: {
                    details: {
                      uptimeInSeconds: 1448,
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  radioUtilization: {
                    details: {
                      reportedIpV4Addr: null,
                      capacityDetails: [53, 49, 31],
                      noiseFloorDetails: [-75, -51, -56],
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  clientDetails: {
                    details: null,
                    __typename: 'Status',
                  },
                  __typename: 'EquipmentStatus',
                },
                __typename: 'Equipment',
              },
              {
                name: 'AP 11',
                id: '11',
                locationId: '4',
                profileId: '6',
                inventoryId: 'ap-11',
                channel: [6, 149, 36],
                model: 'ap2220',
                alarmsCount: 0,
                profile: {
                  name: 'ApProfile-3-radios',
                  __typename: 'Profile',
                },
                status: {
                  protocol: {
                    details: {
                      reportedIpV4Addr: '192.168.1.198',
                      reportedMacAddr: '74:9c:e3:a8:10:51',
                      manufacturer: 'KodaCloud Canada Inc.',
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  osPerformance: {
                    details: {
                      uptimeInSeconds: 9272,
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  radioUtilization: {
                    details: {
                      reportedIpV4Addr: null,
                      capacityDetails: [10, 42, 44],
                      noiseFloorDetails: [-63, -85, -81],
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  clientDetails: {
                    details: null,
                    __typename: 'Status',
                  },
                  __typename: 'EquipmentStatus',
                },
                __typename: 'Equipment',
              },
              {
                name: 'AP 12',
                id: '12',
                locationId: '4',
                profileId: '6',
                inventoryId: 'ap-12',
                channel: [6, 149, 36],
                model: 'ea8300',
                alarmsCount: 0,
                profile: {
                  name: 'ApProfile-3-radios',
                  __typename: 'Profile',
                },
                status: {
                  protocol: {
                    details: {
                      reportedIpV4Addr: '192.168.1.126',
                      reportedMacAddr: '74:9c:e3:57:3b:ce',
                      manufacturer: 'KodaCloud Canada Inc.',
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  osPerformance: {
                    details: {
                      uptimeInSeconds: 7217,
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  radioUtilization: {
                    details: {
                      reportedIpV4Addr: null,
                      capacityDetails: [66, 46, 51],
                      noiseFloorDetails: [-90, -94, -52],
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  clientDetails: {
                    details: null,
                    __typename: 'Status',
                  },
                  __typename: 'EquipmentStatus',
                },
                __typename: 'Equipment',
              },
              {
                name: 'AP 13',
                id: '13',
                locationId: '5',
                profileId: '6',
                inventoryId: 'ap-13',
                channel: [6, 149, 36],
                model: 'ecw5211',
                alarmsCount: 0,
                profile: {
                  name: 'ApProfile-3-radios',
                  __typename: 'Profile',
                },
                status: {
                  protocol: {
                    details: {
                      reportedIpV4Addr: '192.168.1.212',
                      reportedMacAddr: '74:9c:e3:a3:79:27',
                      manufacturer: 'KodaCloud Canada Inc.',
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  osPerformance: {
                    details: {
                      uptimeInSeconds: 1850,
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  radioUtilization: {
                    details: {
                      reportedIpV4Addr: null,
                      capacityDetails: [28, 11, 51],
                      noiseFloorDetails: [-86, -69, -78],
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  clientDetails: {
                    details: null,
                    __typename: 'Status',
                  },
                  __typename: 'EquipmentStatus',
                },
                __typename: 'Equipment',
              },
              {
                name: 'AP 14',
                id: '14',
                locationId: '5',
                profileId: '6',
                inventoryId: 'ap-14',
                channel: [6, 149, 36],
                model: 'ecw5410',
                alarmsCount: 1,
                profile: {
                  name: 'ApProfile-3-radios',
                  __typename: 'Profile',
                },
                status: {
                  protocol: {
                    details: {
                      reportedIpV4Addr: '192.168.1.58',
                      reportedMacAddr: '74:9c:e3:4e:77:bf',
                      manufacturer: 'KodaCloud Canada Inc.',
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  osPerformance: {
                    details: {
                      uptimeInSeconds: 5632,
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  radioUtilization: {
                    details: {
                      reportedIpV4Addr: null,
                      capacityDetails: [61, 75, 18],
                      noiseFloorDetails: [-91, -81, -60],
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  clientDetails: {
                    details: null,
                    __typename: 'Status',
                  },
                  __typename: 'EquipmentStatus',
                },
                __typename: 'Equipment',
              },
              {
                name: 'AP 15',
                id: '15',
                locationId: '5',
                profileId: '6',
                inventoryId: 'ap-15',
                channel: [6, 149, 36],
                model: 'ap2220',
                alarmsCount: 0,
                profile: {
                  name: 'ApProfile-3-radios',
                  __typename: 'Profile',
                },
                status: {
                  protocol: {
                    details: {
                      reportedIpV4Addr: '192.168.1.184',
                      reportedMacAddr: '74:9c:e3:ad:70:e0',
                      manufacturer: 'KodaCloud Canada Inc.',
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  osPerformance: {
                    details: {
                      uptimeInSeconds: 2093,
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  radioUtilization: {
                    details: {
                      reportedIpV4Addr: null,
                      capacityDetails: [30, 8, 21],
                      noiseFloorDetails: [-78, -86, -87],
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  clientDetails: {
                    details: null,
                    __typename: 'Status',
                  },
                  __typename: 'EquipmentStatus',
                },
                __typename: 'Equipment',
              },
              {
                name: 'AP 16',
                id: '16',
                locationId: '6',
                profileId: '6',
                inventoryId: 'ap-16',
                channel: [6, 149, 36],
                model: 'ea8300',
                alarmsCount: 0,
                profile: {
                  name: 'ApProfile-3-radios',
                  __typename: 'Profile',
                },
                status: {
                  protocol: {
                    details: {
                      reportedIpV4Addr: '192.168.1.193',
                      reportedMacAddr: '74:9c:e3:66:b2:7e',
                      manufacturer: 'KodaCloud Canada Inc.',
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  osPerformance: {
                    details: {
                      uptimeInSeconds: 4397,
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  radioUtilization: {
                    details: {
                      reportedIpV4Addr: null,
                      capacityDetails: [31, 48, 28],
                      noiseFloorDetails: [-78, -61, -86],
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  clientDetails: {
                    details: null,
                    __typename: 'Status',
                  },
                  __typename: 'EquipmentStatus',
                },
                __typename: 'Equipment',
              },
              {
                name: 'AP 17',
                id: '17',
                locationId: '6',
                profileId: '6',
                inventoryId: 'ap-17',
                channel: [6, 149, 36],
                model: 'ecw5211',
                alarmsCount: 0,
                profile: {
                  name: 'ApProfile-3-radios',
                  __typename: 'Profile',
                },
                status: {
                  protocol: {
                    details: {
                      reportedIpV4Addr: '192.168.1.168',
                      reportedMacAddr: '74:9c:e3:15:4a:07',
                      manufacturer: 'KodaCloud Canada Inc.',
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  osPerformance: {
                    details: {
                      uptimeInSeconds: 4552,
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  radioUtilization: {
                    details: {
                      reportedIpV4Addr: null,
                      capacityDetails: [41, 74, 8],
                      noiseFloorDetails: [-90, -69, -54],
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  clientDetails: {
                    details: null,
                    __typename: 'Status',
                  },
                  __typename: 'EquipmentStatus',
                },
                __typename: 'Equipment',
              },
              {
                name: 'AP 18',
                id: '18',
                locationId: '6',
                profileId: '6',
                inventoryId: 'ap-18',
                channel: [6, 149, 36],
                model: 'ecw5410',
                alarmsCount: 0,
                profile: {
                  name: 'ApProfile-3-radios',
                  __typename: 'Profile',
                },
                status: {
                  protocol: {
                    details: {
                      reportedIpV4Addr: '192.168.1.39',
                      reportedMacAddr: '74:9c:e3:9c:a0:89',
                      manufacturer: 'KodaCloud Canada Inc.',
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  osPerformance: {
                    details: {
                      uptimeInSeconds: 4268,
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  radioUtilization: {
                    details: {
                      reportedIpV4Addr: null,
                      capacityDetails: [32, 18, 31],
                      noiseFloorDetails: [-70, -65, -62],
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  clientDetails: {
                    details: null,
                    __typename: 'Status',
                  },
                  __typename: 'EquipmentStatus',
                },
                __typename: 'Equipment',
              },
              {
                name: 'AP 19',
                id: '19',
                locationId: '6',
                profileId: '6',
                inventoryId: 'ap-19',
                channel: [6, 149, 36],
                model: 'ap2220',
                alarmsCount: 0,
                profile: {
                  name: 'ApProfile-3-radios',
                  __typename: 'Profile',
                },
                status: {
                  protocol: {
                    details: {
                      reportedIpV4Addr: '192.168.1.9',
                      reportedMacAddr: '74:9c:e3:d1:7f:06',
                      manufacturer: 'KodaCloud Canada Inc.',
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  osPerformance: {
                    details: {
                      uptimeInSeconds: 8109,
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  radioUtilization: {
                    details: {
                      reportedIpV4Addr: null,
                      capacityDetails: [12, 44, 50],
                      noiseFloorDetails: [-51, -89, -53],
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  clientDetails: {
                    details: null,
                    __typename: 'Status',
                  },
                  __typename: 'EquipmentStatus',
                },
                __typename: 'Equipment',
              },
              {
                name: 'AP 20',
                id: '20',
                locationId: '6',
                profileId: '6',
                inventoryId: 'ap-20',
                channel: [6, 149, 36],
                model: 'ea8300',
                alarmsCount: 0,
                profile: {
                  name: 'ApProfile-3-radios',
                  __typename: 'Profile',
                },
                status: {
                  protocol: {
                    details: {
                      reportedIpV4Addr: '192.168.1.185',
                      reportedMacAddr: '74:9c:e3:a1:8e:1c',
                      manufacturer: 'KodaCloud Canada Inc.',
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  osPerformance: {
                    details: {
                      uptimeInSeconds: 4209,
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  radioUtilization: {
                    details: {
                      reportedIpV4Addr: null,
                      capacityDetails: [62, 45, 81],
                      noiseFloorDetails: [-78, -84, -58],
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  clientDetails: {
                    details: null,
                    __typename: 'Status',
                  },
                  __typename: 'EquipmentStatus',
                },
                __typename: 'Equipment',
              },
            ],
            context: {
              lastPage: false,
              cursor: 'test',
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
        query: FILTER_EQUIPMENT,
        variables: {
          customerId: 2,
          locationIds: ['2', '3', '4', '5', '6', '7', '8'],
          equipmentType: 'AP',
          cursor: 'test',
        },
      },
      result: {
        data: {
          filterEquipment: {
            items: [
              {
                name: 'AP 1',
                id: '1',
                locationId: '4',
                profileId: '6',
                inventoryId: 'ap-1',
                channel: [6, 149, 36],
                model: 'ecw5211',
                alarmsCount: 0,
                profile: {
                  name: 'ApProfile-3-radios',
                  __typename: 'Profile',
                },
                status: {
                  protocol: {
                    details: {
                      reportedIpV4Addr: '192.168.1.124',
                      reportedMacAddr: '74:9c:e3:10:aa:8a',
                      manufacturer: 'KodaCloud Canada Inc.',
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  osPerformance: {
                    details: {
                      uptimeInSeconds: 2423,
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  radioUtilization: {
                    details: {
                      reportedIpV4Addr: null,
                      capacityDetails: [68, 56, 27],
                      noiseFloorDetails: [-62, -82, -80],
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  clientDetails: {
                    details: null,
                    __typename: 'Status',
                  },
                  __typename: 'EquipmentStatus',
                },
                __typename: 'Equipment',
              },
              {
                name: 'AP 2',
                id: '2',
                locationId: '4',
                profileId: '6',
                inventoryId: 'ap-2',
                channel: [6, 149, 36],
                model: 'ecw5410',
                alarmsCount: 0,
                profile: {
                  name: 'ApProfile-3-radios',
                  __typename: 'Profile',
                },
                status: {
                  protocol: {
                    details: {
                      reportedIpV4Addr: '192.168.1.19',
                      reportedMacAddr: '74:9c:e3:b0:58:94',
                      manufacturer: 'KodaCloud Canada Inc.',
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  osPerformance: {
                    details: {
                      uptimeInSeconds: 6563,
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  radioUtilization: {
                    details: {
                      reportedIpV4Addr: null,
                      capacityDetails: [75, 19, 50],
                      noiseFloorDetails: [-90, -77, -45],
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  clientDetails: {
                    details: null,
                    __typename: 'Status',
                  },
                  __typename: 'EquipmentStatus',
                },
                __typename: 'Equipment',
              },
              {
                name: 'AP 3',
                id: '3',
                locationId: '4',
                profileId: '6',
                inventoryId: 'ap-3',
                channel: [6, 149, 36],
                model: 'ap2220',
                alarmsCount: 0,
                profile: {
                  name: 'ApProfile-3-radios',
                  __typename: 'Profile',
                },
                status: {
                  protocol: {
                    details: {
                      reportedIpV4Addr: '192.168.1.174',
                      reportedMacAddr: '74:9c:e3:42:c9:6c',
                      manufacturer: 'KodaCloud Canada Inc.',
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  osPerformance: {
                    details: {
                      uptimeInSeconds: 9877,
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  radioUtilization: {
                    details: {
                      reportedIpV4Addr: null,
                      capacityDetails: [71, 43, 8],
                      noiseFloorDetails: [-55, -51, -62],
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  clientDetails: {
                    details: null,
                    __typename: 'Status',
                  },
                  __typename: 'EquipmentStatus',
                },
                __typename: 'Equipment',
              },
              {
                name: 'AP 4',
                id: '4',
                locationId: '4',
                profileId: '6',
                inventoryId: 'ap-4',
                channel: [6, 149, 36],
                model: 'ea8300',
                alarmsCount: 0,
                profile: {
                  name: 'ApProfile-3-radios',
                  __typename: 'Profile',
                },
                status: {
                  protocol: {
                    details: {
                      reportedIpV4Addr: '192.168.1.127',
                      reportedMacAddr: '74:9c:e3:92:c6:3c',
                      manufacturer: 'KodaCloud Canada Inc.',
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  osPerformance: {
                    details: {
                      uptimeInSeconds: 8264,
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  radioUtilization: {
                    details: {
                      reportedIpV4Addr: null,
                      capacityDetails: [71, 18, 61],
                      noiseFloorDetails: [-53, -91, -68],
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  clientDetails: {
                    details: null,
                    __typename: 'Status',
                  },
                  __typename: 'EquipmentStatus',
                },
                __typename: 'Equipment',
              },
              {
                name: 'AP 5',
                id: '5',
                locationId: '4',
                profileId: '6',
                inventoryId: 'ap-5',
                channel: [6, 149, 36],
                model: 'ecw5211',
                alarmsCount: 0,
                profile: {
                  name: 'ApProfile-3-radios',
                  __typename: 'Profile',
                },
                status: {
                  protocol: {
                    details: {
                      reportedIpV4Addr: '192.168.1.73',
                      reportedMacAddr: '74:9c:e3:42:98:67',
                      manufacturer: 'KodaCloud Canada Inc.',
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  osPerformance: {
                    details: {
                      uptimeInSeconds: 401,
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  radioUtilization: {
                    details: {
                      reportedIpV4Addr: null,
                      capacityDetails: [26, 59, 34],
                      noiseFloorDetails: [-91, -41, -61],
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  clientDetails: {
                    details: null,
                    __typename: 'Status',
                  },
                  __typename: 'EquipmentStatus',
                },
                __typename: 'Equipment',
              },
              {
                name: 'AP 6',
                id: '6',
                locationId: '4',
                profileId: '6',
                inventoryId: 'ap-6',
                channel: [6, 149, 36],
                model: 'ecw5410',
                alarmsCount: 0,
                profile: {
                  name: 'ApProfile-3-radios',
                  __typename: 'Profile',
                },
                status: {
                  protocol: {
                    details: {
                      reportedIpV4Addr: '192.168.1.40',
                      reportedMacAddr: '74:9c:e3:29:1f:1b',
                      manufacturer: 'KodaCloud Canada Inc.',
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  osPerformance: {
                    details: {
                      uptimeInSeconds: 1173,
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  radioUtilization: {
                    details: {
                      reportedIpV4Addr: null,
                      capacityDetails: [48, 18, 54],
                      noiseFloorDetails: [-54, -64, -58],
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  clientDetails: {
                    details: null,
                    __typename: 'Status',
                  },
                  __typename: 'EquipmentStatus',
                },
                __typename: 'Equipment',
              },
              {
                name: 'AP 7',
                id: '7',
                locationId: '4',
                profileId: '6',
                inventoryId: 'ap-7',
                channel: [6, 149, 36],
                model: 'ap2220',
                alarmsCount: 1,
                profile: {
                  name: 'ApProfile-3-radios',
                  __typename: 'Profile',
                },
                status: {
                  protocol: {
                    details: {
                      reportedIpV4Addr: '192.168.1.5',
                      reportedMacAddr: '74:9c:e3:85:42:0f',
                      manufacturer: 'KodaCloud Canada Inc.',
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  osPerformance: {
                    details: {
                      uptimeInSeconds: 5352,
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  radioUtilization: {
                    details: {
                      reportedIpV4Addr: null,
                      capacityDetails: [14, 6, 37],
                      noiseFloorDetails: [-52, -59, -50],
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  clientDetails: {
                    details: null,
                    __typename: 'Status',
                  },
                  __typename: 'EquipmentStatus',
                },
                __typename: 'Equipment',
              },
              {
                name: 'AP 8',
                id: '8',
                locationId: '4',
                profileId: '6',
                inventoryId: 'ap-8',
                channel: [6, 149, 36],
                model: 'ea8300',
                alarmsCount: 0,
                profile: {
                  name: 'ApProfile-3-radios',
                  __typename: 'Profile',
                },
                status: {
                  protocol: {
                    details: {
                      reportedIpV4Addr: '192.168.1.174',
                      reportedMacAddr: '74:9c:e3:af:70:29',
                      manufacturer: 'KodaCloud Canada Inc.',
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  osPerformance: {
                    details: {
                      uptimeInSeconds: 276,
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  radioUtilization: {
                    details: {
                      reportedIpV4Addr: null,
                      capacityDetails: [46, 31, 54],
                      noiseFloorDetails: [-85, -85, -79],
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  clientDetails: {
                    details: null,
                    __typename: 'Status',
                  },
                  __typename: 'EquipmentStatus',
                },
                __typename: 'Equipment',
              },
              {
                name: 'AP 9',
                id: '9',
                locationId: '4',
                profileId: '6',
                inventoryId: 'ap-9',
                channel: [6, 149, 36],
                model: 'ecw5211',
                alarmsCount: 0,
                profile: {
                  name: 'ApProfile-3-radios',
                  __typename: 'Profile',
                },
                status: {
                  protocol: {
                    details: {
                      reportedIpV4Addr: '192.168.1.36',
                      reportedMacAddr: '74:9c:e3:5e:78:c6',
                      manufacturer: 'KodaCloud Canada Inc.',
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  osPerformance: {
                    details: {
                      uptimeInSeconds: 4501,
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  radioUtilization: {
                    details: {
                      reportedIpV4Addr: null,
                      capacityDetails: [34, 43, 11],
                      noiseFloorDetails: [-59, -84, -79],
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  clientDetails: {
                    details: null,
                    __typename: 'Status',
                  },
                  __typename: 'EquipmentStatus',
                },
                __typename: 'Equipment',
              },
              {
                name: 'AP 10',
                id: '10',
                locationId: '4',
                profileId: '6',
                inventoryId: 'ap-10',
                channel: [6, 149, 36],
                model: 'ecw5410',
                alarmsCount: 0,
                profile: {
                  name: 'ApProfile-3-radios',
                  __typename: 'Profile',
                },
                status: {
                  protocol: {
                    details: {
                      reportedIpV4Addr: '192.168.1.177',
                      reportedMacAddr: '74:9c:e3:3a:52:c0',
                      manufacturer: 'KodaCloud Canada Inc.',
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  osPerformance: {
                    details: {
                      uptimeInSeconds: 1448,
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  radioUtilization: {
                    details: {
                      reportedIpV4Addr: null,
                      capacityDetails: [53, 49, 31],
                      noiseFloorDetails: [-75, -51, -56],
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  clientDetails: {
                    details: null,
                    __typename: 'Status',
                  },
                  __typename: 'EquipmentStatus',
                },
                __typename: 'Equipment',
              },
              {
                name: 'AP 11',
                id: '11',
                locationId: '4',
                profileId: '6',
                inventoryId: 'ap-11',
                channel: [6, 149, 36],
                model: 'ap2220',
                alarmsCount: 0,
                profile: {
                  name: 'ApProfile-3-radios',
                  __typename: 'Profile',
                },
                status: {
                  protocol: {
                    details: {
                      reportedIpV4Addr: '192.168.1.198',
                      reportedMacAddr: '74:9c:e3:a8:10:51',
                      manufacturer: 'KodaCloud Canada Inc.',
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  osPerformance: {
                    details: {
                      uptimeInSeconds: 9272,
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  radioUtilization: {
                    details: {
                      reportedIpV4Addr: null,
                      capacityDetails: [10, 42, 44],
                      noiseFloorDetails: [-63, -85, -81],
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  clientDetails: {
                    details: null,
                    __typename: 'Status',
                  },
                  __typename: 'EquipmentStatus',
                },
                __typename: 'Equipment',
              },
              {
                name: 'AP 12',
                id: '12',
                locationId: '4',
                profileId: '6',
                inventoryId: 'ap-12',
                channel: [6, 149, 36],
                model: 'ea8300',
                alarmsCount: 0,
                profile: {
                  name: 'ApProfile-3-radios',
                  __typename: 'Profile',
                },
                status: {
                  protocol: {
                    details: {
                      reportedIpV4Addr: '192.168.1.126',
                      reportedMacAddr: '74:9c:e3:57:3b:ce',
                      manufacturer: 'KodaCloud Canada Inc.',
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  osPerformance: {
                    details: {
                      uptimeInSeconds: 7217,
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  radioUtilization: {
                    details: {
                      reportedIpV4Addr: null,
                      capacityDetails: [66, 46, 51],
                      noiseFloorDetails: [-90, -94, -52],
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  clientDetails: {
                    details: null,
                    __typename: 'Status',
                  },
                  __typename: 'EquipmentStatus',
                },
                __typename: 'Equipment',
              },
              {
                name: 'AP 13',
                id: '13',
                locationId: '5',
                profileId: '6',
                inventoryId: 'ap-13',
                channel: [6, 149, 36],
                model: 'ecw5211',
                alarmsCount: 0,
                profile: {
                  name: 'ApProfile-3-radios',
                  __typename: 'Profile',
                },
                status: {
                  protocol: {
                    details: {
                      reportedIpV4Addr: '192.168.1.212',
                      reportedMacAddr: '74:9c:e3:a3:79:27',
                      manufacturer: 'KodaCloud Canada Inc.',
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  osPerformance: {
                    details: {
                      uptimeInSeconds: 1850,
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  radioUtilization: {
                    details: {
                      reportedIpV4Addr: null,
                      capacityDetails: [28, 11, 51],
                      noiseFloorDetails: [-86, -69, -78],
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  clientDetails: {
                    details: null,
                    __typename: 'Status',
                  },
                  __typename: 'EquipmentStatus',
                },
                __typename: 'Equipment',
              },
              {
                name: 'AP 14',
                id: '14',
                locationId: '5',
                profileId: '6',
                inventoryId: 'ap-14',
                channel: [6, 149, 36],
                model: 'ecw5410',
                alarmsCount: 1,
                profile: {
                  name: 'ApProfile-3-radios',
                  __typename: 'Profile',
                },
                status: {
                  protocol: {
                    details: {
                      reportedIpV4Addr: '192.168.1.58',
                      reportedMacAddr: '74:9c:e3:4e:77:bf',
                      manufacturer: 'KodaCloud Canada Inc.',
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  osPerformance: {
                    details: {
                      uptimeInSeconds: 5632,
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  radioUtilization: {
                    details: {
                      reportedIpV4Addr: null,
                      capacityDetails: [61, 75, 18],
                      noiseFloorDetails: [-91, -81, -60],
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  clientDetails: {
                    details: null,
                    __typename: 'Status',
                  },
                  __typename: 'EquipmentStatus',
                },
                __typename: 'Equipment',
              },
              {
                name: 'AP 15',
                id: '15',
                locationId: '5',
                profileId: '6',
                inventoryId: 'ap-15',
                channel: [6, 149, 36],
                model: 'ap2220',
                alarmsCount: 0,
                profile: {
                  name: 'ApProfile-3-radios',
                  __typename: 'Profile',
                },
                status: {
                  protocol: {
                    details: {
                      reportedIpV4Addr: '192.168.1.184',
                      reportedMacAddr: '74:9c:e3:ad:70:e0',
                      manufacturer: 'KodaCloud Canada Inc.',
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  osPerformance: {
                    details: {
                      uptimeInSeconds: 2093,
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  radioUtilization: {
                    details: {
                      reportedIpV4Addr: null,
                      capacityDetails: [30, 8, 21],
                      noiseFloorDetails: [-78, -86, -87],
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  clientDetails: {
                    details: null,
                    __typename: 'Status',
                  },
                  __typename: 'EquipmentStatus',
                },
                __typename: 'Equipment',
              },
              {
                name: 'AP 16',
                id: '16',
                locationId: '6',
                profileId: '6',
                inventoryId: 'ap-16',
                channel: [6, 149, 36],
                model: 'ea8300',
                alarmsCount: 0,
                profile: {
                  name: 'ApProfile-3-radios',
                  __typename: 'Profile',
                },
                status: {
                  protocol: {
                    details: {
                      reportedIpV4Addr: '192.168.1.193',
                      reportedMacAddr: '74:9c:e3:66:b2:7e',
                      manufacturer: 'KodaCloud Canada Inc.',
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  osPerformance: {
                    details: {
                      uptimeInSeconds: 4397,
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  radioUtilization: {
                    details: {
                      reportedIpV4Addr: null,
                      capacityDetails: [31, 48, 28],
                      noiseFloorDetails: [-78, -61, -86],
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  clientDetails: {
                    details: null,
                    __typename: 'Status',
                  },
                  __typename: 'EquipmentStatus',
                },
                __typename: 'Equipment',
              },
              {
                name: 'AP 17',
                id: '17',
                locationId: '6',
                profileId: '6',
                inventoryId: 'ap-17',
                channel: [6, 149, 36],
                model: 'ecw5211',
                alarmsCount: 0,
                profile: {
                  name: 'ApProfile-3-radios',
                  __typename: 'Profile',
                },
                status: {
                  protocol: {
                    details: {
                      reportedIpV4Addr: '192.168.1.168',
                      reportedMacAddr: '74:9c:e3:15:4a:07',
                      manufacturer: 'KodaCloud Canada Inc.',
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  osPerformance: {
                    details: {
                      uptimeInSeconds: 4552,
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  radioUtilization: {
                    details: {
                      reportedIpV4Addr: null,
                      capacityDetails: [41, 74, 8],
                      noiseFloorDetails: [-90, -69, -54],
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  clientDetails: {
                    details: null,
                    __typename: 'Status',
                  },
                  __typename: 'EquipmentStatus',
                },
                __typename: 'Equipment',
              },
              {
                name: 'AP 18',
                id: '18',
                locationId: '6',
                profileId: '6',
                inventoryId: 'ap-18',
                channel: [6, 149, 36],
                model: 'ecw5410',
                alarmsCount: 0,
                profile: {
                  name: 'ApProfile-3-radios',
                  __typename: 'Profile',
                },
                status: {
                  protocol: {
                    details: {
                      reportedIpV4Addr: '192.168.1.39',
                      reportedMacAddr: '74:9c:e3:9c:a0:89',
                      manufacturer: 'KodaCloud Canada Inc.',
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  osPerformance: {
                    details: {
                      uptimeInSeconds: 4268,
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  radioUtilization: {
                    details: {
                      reportedIpV4Addr: null,
                      capacityDetails: [32, 18, 31],
                      noiseFloorDetails: [-70, -65, -62],
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  clientDetails: {
                    details: null,
                    __typename: 'Status',
                  },
                  __typename: 'EquipmentStatus',
                },
                __typename: 'Equipment',
              },
              {
                name: 'AP 19',
                id: '19',
                locationId: '6',
                profileId: '6',
                inventoryId: 'ap-19',
                channel: [6, 149, 36],
                model: 'ap2220',
                alarmsCount: 0,
                profile: {
                  name: 'ApProfile-3-radios',
                  __typename: 'Profile',
                },
                status: {
                  protocol: {
                    details: {
                      reportedIpV4Addr: '192.168.1.9',
                      reportedMacAddr: '74:9c:e3:d1:7f:06',
                      manufacturer: 'KodaCloud Canada Inc.',
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  osPerformance: {
                    details: {
                      uptimeInSeconds: 8109,
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  radioUtilization: {
                    details: {
                      reportedIpV4Addr: null,
                      capacityDetails: [12, 44, 50],
                      noiseFloorDetails: [-51, -89, -53],
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  clientDetails: {
                    details: null,
                    __typename: 'Status',
                  },
                  __typename: 'EquipmentStatus',
                },
                __typename: 'Equipment',
              },
              {
                name: 'AP 20',
                id: '20',
                locationId: '6',
                profileId: '6',
                inventoryId: 'ap-20',
                channel: [6, 149, 36],
                model: 'ea8300',
                alarmsCount: 0,
                profile: {
                  name: 'ApProfile-3-radios',
                  __typename: 'Profile',
                },
                status: {
                  protocol: {
                    details: {
                      reportedIpV4Addr: '192.168.1.185',
                      reportedMacAddr: '74:9c:e3:a1:8e:1c',
                      manufacturer: 'KodaCloud Canada Inc.',
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  osPerformance: {
                    details: {
                      uptimeInSeconds: 4209,
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  radioUtilization: {
                    details: {
                      reportedIpV4Addr: null,
                      capacityDetails: [62, 45, 81],
                      noiseFloorDetails: [-78, -84, -58],
                      __typename: 'StatusDetails',
                    },
                    __typename: 'Status',
                  },
                  clientDetails: {
                    details: null,
                    __typename: 'Status',
                  },
                  __typename: 'EquipmentStatus',
                },
                __typename: 'Equipment',
              },
            ],
            context: {
              lastPage: false,
              cursor: 'test',
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
        query: FILTER_EQUIPMENT,
        variables: { customerId: 2 },
        errorPolicy: 'all',
      },
      result: {
        data: null,
        errors: [{}],
        loading: false,
        networkStatus: 7,
        stale: false,
      },
    },
  },
};
