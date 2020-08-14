import { GET_ALL_LOCATIONS, GET_ALL_PROFILES, GET_CUSTOMER } from 'graphql/queries';
import { UPDATE_CUSTOMER } from 'graphql/mutations';

export const autoProvisionQueryMock = {
  getAllProfilesSuccess: {
    request: {
      query: GET_ALL_PROFILES,
      variables: { customerId: 2, type: 'equipment_ap' },
    },
    result: {
      data: {
        getAllProfiles: {
          items: [
            {
              id: '6',
              name: 'ApProfile-3-radios',
              profileType: 'equipment_ap',
              details: {
                model_type: 'ApNetworkConfiguration',
                networkConfigVersion: 'AP-1',
                equipmentType: 'AP',
                vlanNative: true,
                vlan: 0,
                ntpServer: {
                  model_type: 'AutoOrManualString',
                  auto: true,
                  value: 'pool.ntp.org',
                },
                syslogRelay: null,
                rtlsSettings: null,
                syntheticClientEnabled: true,
                ledControlEnabled: true,
                equipmentDiscovery: false,
                radioMap: {
                  is2dot4GHz: {
                    model_type: 'RadioProfileConfiguration',
                    bestApEnabled: true,
                    bestAPSteerType: 'both',
                  },
                  is5GHzU: {
                    model_type: 'RadioProfileConfiguration',
                    bestApEnabled: true,
                    bestAPSteerType: 'both',
                  },
                  is5GHzL: {
                    model_type: 'RadioProfileConfiguration',
                    bestApEnabled: true,
                    bestAPSteerType: 'both',
                  },
                },
                profileType: 'equipment_ap',
              },
              __typename: 'Profile',
            },
            {
              id: '7',
              name: 'ApProfile-2-radios',
              profileType: 'equipment_ap',
              details: {
                model_type: 'ApNetworkConfiguration',
                networkConfigVersion: 'AP-1',
                equipmentType: 'AP',
                vlanNative: true,
                vlan: 0,
                ntpServer: {
                  model_type: 'AutoOrManualString',
                  auto: true,
                  value: 'pool.ntp.org',
                },
                syslogRelay: null,
                rtlsSettings: null,
                syntheticClientEnabled: true,
                ledControlEnabled: true,
                equipmentDiscovery: false,
                radioMap: {
                  is5GHz: {
                    model_type: 'RadioProfileConfiguration',
                    bestApEnabled: true,
                    bestAPSteerType: 'both',
                  },
                  is2dot4GHz: {
                    model_type: 'RadioProfileConfiguration',
                    bestApEnabled: true,
                    bestAPSteerType: 'both',
                  },
                },
                profileType: 'equipment_ap',
              },
              __typename: 'Profile',
            },
            {
              id: '8',
              name: 'EnterpriseApProfile',
              profileType: 'equipment_ap',
              details: {
                model_type: 'ApNetworkConfiguration',
                networkConfigVersion: 'AP-1',
                equipmentType: 'AP',
                vlanNative: true,
                vlan: 0,
                ntpServer: {
                  model_type: 'AutoOrManualString',
                  auto: true,
                  value: 'pool.ntp.org',
                },
                syslogRelay: null,
                rtlsSettings: null,
                syntheticClientEnabled: true,
                ledControlEnabled: true,
                equipmentDiscovery: false,
                radioMap: {
                  is5GHz: {
                    model_type: 'RadioProfileConfiguration',
                    bestApEnabled: true,
                    bestAPSteerType: 'both',
                  },
                  is2dot4GHz: {
                    model_type: 'RadioProfileConfiguration',
                    bestApEnabled: true,
                    bestAPSteerType: 'both',
                  },
                  is5GHzU: {
                    model_type: 'RadioProfileConfiguration',
                    bestApEnabled: true,
                    bestAPSteerType: 'both',
                  },
                  is5GHzL: {
                    model_type: 'RadioProfileConfiguration',
                    bestApEnabled: true,
                    bestAPSteerType: 'both',
                  },
                },
                profileType: 'equipment_ap',
              },
              __typename: 'Profile',
            },
          ],
          context: {
            cursor:
              'bnVsbEBAQHsibW9kZWxfdHlwZSI6IkNvbnRleHRDaGlsZHJlbiIsImNoaWxkcmVuIjp7fX1AQEBudWxs',
            lastPage: true,
            __typename: 'PaginationContext',
          },
          __typename: 'ProfilePagination',
        },
      },
      loading: false,
      networkStatus: 7,
      stale: false,
    },
  },

  getCustomerSuccess: {
    request: {
      query: GET_CUSTOMER,
      variables: { id: 2 },
    },
    result: {
      data: {
        getCustomer: {
          id: '2',
          name: 'Test Customer',
          email: 'test@example.com',
          createdTimestamp: '1597329016138',
          lastModifiedTimestamp: '1597329017058',
          details: {
            model_type: 'CustomerDetails',
            autoProvisioning: {
              model_type: 'EquipmentAutoProvisioningSettings',
              enabled: true,
              locationId: 8,
              equipmentProfileIdPerModel: {
                default: 6,
                TIP_AP: 7,
                ECW5410: 7,
                ECW5211: 7,
                AP2220: 7,
                'EA8300-CA': 6,
                EA8300: 6,
              },
            },
          },
          __typename: 'Customer',
        },
      },
      loading: false,
      networkStatus: 7,
      stale: false,
    },
  },

  getAllLocationsSuccess: {
    request: {
      query: GET_ALL_LOCATIONS,
      variables: { customerId: 2 },
    },
    result: {
      data: {
        getAllLocations: [
          {
            id: '2',
            name: 'Menlo Park',
            parentId: '0',
            locationType: 'SITE',
            __typename: 'Location',
          },
          {
            id: '3',
            name: 'Building 1',
            parentId: '2',
            locationType: 'BUILDING',
            __typename: 'Location',
          },
          {
            id: '4',
            name: 'Floor 1',
            parentId: '3',
            locationType: 'FLOOR',
            __typename: 'Location',
          },
          {
            id: '5',
            name: 'Floor 2',
            parentId: '3',
            locationType: 'FLOOR',
            __typename: 'Location',
          },
          {
            id: '6',
            name: 'Floor 3',
            parentId: '3',
            locationType: 'FLOOR',
            __typename: 'Location',
          },
          {
            id: '7',
            name: 'Building 2',
            parentId: '2',
            locationType: 'BUILDING',
            __typename: 'Location',
          },
          {
            id: '8',
            name: 'Ottawa',
            parentId: '0',
            locationType: 'SITE',
            __typename: 'Location',
          },
        ],
      },
      loading: false,
      networkStatus: 7,
      stale: false,
    },
  },

  error: {
    request: {
      query: GET_CUSTOMER,
      variables: { id: 2 },
    },
    result: {
      data: null,
      errors: [{}],
    },
  },
};

