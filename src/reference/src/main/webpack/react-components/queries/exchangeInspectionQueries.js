import gql from "graphql-tag";

export const GET_EXCHANGE_INSPECTION_DETAILS = gql`
  mutation updateExchange($sf_order_id: String!, $exchange_option: String!) {
    updateExchange(
      sf_order_id: $sf_order_id
      exchange_option: $exchange_option
    ) {
      message
      status
    }
  }
`;
