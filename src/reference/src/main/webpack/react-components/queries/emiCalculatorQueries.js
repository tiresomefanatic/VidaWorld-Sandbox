import gql from "graphql-tag";

export const GET_LOAN_DETAILS = gql`
  query getEmiCalculators(
    $city: String!
    $sf_itemsku_id: String!
    $application_type: String!
  ) {
    getEmiCalculators(
      city: $city
      sf_itemsku_id: $sf_itemsku_id
      application_type: $application_type
    ) {
      status
      response
      application_link
    }
  }
`;