export const autoProvisionMutationMock = {
  success: {
    request: {
      query: UPDATE_CUSTOMER,
      variables: {
        id: '2',
        email: 'test@example.com',
        name: 'Test Customer',
        details: {
          model_type: 'CustomerDetails',
          autoProvisioning: {
            model_type: 'EquipmentAutoProvisioningSettings',
            enabled: true,
            locationId: '8',
            equipmentProfileIdPerModel: {
              default: 6,
              TIP_AP: 7,
              ECW5410: 7,
              ECW5211: 7,
              AP2220: 7,
              'EA8300-CA': 6,
              EA8300: 6,
            },
          },
        },
        createdTimestamp: '1597329016138',
        lastModifiedTimestamp: '1597329017058',
      },
    },
    result: {
      data: {
        updateCustomer: {
          id: '2',
          email: 'test@example.com',
          name: 'Test Customer',
          details: {
            model_type: 'CustomerDetails',
            autoProvisioning: {
              model_type: 'EquipmentAutoProvisioningSettings',
              enabled: true,
              locationId: 8,
              equipmentProfileIdPerModel: {
                default: 6,
                TIP_AP: 7,
                ECW5410: 7,
                ECW5211: 7,
                AP2220: 7,
                'EA8300-CA': 6,
                EA8300: 6,
              },
            },
          },
          createdTimestamp: '1597329016138',
          lastModifiedTimestamp: '1597331154979',
          __typename: 'Customer',
        },
      },
    },
  },
  error: {
    request: {
      query: UPDATE_CUSTOMER,
      variables: {
        id: '2',
        email: 'test@example.com',
        name: 'Test Customer',
        details: {
          model_type: 'CustomerDetails',
          autoProvisioning: {
            model_type: 'EquipmentAutoProvisioningSettings',
            enabled: true,
            locationId: '8',
            equipmentProfileIdPerModel: {
              default: 6,
              TIP_AP: 7,
              ECW5410: 7,
              ECW5211: 7,
              AP2220: 7,
              'EA8300-CA': 6,
              EA8300: 6,
            },
          },
        },
        createdTimestamp: '1597329016138',
        lastModifiedTimestamp: '1597329017058',
      },
    },
    result: {
      data: null,
      errors: [{}],
    },
  },
};
