import gql from "graphql-tag";

export const MAKE_PAYMENT_QUICK_PURCHASE_QUERY = gql`
  mutation quickPurchase($input: QuickReserveInput) {
    quickPurchase(input: $input) {
      message
      opportunityId
      success
      saleOrderId
      prebookingOrderNumber
    }
  }
`;

export const CANCEL_PAYMENT_QUERY = gql`
  mutation cancelPartialPayment($payment_id: [ID!]!, $reason: String!) {
    cancelPartialPayment(payment_id: $payment_id, reason: $reason) {
      paymentTakenId
      paymentGivenId
      status
      message
    }
  }
`;
