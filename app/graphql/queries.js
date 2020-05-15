import gql from 'graphql-tag';

export const GET_ALL_LOCATIONS = gql`
  query GetAllLocations($customerId: Int!) {
    getAllLocations(customerId: $customerId) {
      id
      name
      parentId
    }
  }
`;

export const FILTER_EQUIPMENT = gql`
  query FilterEquipment($locationIds: [Int], $customerId: Int!, $equipmentType: String) {
    filterEquipment(
      customerId: $customerId
      locationIds: $locationIds
      equipmentType: $equipmentType
    ) {
      items {
        name
        id
        locationId
        details
        profileId
        inventoryId
      }
      context {
        maxItemsPerPage
        lastReturnedPageNumber
        isLastPage
        totalItemsReturned
      }
    }
  }
`;
