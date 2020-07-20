import gql from 'graphql-tag';

export const REFRESH_TOKEN = gql`
  mutation UpdateToken($refreshToken: String!) {
    updateToken(refreshToken: $refreshToken) {
      access_token
      refresh_token
      expires_in
    }
  }
`;

export const CREATE_LOCATION = gql`
  mutation CreateLocation(
    $locationType: String!
    $customerId: ID!
    $parentId: ID!
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
    $id: ID!
    $locationType: String!
    $customerId: ID!
    $parentId: ID!
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

export const DELETE_LOCATION = gql`
  mutation DeleteLocation($id: ID!) {
    deleteLocation(id: $id) {
      id
    }
  }
`;

export const UPDATE_EQUIPMENT_BULK = gql`
  mutation UpdateEquipmentBulk($items: [EquipmentRrmUpdate]) {
    updateEquipmentBulk(items: $items) {
      success
    }
  }
`;

export const FILE_UPLOAD = gql`
  mutation FileUpload($fileName: String, $file: Upload) {
    fileUpload(fileName: $fileName, file: $file) {
      fileName
      baseUrl
    }
  }
`;

export const OUI_UPLOAD = gql`
  mutation OuiUpload($fileName: String, $file: Upload) {
    ouiUpload(fileName: $fileName, file: $file) {
      fileName
      baseUrl
    }
  }
`;

export const UPDATE_EQUIPMENT_FIRMWARE = gql`
  mutation UpdateEquipmentFirmware($equipmentId: ID, $firmwareVersionId: ID) {
    updateEquipmentFirmware(equipmentId: $equipmentId, firmwareVersionId: $firmwareVersionId) {
      success
    }
  }
`;

export const CREATE_EQUIPMENT = gql`
  mutation CreateEquipment(
    $customerId: ID!
    $inventoryId: String!
    $locationId: ID!
    $name: String!
    $profileId: ID!
  ) {
    createEquipment(
      customerId: $customerId
      inventoryId: $inventoryId
      locationId: $locationId
      name: $name
      profileId: $profileId
    ) {
      locationId
      customerId
      inventoryId
      name
      profileId
    }
  }
`;
