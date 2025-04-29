import gql from "graphql-tag";

export const GET_ALL_SAVE_MY_DESIGN_QUERY = gql`
  query getAllSaveMyDesign {
    getAllSaveMyDesign {
      items {
        accountId
        leadId
        id
        name
        product_ItemId
        product_ItemSkuId
      }
    }
  }
`;

export const SAVE_MY_DESIGN_QUERY = gql`
  mutation saveMyDesign($product_ItemId: String!, $product_ItemSkuId: String!) {
    saveMyDesign(
      product_ItemId: $product_ItemId
      product_ItemSkuId: $product_ItemSkuId
    ) {
      status
      message
      id
    }
  }
`;
