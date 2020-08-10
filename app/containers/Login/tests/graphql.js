import gql from 'graphql-tag';

export const AUTHENTICATE_USER = gql`
  mutation AuthenticateUser($email: String!, $password: String!) {
    authenticateUser(email: $email, password: $password) {
      access_token
      refresh_token
      expires_in
    }
  }
`;
