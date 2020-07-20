import gql from 'graphql-tag';

export const GET_ALL_LOCATIONS = gql`
  query GetAllLocations($customerId: Int!) {
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
    $locationIds: [Int]
    $customerId: Int!
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
    $locationIds: [Int]
    $customerId: Int!
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
  query GetLocation($id: Int!) {
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
  query FilterClientSessions($customerId: Int!, $locationIds: [Int], $cursor: String) {
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
  query GetClientSession($customerId: Int!, $macAddress: String!) {
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
    $customerId: Int!
    $cursor: String
    $fromTime: String!
    $toTime: String!
    $clientMacs: [String]
    $equipmentIds: [ID]
    $dataTypes: [String]
  ) {
    filterServiceMetrics(
      customerId: $customerId
      cursor: $cursor
      fromTime: $fromTime
      toTime: $toTime
      clientMacs: $clientMacs
      equipmentIds: $equipmentIds
      dataTypes: $dataTypes
    ) {
      items {
        dataType
        createdTimestamp
        rssi
        rxBytes
        txBytes
      }
      context {
        lastPage
        cursor
      }
    }
  }
`;

export const GET_ALL_PROFILES = gql`
  query GetAllProfiles($customerId: Int!, $cursor: String, $type: String) {
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
  query GetAllStatus($customerId: Int!, $statusDataTypes: [String]) {
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

export const GET_ALARM_COUNT = gql`
  query GetAlarmCount($customerId: Int!) {
    getAlarmCount(customerId: $customerId)
  }
`;
