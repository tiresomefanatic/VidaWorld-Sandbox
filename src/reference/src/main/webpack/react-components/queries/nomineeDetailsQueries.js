import gql from "graphql-tag";

export const GET_NOMINEE_DETAILS = gql`
  query ($order_id: String!) {
    getNomineeDetails(order_id: $order_id) {
      nominee_name
      nominee_age
      nominee_relation
      productSku
    }
  }
`;

export const UPDATE_NOMINEE_DETAILS = gql`
  mutation updateInsuranceNominee(
    $order_id: String!
    $nominee_name: String!
    $nominee_age: Int
    $nominee_relation: NomineeRelationEnum
  ) {
    updateInsuranceNominee(
      order_id: $order_id
      nominee_name: $nominee_name
      nominee_age: $nominee_age
      nominee_relation: $nominee_relation
    ) {
      message
      status
    }
  }
`;
