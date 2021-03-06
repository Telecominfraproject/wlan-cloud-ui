import { gql } from '@apollo/client';

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

export const REQUEST_EQUIPMENT_SWITCH_BANK = gql`
  mutation RequestEquipmentSwitchBank($equipmentId: ID) {
    requestEquipmentSwitchBank(equipmentId: $equipmentId) {
      success
    }
  }
`;

export const REQUEST_EQUIPMENT_REBOOT = gql`
  mutation RequestEquipmentReboot($equipmentId: ID) {
    requestEquipmentReboot(equipmentId: $equipmentId) {
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

export const UPDATE_EQUIPMENT = gql`
  mutation UpdateEquipment(
    $id: ID!
    $equipmentType: String!
    $inventoryId: String!
    $customerId: ID!
    $profileId: ID!
    $locationId: ID!
    $name: String!
    $baseMacAddress: String
    $latitude: String
    $longitude: String
    $serial: String
    $lastModifiedTimestamp: String
    $details: JSONObject
  ) {
    updateEquipment(
      id: $id
      equipmentType: $equipmentType
      inventoryId: $inventoryId
      customerId: $customerId
      profileId: $profileId
      locationId: $locationId
      name: $name
      baseMacAddress: $baseMacAddress
      latitude: $latitude
      longitude: $longitude
      serial: $serial
      lastModifiedTimestamp: $lastModifiedTimestamp
      details: $details
    ) {
      id
      equipmentType
      inventoryId
      customerId
      profileId
      locationId
      name
      baseMacAddress
      latitude
      longitude
      serial
      lastModifiedTimestamp
      details
    }
  }
`;

export const DELETE_EQUIPMENT = gql`
  mutation DeleteEquipment($id: ID!) {
    deleteEquipment(id: $id) {
      id
    }
  }
`;

export const UPDATE_CUSTOMER = gql`
  mutation UpdateCustomer(
    $id: ID!
    $email: String!
    $name: String!
    $details: JSONObject
    $createdTimestamp: String
    $lastModifiedTimestamp: String
  ) {
    updateCustomer(
      id: $id
      email: $email
      name: $name
      details: $details
      createdTimestamp: $createdTimestamp
      lastModifiedTimestamp: $lastModifiedTimestamp
    ) {
      id
      email
      name
      details
      createdTimestamp
      lastModifiedTimestamp
    }
  }
`;

export const UPDATE_CLIENT = gql`
  mutation UpdateClient(
    $customerId: ID!
    $macAddress: String
    $details: JSONObject
    $createdTimestamp: String
    $lastModifiedTimestamp: String
  ) {
    updateClient(
      customerId: $customerId
      macAddress: $macAddress
      details: $details
      createdTimestamp: $createdTimestamp
      lastModifiedTimestamp: $lastModifiedTimestamp
    ) {
      customerId
      macAddress
      createdTimestamp
      lastModifiedTimestamp
      details
    }
  }
`;

export const ADD_BLOCKED_CLIENT = gql`
  mutation AddBlockedClient($customerId: ID!, $macAddress: String) {
    addBlockedClient(customerId: $customerId, macAddress: $macAddress) {
      customerId
      macAddress
      details
      lastModifiedTimestamp
      createdTimestamp
    }
  }
`;
