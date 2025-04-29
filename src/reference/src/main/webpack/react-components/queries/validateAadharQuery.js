import gql from "graphql-tag";

export const VALIDATE_AADHAR = gql`
  query CreateUrl($order_id: String!) {
    CreateUrl(order_id: $order_id) {
      url
      message
    }
  }
`;

export const VALIDATE_AADHAR_STATUS = gql`
  mutation UpdateAadharStatus($order_id: String!, $status: String!) {
    UpdateAadharStatus(order_id: $order_id, status: $status) {
      status
      message
    }
  }
`;
