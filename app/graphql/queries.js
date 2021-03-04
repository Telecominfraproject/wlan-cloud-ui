import { gql } from '@apollo/client';

export const GET_API_URL = gql`
  query GetApiUrl {
    getApiUrl
  }
`;

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
    $context: JSONObject
  ) {
    filterEquipment(
      customerId: $customerId
      locationIds: $locationIds
      equipmentType: $equipmentType
      context: $context
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
        baseMacAddress
        manufacturer
        status {
          protocol {
            details {
              reportedIpV4Addr
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
          firmware {
            detailsJSON
          }
        }
      }
      context
    }
  }
`;

export const GET_EQUIPMENT = gql`
  query GetEquipment($id: ID!) {
    getEquipment(id: $id) {
      id
      equipmentType
      inventoryId
      customerId
      profileId
      locationId
      name
      latitude
      longitude
      serial
      lastModifiedTimestamp
      details
      profile {
        id
        name
        childProfiles {
          id
          name
          details
        }
      }
      baseMacAddress
      manufacturer
      status {
        firmware {
          detailsJSON
        }
        protocol {
          detailsJSON
        }
        radioUtilization {
          detailsJSON
        }
        clientDetails {
          detailsJSON
          details {
            numClientsPerRadio
          }
        }
        osPerformance {
          detailsJSON
        }
      }
      model
      alarmsCount
      alarms {
        severity
        alarmCode
        details
        createdTimestamp
      }
    }
  }
`;

export const FILTER_EQUIPMENT_BULK_EDIT_APS = gql`
  query FilterEquipment(
    $locationIds: [ID]
    $customerId: ID!
    $equipmentType: String
    $context: JSONObject
  ) {
    filterEquipment(
      customerId: $customerId
      locationIds: $locationIds
      equipmentType: $equipmentType
      context: $context
    ) {
      items {
        name
        id
        locationId
        channel
        details
      }
      context
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
  query FilterClientSessions($customerId: ID!, $locationIds: [ID], $context: JSONObject) {
    filterClientSessions(customerId: $customerId, locationIds: $locationIds, context: $context) {
      items {
        id
        macAddress
        ipAddress
        hostname
        ssid
        radioType
        signal
        manufacturer
        details
        equipment {
          name
        }
      }
      context
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
    $context: JSONObject
    $fromTime: String!
    $toTime: String!
    $clientMacs: [String]
    $equipmentIds: [ID]
    $dataTypes: [String]
    $limit: Int
  ) {
    filterServiceMetrics(
      customerId: $customerId
      context: $context
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
      context
    }
  }
`;

export const GET_ALL_PROFILES = (fields = '') => gql`
  query GetAllProfiles(
    $customerId: ID!
    $cursor: String
    $limit: Int
    $type: String
    $context: JSONObject
  ) {
    getAllProfiles(
      customerId: $customerId
      cursor: $cursor
      limit: $limit
      type: $type
      context: $context
    ) {
      items {
        id
        name
        profileType
        details
        ${fields}
      }
      context
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
      context
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
    $context: JSONObject
    $limit: Int
  ) {
    filterSystemEvents(
      customerId: $customerId
      fromTime: $fromTime
      toTime: $toTime
      dataTypes: $dataTypes
      equipmentIds: $equipmentIds
      context: $context
      limit: $limit
    ) {
      items
      context
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
