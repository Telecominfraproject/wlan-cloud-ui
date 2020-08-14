import { GET_PROFILE } from 'graphql/queries';
import { FILE_UPLOAD, UPDATE_PROFILE } from 'graphql/mutations';

export const profileDetailsQueryMock = {
  success: {
    request: {
      query: GET_PROFILE,
      variables: { id: 123 },
    },
    result: {
      data: {
        getProfile: {
          id: '123',
          profileType: 'radius',
          customerId: '2',
          name: 'Radius-Profile',
          childProfiles: [],
          childProfileIds: [],
          createdTimestamp: '0',
          lastModifiedTimestamp: '1597243756957',
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
      },
      loading: false,
      networkStatus: 7,
      stale: false,
    },
  },
  successCaptivePortal: {
    request: {
      query: GET_PROFILE,
      variables: { id: 123 },
    },
    result: {
      data: {
        getProfile: {
          id: '123',
          profileType: 'captive_portal',
          customerId: '2',
          name: 'Captive-portal',
          childProfiles: [],
          childProfileIds: [],
          createdTimestamp: '1597238768150',
          lastModifiedTimestamp: '1597238768150',
          details: {
            model_type: 'CaptivePortalConfiguration',
            name: 'Captive-portal',
            browserTitle: 'Access the network as Guest',
            headerContent: 'Captive Portal',
            userAcceptancePolicy: 'Use this network at your own risk. No warranty of any kind.',
            successPageMarkdownText: 'Welcome to the network',
            redirectURL: '',
            externalCaptivePortalURL: null,
            sessionTimeoutInMinutes: 60,
            logoFile: null,
            backgroundFile: null,
            walledGardenWhitelist: [],
            usernamePasswordFile: null,
            authenticationType: 'guest',
            radiusAuthMethod: 'CHAP',
            maxUsersWithSameCredentials: 42,
            externalPolicyFile: null,
            backgroundPosition: 'left_top',
            backgroundRepeat: 'no_repeat',
            radiusServiceName: null,
            expiryType: 'unlimited',
            userList: [],
            macWhiteList: [],
            profileType: 'captive_portal',
          },
          __typename: 'Profile',
        },
      },
      loading: false,
      networkStatus: 7,
      stale: false,
    },
  },
  error: {
    request: {
      query: GET_PROFILE,
      variables: { id: 123 },
    },
    result: {
      data: null,
      errors: [{}],
      loading: false,
      networkStatus: 7,
      stale: false,
    },
  },
};

export const profileDetailsMutationMock = {
  updateSuccess: {
    request: {
      query: UPDATE_PROFILE,
      variables: {
        id: '123',
        profileType: 'radius',
        customerId: '2',
        name: 'Radius-Profile',
        childProfiles: [],
        childProfileIds: [],
        createdTimestamp: '0',
        lastModifiedTimestamp: '1597243756957',
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
              regionName: 'Ottawa',
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
            },
          },
          profileType: 'radius',
          name: 'Radius-Profile',
          probeInterval: 0,
          services: [
            {
              name: 'Radius-Profile',
              ips: [
                {
                  model_type: 'RadiusServer',
                  ipAddress: '192.168.0.1',
                  secret: 'testing123',
                  authPort: 1812,
                  timeout: null,
                },
              ],
            },
          ],
          zones: [
            {
              name: 'Ottawa',
              subnets: [
                {
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
              ],
            },
          ],
        },
      },
    },
    result: {
      data: {
        updateProfile: {
          id: '123',
          profileType: 'radius',
          customerId: '2',
          name: 'Radius-Profile',
          childProfileIds: [],
          lastModifiedTimestamp: '1597245742733',
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
      },
    },
  },
  updateError: {
    request: {
      query: UPDATE_PROFILE,
      variables: {
        id: 123,
        username: 'test@test.com',
        password: 'password',
        role: 'CustomerIT',
        customerId: '2',
        lastModifiedTimestamp: '1597238767547',
      },
    },
    result: {
      data: null,
      errors: [{}],
    },
  },
  uploadSuccess: {
    request: {
      query: FILE_UPLOAD,
      variables: {
        fileName: 'testImg.jpg',
        file: {
          uid: '1234',
          lastModified: 1595008730671,
          lastModifiedDate: undefined,
          name: 'testImg.jpg',
          size: 100,
          type: 'image/jpg',
          percent: 0,
          originFileObj: { uid: 'rc-upload-1595008718690-73' },
        },
      },
    },
    result: {
      data: {
        fileUpload: {
          fileName: 'talkblog@4x.png',
          baseUrl: 'https://localhost:9091/',
          __typename: 'File',
        },
      },
    },
  },
  uploadError: {
    request: {
      query: FILE_UPLOAD,
      variables: {
        fileName: 'testImg.jpg',
        file: {
          uid: '1234',
          lastModified: 1595008730671,
          lastModifiedDate: undefined,
          name: 'testImg.jpg',
          size: 100,
          type: 'image/jpg',
          percent: 0,
          originFileObj: { uid: 'rc-upload-1595008718690-73' },
        },
      },
    },
    result: {
      data: null,
      errors: [{}],
    },
  },
};
