import { GET_ALL_USERS } from '../../../graphql/queries';
import { CREATE_USER, UPDATE_USER, DELETE_USER } from '../../../graphql/mutations';

export const accountsQueryMock = {
  success: {
    request: {
      query: GET_ALL_USERS,
      variables: { customerId: 2 },
    },
    result: {
      data: {
        getAllUsers: {
          items: [
            {
              id: '1',
              email: 'user-0',
              role: 'CustomerIT',
              lastModifiedTimestamp: '1596814602673',
              customerId: '2',
              __typename: 'User',
            },
            {
              id: '2',
              email: 'user-1',
              role: 'CustomerIT',
              lastModifiedTimestamp: '1596814602814',
              customerId: '2',
              __typename: 'User',
            },
            {
              id: '3',
              email: 'user-2',
              role: 'CustomerIT',
              lastModifiedTimestamp: '1596814602815',
              customerId: '2',
              __typename: 'User',
            },
            {
              id: '4',
              email: 'user-3',
              role: 'CustomerIT',
              lastModifiedTimestamp: '1596814602815',
              customerId: '2',
              __typename: 'User',
            },
            {
              id: '5',
              email: 'user-4',
              role: 'CustomerIT',
              lastModifiedTimestamp: '1596814602815',
              customerId: '2',
              __typename: 'User',
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
  fetchMore: {
    request: {
      query: GET_ALL_USERS,
      variables: { customerId: 2, cursor: 'test' },
    },
    result: {
      data: {
        getAllUsers: {
          items: [
            {
              id: '18',
              email: 'user-18',
              role: 'CustomerIT',
              lastModifiedTimestamp: '1596814602673',
              customerId: '2',
              __typename: 'User',
            },
          ],
          context: {
            cursor: 'test',
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
      query: GET_ALL_USERS,
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
};

export const accountsMutationMock = {
  addUserSuccess: {
    request: {
      query: CREATE_USER,
      variables: {
        username: 'test@test.com',
        password: 'password',
        role: 'CustomerIT',
        customerId: 2,
      },
    },
    result: {
      data: {
        createUser: {
          username: 'test@test.com',
          role: 'CustomerIT',
          customerId: '2',
        },
      },
    },
  },
  addUserError: {
    request: {
      query: CREATE_USER,
      variables: {},
    },
    result: {
      data: null,
      errors: [{}],
    },
  },
  editUserSuccess: {
    request: {
      query: UPDATE_USER,
      variables: {
        id: '1',
        username: 'test@test.com',
        password: 'password',
        role: 'CustomerIT',
        customerId: 2,
        lastModifiedTimestamp: '1596814602673',
      },
    },
    result: {
      data: {
        updateUser: {
          id: '1',
          username: 'test@test.com',
          role: 'CustomerIT',
          customerId: '2',
          lastModifiedTimestamp: '1597080851726',
          __typename: 'User',
        },
      },
    },
  },
  editUserError: {
    request: {
      query: UPDATE_USER,
      variables: {},
    },
    result: {
      data: null,
      errors: [{}],
    },
  },
  deleteAccountSuccess: {
    request: {
      query: DELETE_USER,
      variables: { id: '1' },
    },
    result: {
      data: {
        deleteUser: {
          id: '1',
          __typename: 'User',
        },
      },
    },
  },
  deleteAccountError: {
    request: {
      query: DELETE_USER,
      variables: { id: '2' },
    },
    result: {
      data: null,
      errors: [{}],
      loading: false,
    },
  },
};
