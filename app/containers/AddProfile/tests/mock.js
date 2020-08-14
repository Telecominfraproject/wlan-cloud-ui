import { GET_ALL_PROFILES } from 'graphql/queries';
import { CREATE_PROFILE } from 'graphql/mutations';

export const getAllProfilesQueryMock = {
  success: {
    request: {
      query: GET_ALL_PROFILES,
      variables: { customerId: 2, type: 'ssid' },
    },
    result: {
      data: {
        getAllProfiles: {
          items: [
            {
              id: '1',
              name: 'Radius-Profile',
              profileType: 'radius',
              details: {
                model_type: 'RadiusProfile',
                subnetConfiguration: null,
                serviceRegionMap: {
                  Ottawa: {
                    model_type: 'RadiusServiceRegion',
                    serverMap: {
                      'Radius-Profile': [
                        {
                          model_type: 'RadiusServer',
                          ipAddress: '192.168.0.1',
                          secret: 'testing123',
                          authPort: 1812,
                          timeout: null,
                        },
                      ],
                    },
                    regionName: 'Ottawa',
                  },
                },
                profileType: 'radius',
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
  errpr: [],
};
export const addProfileMutationMock = {
  success: {
    request: {
      query: CREATE_PROFILE,
      variables: {
        profileType: 'equipment_ap',
        customerId: 2,
        name: 'test',
        childProfileIds: [],
        details: {
          profileType: 'equipment_ap',
          name: 'test',
          vlanNative: true,
          ntpServer: { auto: undefined },
          ledControlEnabled: undefined,
          rtlsSettings: { enabled: false },
          syslogRelay: { enabled: false },
          syntheticClientEnabled: false,
          equipmentDiscovery: false,
          childProfileIds: [],
          model_type: 'ApNetworkConfiguration',
        },
      },
    },
    result: {
      data: {
        createProfile: {
          profileType: 'equipment_ap',
          customerId: '2',
          name: 'test',
          childProfileIds: [],
          details: {
            model_type: 'ApNetworkConfiguration',
            networkConfigVersion: 'AP-1',
            equipmentType: 'AP',
            vlanNative: true,
            vlan: 0,
            ntpServer: {
              model_type: 'AutoOrManualString',
              auto: false,
              value: null,
            },
            syslogRelay: {
              model_type: 'SyslogRelay',
              enabled: false,
              srvHostIp: null,
              srvHostPort: 514,
              severity: 'NOTICE',
            },
            rtlsSettings: {
              model_type: 'RtlsSettings',
              enabled: false,
              srvHostIp: null,
              srvHostPort: 0,
            },
            syntheticClientEnabled: false,
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
      },
    },
  },
};
