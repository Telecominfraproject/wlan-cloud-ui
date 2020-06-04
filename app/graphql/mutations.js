import gql from 'graphql-tag';

export const CREATE_LOCATION = gql`
  mutation CreateLocation(
    $locationType: String!
    $customerId: Int!
    $parentId: Int!
    $name: String!
  ) {
    createLocation(
      locationType: $locationType
      customerId: $customerId
      parentId: $parentId
      name: $name
    ) {
      locationType
      customerId
      parentId
      name
    }
  }
`;

export const UPDATE_LOCATION = gql`
  mutation UpdateLocation(
    $id: Int!
    $locationType: String!
    $customerId: Int!
    $parentId: Int!
    $name: String!
    $lastModifiedTimestamp: String
  ) {
    updateLocation(
      id: $id
      locationType: $locationType
      customerId: $customerId
      parentId: $parentId
      name: $name
      lastModifiedTimestamp: $lastModifiedTimestamp
    ) {
      id
      locationType
      customerId
      parentId
      name
      lastModifiedTimestamp
    }
  }
`;
