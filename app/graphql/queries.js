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
        profile {
          name
        }
        status {
          protocol {
            details {
              reportedIpV4Addr
              reportedMacAddr
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
        }
      }
      context {
        lastPage
        cursor
      }
    }
  }
`;

export const FILTER_CLIENT_SESSIONS = gql`
  query FilterClientSessions($customerId: Int!, $cursor: String) {
    getAllClientSessions(customerId: $customerId, cursor: $cursor) {
      items {
        id
        macAddress
        ipAddress
        hostname
        ssid
        radioType
        signal
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
    $fromTime: Int!
    $toTime: Int!
    $clientMacs: [String]
    $dataTypes: [String]
  ) {
    filterServiceMetrics(
      customerId: $customerId
      cursor: $cursor
      fromTime: $fromTime
      toTime: $toTime
      clientMacs: $clientMacs
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
