import gql from "graphql-tag";

export const MAKE_PAYMENT_QUICK_RESERVE_QUERY = gql`
  mutation quickReserve($input: QuickReserveInput) {
    quickReserve(input: $input) {
      success
      message
      payment_url
    }
  }
`;
