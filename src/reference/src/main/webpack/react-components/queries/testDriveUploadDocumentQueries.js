import gql from "graphql-tag";

export const UPLOAD_TEST_DRIVE_EMERGENCY_DETAILS_QUERY = gql`
  mutation updateEmergencyDetails(
    $front_key: String!
    $back_key: String!
    $relation: String!
    $emergencyNumber: String!
  ) {
    updateEmergencyDetails(
      front_key: $front_key
      back_key: $back_key
      relation: $relation
      emergencyNumber: $emergencyNumber
    ) {
      status_code
      message
    }
  }
`;

export const GET_SIGNED_URL_QUERY = gql`
  mutation getDlSignedUrl(
    $extension: String!
    $docType: FreedoDocTypeEnum!
    $base64_encoded_file: String!
  ) {
    getDlSignedUrl(
      extension: $extension
      docType: $docType
      base64_encoded_file: $base64_encoded_file
    ) {
      status_code
      docKey
    }
  }
`;
