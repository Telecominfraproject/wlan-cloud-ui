import { ADD_BLOCKED_CLIENT, UPDATE_CLIENT } from 'graphql/mutations';
import { GET_BLOCKED_CLIENTS } from 'graphql/queries';

export const blockListQueryMock = {
  success: {
    request: {
      query: GET_BLOCKED_CLIENTS,
      variables: { customerId: 2 },
    },
    result: {
      data: {
        getBlockedClients: [
          {
            customerId: '2',
            macAddress: '74:9c:00:01:45:ae',
            createdTimestamp: '1597172802575',
            lastModifiedTimestamp: '1597333913133',
            details: {
              model_type: 'ClientInfoDetails',
              alias: 'alias 128213363803566',
              clientType: 0,
              apFingerprint: 'fp 74:9c:00:01:45:ae',
              userName: 'user-128213363803566',
              hostName: 'hostName-128213363803566',
              lastUsedCpUsername: null,
              lastUserAgent: null,
              doNotSteer: false,
              blocklistDetails: {
                model_type: 'BlocklistDetails',
                enabled: true,
                startTime: null,
                endTime: null,
              },
            },
            __typename: 'Client',
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
      query: GET_BLOCKED_CLIENTS,
      variables: { customerId: 2 },
    },
    result: {
      data: null,
      errors: [{}],
    },
  },
};

export const blockListMutationMock = {
  addClientSuccess: {
    request: {
      query: ADD_BLOCKED_CLIENT,
      variables: {
        customerId: 2,
        macAddress: '74:8c:00:01:45:ae',
      },
    },
    result: {
      data: {
        addBlockedClient: {
          customerId: '2',
          macAddress: '74:8c:00:01:45:ae',
          details: {
            model_type: 'ClientInfoDetails',
            alias: null,
            clientType: 0,
            apFingerprint: null,
            userName: null,
            hostName: null,
            lastUsedCpUsername: null,
            lastUserAgent: null,
            doNotSteer: false,
            blocklistDetails: {
              model_type: 'BlocklistDetails',
              enabled: true,
              startTime: null,
              endTime: null,
            },
          },
          lastModifiedTimestamp: '1597334825157',
          createdTimestamp: '1597334825157',
          __typename: 'Client',
        },
      },
    },
  },
  addClientError: {
    request: {
      query: ADD_BLOCKED_CLIENT,
    },
    result: {
      data: null,
      errors: [{}],
    },
  },
  updateClientSuccess: {
    request: {
      query: UPDATE_CLIENT,
      variables: {
        customerId: 2,
        macAddress: '74:9c:00:01:45:ae',
        details: {
          model_type: 'ClientInfoDetails',
          alias: 'alias 128213363803566',
          clientType: 0,
          apFingerprint: 'fp 74:9c:00:01:45:ae',
          userName: 'user-128213363803566',
          hostName: 'hostName-128213363803566',
          lastUsedCpUsername: null,
          lastUserAgent: null,
          doNotSteer: false,
          blocklistDetails: {
            model_type: 'BlocklistDetails',
            enabled: false,
            startTime: null,
            endTime: null,
          },
        },
      },
    },
    result: {
      data: {
        updateClient: {
          customerId: '2',
          macAddress: 'mac-74:9c:00:01:45:ae',
          createdTimestamp: '0',
          lastModifiedTimestamp: '1597336036972',
          details: {
            model_type: 'ClientInfoDetails',
            alias: 'alias 128213363803566',
            clientType: 0,
            apFingerprint: 'fp 74:9c:00:01:45:ae',
            userName: 'user-128213363803566',
            hostName: 'hostName-128213363803566',
            lastUsedCpUsername: null,
            lastUserAgent: null,
            doNotSteer: false,
            blocklistDetails: {
              model_type: 'BlocklistDetails',
              enabled: false,
              startTime: null,
              endTime: null,
            },
          },
          __typename: 'Client',
        },
      },
    },
  },

  updateClientError: {
    request: {
      query: UPDATE_CLIENT,
      variables: {
        customerId: 2,
        macAddress: '74:9c:00:01:45:ae',
        details: {
          model_type: 'ClientInfoDetails',
          alias: 'alias 128213363803566',
          clientType: 0,
          apFingerprint: 'fp 74:9c:00:01:45:ae',
          userName: 'user-128213363803566',
          hostName: 'hostName-128213363803566',
          lastUsedCpUsername: null,
          lastUserAgent: null,
          doNotSteer: false,
          blocklistDetails: {
            model_type: 'BlocklistDetails',
            enabled: false,
            startTime: null,
            endTime: null,
          },
        },
      },
    },
    result: {
      data: null,
      errors: [{}],
    },
  },
};
