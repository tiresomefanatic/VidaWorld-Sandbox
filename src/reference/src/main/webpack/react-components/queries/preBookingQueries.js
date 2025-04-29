import gql from "graphql-tag";

export const BOOKING_GET_PINCODE_QUERY = gql`
  query getNearByBranches($postcode: String!) {
    getNearByBranches(postcode: $postcode) {
      isSameCity
      city
      state
      country
      items {
        categoryname
        branches {
          id
          name
          isActive
          partnerAccountId
          geoLocation_latitude
          geoLocation_longitude
        }
      }
    }
  }
`;

export const GET_ALL_PRODUCTS_QUERY = gql`
  query allProducts($category_id: String!) {
    products(
      filter: { category_id: { eq: $category_id } }
      sort: { name: DESC }
    ) {
      items {
        name
        sku
        sf_id
        __typename
        battery_capacity
        incline_capacity
        ... on ConfigurableProduct {
          variants {
            product {
              __typename
              name
              sku
              range
              charging_time
              accelerator
              top_speed
              sf_id
              vaahan_color
              rangewmtc_c
              battery_capacity
              incline_capacity
            }
            attributes {
              label
              code
              value_index
            }
          }
        }
      }
    }
  }
`;

export const PREBOOKING_CHANGE_VARIANT_QUERY = gql`
  mutation changeProductVariant(
    $sf_order_id: String!
    $sf_item_id: String!
    $sf_itemsku_id: String!
  ) {
    changeProductVariant(
      sf_order_id: $sf_order_id
      sf_item_id: $sf_item_id
      sf_itemsku_id: $sf_itemsku_id
    ) {
      status
      message
    }
  }
`;
