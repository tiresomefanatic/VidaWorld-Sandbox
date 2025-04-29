import gql from "graphql-tag";

export const CREATE_LOAN_LEASE_PAYMENT_QUERY = gql`
  mutation createLoanLeaseApplication(
    $order_id: String!
    $application_type: String!
  ) {
    createLoanLeaseApplication(
      order_id: $order_id
      application_type: $application_type
    ) {
      status
      response
      application_id
      application_link
    }
  }
`;
export const CANCEL_LOAN_LEASE_PAYMENT_QUERY = gql`
  mutation cancelLoanLeaseApplication(
    $order_id: String!
    $application_type: String!
  ) {
    cancelLoanLeaseApplication(
      order_id: $order_id
      application_type: $application_type
    ) {
      status
      response
    }
  }
`;
