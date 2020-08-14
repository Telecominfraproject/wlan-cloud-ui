import { DELETE_PROFILE } from 'graphql/mutations';
import { GET_ALL_PROFILES } from '..';

export const profilesQueryMock = {
  success: {
    request: {
      query: GET_ALL_PROFILES,
      variables: { customerId: 2, limit: 100 },
    },
    result: {
      data: {
        getAllProfiles: {
          items: [
            {
              id: '123',
              name: 'Radius-Profile',
              profileType: 'radius',
              details: {
                model_type: 'RadiusProfile',
                subnetConfiguration: {
                  test: {
                    model_type: 'RadiusSubnetConfiguration',
                    subnetAddress: '0.0.0.0',
                    subnetCidrPrefix: 0,
                    subnetName: 'test',
                    proxyConfig: {
                      model_type: 'RadiusProxyConfiguration',
                      floatingIpAddress: null,
                      floatingIfCidrPrefix: null,
                      floatingIfGwAddress: null,
                      floatingIfVlan: null,
                      sharedSecret: null,
                    },
                    probeInterval: null,
                    serviceRegionName: 'Ottawa',
                  },
                },
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
      query: GET_ALL_PROFILES,
      variables: { customerId: 2, limit: 100, cursor: 'test' },
    },
    result: {
      data: {
        getAllProfiles: {
          items: [
            {
              id: '2',
              name: 'TipWlan-cloud-Enterprise',
              profileType: 'ssid',
              details: {
                model_type: 'SsidConfiguration',
                ssid: 'Default-SSID-1597238767760',
                appliedRadios: ['is5GHzU', 'is2dot4GHz', 'is5GHzL'],
                ssidAdminState: 'enabled',
                secureMode: 'wpaEAP',
                vlanId: 1,
                keyStr: 'testing123',
                broadcastSsid: 'enabled',
                keyRefresh: 0,
                noLocalSubnets: false,
                radiusServiceName: 'Radius-Profile',
                captivePortalId: null,
                bandwidthLimitDown: 0,
                bandwidthLimitUp: 0,
                videoTrafficOnly: false,
                radioBasedConfigs: {
                  is5GHz: {
                    model_type: 'RadioBasedSsidConfiguration',
                    enable80211r: null,
                    enable80211k: null,
                    enable80211v: null,
                  },
                  is2dot4GHz: {
                    model_type: 'RadioBasedSsidConfiguration',
                    enable80211r: null,
                    enable80211k: null,
                    enable80211v: null,
                  },
                  is5GHzU: {
                    model_type: 'RadioBasedSsidConfiguration',
                    enable80211r: null,
                    enable80211k: null,
                    enable80211v: null,
                  },
                  is5GHzL: {
                    model_type: 'RadioBasedSsidConfiguration',
                    enable80211r: null,
                    enable80211k: null,
                    enable80211v: null,
                  },
                },
                bonjourGatewayProfileId: null,
                enable80211w: null,
                wepConfig: null,
                forwardMode: null,
                profileType: 'ssid',
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
      query: GET_ALL_PROFILES,
      variables: { customerId: 2 },
    },
    result: {
      data: null,
      errors: [{}],
    },
  },
};

export const profilesMutationMock = {
  deleteSuccess: {
    request: {
      query: DELETE_PROFILE,
      variables: { id: '2' },
    },
    result: { data: { deleteProfile: { id: '2', __typename: 'Profile' } } },
  },
  deleteError: {
    request: {
      query: DELETE_PROFILE,
      variables: { id: '2' },
    },
    result: {
      data: null,
      errors: [{}],
    },
  },
};
