import { gql } from '@apollo/client';

export const FULL_PROFILE = gql`
  fragment FullProfile on Profile {
    id
    profileType
    customerId
    name
    osuSsidProfile {
      id
      name
      profileType
      details
    }
    associatedSsidProfiles {
      id
      name
      profileType
      details
    }
    childProfiles {
      id
      profileType
      customerId
      name
      osuSsidProfile {
        id
        name
        profileType
        details
      }
      associatedSsidProfiles {
        id
        name
        profileType
        details
      }
      childProfiles {
        id
        profileType
        customerId
        name
        osuSsidProfile {
          id
          name
          profileType
          details
        }
        associatedSsidProfiles {
          id
          name
          profileType
          details
        }
        createdTimestamp
        lastModifiedTimestamp
        details
      }
      childProfileIds
      createdTimestamp
      lastModifiedTimestamp
      details
    }
    childProfileIds
    createdTimestamp
    lastModifiedTimestamp
    details
  }
`;
