import { GET_USER } from 'graphql/queries';
import { UPDATE_USER } from 'graphql/mutations';

export const editAccountQueryMock = {
  success: {
    request: {
      query: GET_USER,
      variables: { id: 123 },
    },
    result: {
      data: {
        getUser: {
          id: '123',
          username: 'user-0',
          role: 'CustomerIT',
          customerId: '2',
          lastModifiedTimestamp: '1597238767547',
          __typename: 'User',
        },
      },
      loading: false,
      networkStatus: 7,
      stale: false,
    },
  },

  error: {
    request: {
      query: GET_USER,
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

export const editAccountMutationMock = {
  success: {
    request: {
      query: UPDATE_USER,
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
      data: {
        updateUser: {
          id: 123,
          username: 'user-0',
          role: 'CustomerIT',
          customerId: '2',
          lastModifiedTimestamp: '1597238767547',
          __typename: 'User',
        },
      },
    },
  },
  error: {
    request: {
      query: UPDATE_USER,
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
};
