import gql from "graphql-tag";

export const GET_MY_SCOOTER_QUERY = gql`
  query {
    getAllEccentricConfiguration {
      amount
      opportunityId
      orderId
      orderNumber
      image_url
      configuredDate
      isOrderCreated
      isPrebooked
      bookingId
      productName
      opportunity_lines {
        done
        records {
          id
          item_id
          item_name
          item_type
          quantity
          sku_id
          sku_name
        }
        total_size
      }
    }
  }
`;
