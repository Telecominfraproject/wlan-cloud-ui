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
      success
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

export const UPDATE_TRACK_ASSIGNMENT = gql`
  mutation UpdateFirmwareTrackAssignment(
    $trackRecordId: ID!
    $firmwareVersionRecordId: ID!
    $modelId: String!
    $createdTimestamp: String
    $lastModifiedTimestamp: String
  ) {
    updateFirmwareTrackAssignment(
      trackRecordId: $trackRecordId
      firmwareVersionRecordId: $firmwareVersionRecordId
      modelId: $modelId
      createdTimestamp: $createdTimestamp
      lastModifiedTimestamp: $lastModifiedTimestamp
    ) {
      trackRecordId
      firmwareVersionRecordId
      modelId
      createdTimestamp
      lastModifiedTimestamp
    }
  }
`;

export const DELETE_TRACK_ASSIGNMENT = gql`
  mutation UpdateEquipmentFirmware($firmwareTrackId: ID!, $firmwareVersionId: ID!) {
    deleteFirmwareTrackAssignment(
      firmwareTrackId: $firmwareTrackId
      firmwareVersionId: $firmwareVersionId
    ) {
      trackRecordId
      firmwareVersionRecordId
      modelId
      createdTimestamp
      lastModifiedTimestamp
    }
  }
`;

export const CREATE_FIRMWARE = gql`
  mutation CreateFirmware(
    $modelId: String!
    $versionName: String
    $description: String
    $filename: String
    $commit: String
    $releaseDate: String
    $validationCode: String
  ) {
    createFirmware(
      modelId: $modelId
      versionName: $versionName
      description: $description
      filename: $filename
      commit: $commit
      releaseDate: $releaseDate
      validationCode: $validationCode
    ) {
      modelId
      versionName
      description
      filename
      commit
      releaseDate
      validationCode
    }
  }
`;

export const UPDATE_FIRMWARE = gql`
  mutation UpdateFirmware(
    $id: ID!
    $modelId: String!
    $versionName: String
    $description: String
    $filename: String
    $commit: String
    $releaseDate: String
    $validationCode: String
    $createdTimestamp: String
    $lastModifiedTimestamp: String
  ) {
    updateFirmware(
      id: $id
      modelId: $modelId
      versionName: $versionName
      description: $description
      filename: $filename
      commit: $commit
      releaseDate: $releaseDate
      validationCode: $validationCode
      createdTimestamp: $createdTimestamp
      lastModifiedTimestamp: $lastModifiedTimestamp
    ) {
      id
      modelId
      versionName
      description
      filename
      commit
      releaseDate
      validationCode
      createdTimestamp
      lastModifiedTimestamp
    }
  }
`;

export const DELETE_FIRMWARE = gql`
  mutation DeleteFirmware($id: ID!) {
    deleteFirmware(id: $id) {
      id
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
