import { AUTHENTICATE_USER } from 'graphql/mutations';

export const loginMutationMock = {
  loginSuccess: {
    request: {
      query: AUTHENTICATE_USER,
      variables: {
        email: 'test@test.com',
        password: 'password',
      },
    },
    result: {
      data: {
        authenticateUser: {
          access_token: '123',
          refresh_token: '345',
          expires_in: '1',
        },
      },
    },
  },
  loginError: {
    request: {
      query: AUTHENTICATE_USER,
      variables: {},
    },
    result: {
      data: null,
      errors: [{}],
    },
  },
};
