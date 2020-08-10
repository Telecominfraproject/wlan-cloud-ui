import gql from 'graphql-tag';

export const GET_ALL_USERS = gql`
  query GetAllUsers($customerId: ID!, $cursor: String) {
    getAllUsers(customerId: $customerId, cursor: $cursor) {
      items {
        id
        email: username
        role
        lastModifiedTimestamp
        customerId
      }
      context {
        cursor
        lastPage
      }
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($username: String!, $password: String!, $role: String!, $customerId: ID!) {
    createUser(username: $username, password: $password, role: $role, customerId: $customerId) {
      username
      role
      customerId
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser(
    $id: ID!
    $username: String!
    $password: String!
    $role: String!
    $customerId: ID!
    $lastModifiedTimestamp: String
  ) {
    updateUser(
      id: $id
      username: $username
      password: $password
      role: $role
      customerId: $customerId
      lastModifiedTimestamp: $lastModifiedTimestamp
    ) {
      id
      username
      role
      customerId
      lastModifiedTimestamp
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`;
