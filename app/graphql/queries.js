import gql from 'graphql-tag';

export const GET_ALL_LOCATIONS = gql`
  query GetAllLocations($customerId: ID!) {
    getAllLocations(customerId: $customerId) {
      id
      name
      parentId
      locationType
    }
  }
`;

export const FILTER_EQUIPMENT = gql`
  query FilterEquipment(
    $locationIds: [ID]
    $customerId: ID!
    $equipmentType: String
    $cursor: String
  ) {
    filterEquipment(
      customerId: $customerId
      locationIds: $locationIds
      equipmentType: $equipmentType
      cursor: $cursor
    ) {
      items {
        name
        id
        locationId
        profileId
        inventoryId
        channel
        model
        alarmsCount
        profile {
          name
        }
        status {
          protocol {
            details {
              reportedIpV4Addr
              reportedMacAddr
              manufacturer
            }
          }
          osPerformance {
            details {
              uptimeInSeconds
            }
          }
          radioUtilization {
            details {
              reportedIpV4Addr
              capacityDetails
              noiseFloorDetails
            }
          }
          clientDetails {
            details {
              numClientsPerRadio
            }
          }
        }
      }
      context {
        lastPage
        cursor
      }
    }
  }
`;

export const FILTER_EQUIPMENT_BULK_EDIT_APS = gql`
  query FilterEquipment(
    $locationIds: [ID]
    $customerId: ID!
    $equipmentType: String
    $cursor: String
  ) {
    filterEquipment(
      customerId: $customerId
      locationIds: $locationIds
      equipmentType: $equipmentType
      cursor: $cursor
    ) {
      items {
        name
        id
        locationId
        channel
        details
      }
      context {
        lastPage
        cursor
      }
    }
  }
`;

export const GET_LOCATION = gql`
  query GetLocation($id: ID!) {
    getLocation(id: $id) {
      id
      parentId
      name
      locationType
      lastModifiedTimestamp
    }
  }
`;

export const FILTER_CLIENT_SESSIONS = gql`
  query FilterClientSessions($customerId: ID!, $locationIds: [ID], $cursor: String) {
    filterClientSessions(customerId: $customerId, locationIds: $locationIds, cursor: $cursor) {
      items {
        id
        macAddress
        ipAddress
        hostname
        ssid
        radioType
        signal
        manufacturer
        equipment {
          name
        }
      }
      context {
        lastPage
        cursor
      }
    }
  }
`;

export const GET_CLIENT_SESSION = gql`
  query GetClientSession($customerId: ID!, $macAddress: String!) {
    getClientSession(customerId: $customerId, macAddress: $macAddress) {
      id
      macAddress
      ipAddress
      hostname
      ssid
      radioType
      signal
      manufacturer
      equipment {
        name
      }
      details
    }
  }
`;

export const FILTER_SERVICE_METRICS = gql`
  query FilterServiceMetrics(
    $customerId: ID!
    $cursor: String
    $fromTime: String!
    $toTime: String!
    $clientMacs: [String]
    $equipmentIds: [ID]
    $dataTypes: [String]
    $limit: Int
  ) {
    filterServiceMetrics(
      customerId: $customerId
      cursor: $cursor
      fromTime: $fromTime
      toTime: $toTime
      clientMacs: $clientMacs
      equipmentIds: $equipmentIds
      dataTypes: $dataTypes
      limit: $limit
    ) {
      items {
        dataType
        createdTimestamp
        rssi
        rxBytes
        txBytes
        detailsJSON
      }
      context {
        lastPage
        cursor
      }
    }
  }
`;

export const GET_ALL_PROFILES = gql`
  query GetAllProfiles($customerId: ID!, $cursor: String, $type: String) {
    getAllProfiles(customerId: $customerId, cursor: $cursor, type: $type) {
      items {
        id
        name
        profileType
        details
      }
      context {
        cursor
        lastPage
      }
    }
  }
`;

export const GET_ALL_STATUS = gql`
  query GetAllStatus($customerId: ID!, $statusDataTypes: [String]) {
    getAllStatus(customerId: $customerId, statusDataTypes: $statusDataTypes) {
      items {
        customerId
        detailsJSON
        details {
          equipmentCountPerOui
          clientCountPerOui
        }
      }
      context {
        lastPage
        cursor
      }
    }
  }
`;

export const GET_ALL_FIRMWARE_MODELS = gql`
  query GetAllFirmwareModelId {
    getAllFirmwareModelId
  }
`;

export const GET_FIRMWARE_TRACK = gql`
  query GetFirmwareTrack($firmwareTrackName: String!) {
    getFirmwareTrack(firmwareTrackName: $firmwareTrackName) {
      recordId
      trackName
      createdTimestamp
      lastModifiedTimestamp
    }
  }
`;

export const GET_ALL_FIRMWARE = gql`
  query GetAllFirmware($modelId: String) {
    getAllFirmware(modelId: $modelId) {
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

export const GET_TRACK_ASSIGNMENTS = gql`
  query GetAllFirmwareTrackAssignment {
    getAllFirmwareTrackAssignment {
      modelId
      firmwareVersionRecordId
      trackRecordId
      lastModifiedTimestamp
    }
  }
`;

export const GET_ALARM_COUNT = gql`
  query GetAlarmCount($customerId: ID!) {
    getAlarmCount(customerId: $customerId)
  }
`;

export const GET_CUSTOMER = gql`
  query GetCustomer($id: ID!) {
    getCustomer(id: $id) {
      id
      name
      email
      createdTimestamp
      lastModifiedTimestamp
      details
    }
  }
`;

export const FILTER_SYSTEM_EVENTS = gql`
  query FilterSystemEvents(
    $customerId: ID!
    $fromTime: String!
    $toTime: String!
    $equipmentIds: [ID]
    $dataTypes: [String]
    $cursor: String
    $limit: Int
  ) {
    filterSystemEvents(
      customerId: $customerId
      fromTime: $fromTime
      toTime: $toTime
      dataTypes: $dataTypes
      equipmentIds: $equipmentIds
      cursor: $cursor
      limit: $limit
    ) {
      items
      context {
        lastPage
        cursor
      }
    }
  }
`;

export const GET_BLOCKED_CLIENTS = gql`
  query GetBlockedClients($customerId: ID!) {
    getBlockedClients(customerId: $customerId) {
      customerId
      macAddress
      createdTimestamp
      lastModifiedTimestamp
      details
    }
  }
`;
