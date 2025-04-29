import gql from "graphql-tag";

const COUNTRY_LIST_QUERY = gql`
  query {
    countries {
      name
    }
  }
`;

export default COUNTRY_LIST_QUERY;
