import gql from "graphql-tag";

export const UPLOAD_DOCUMENTS_QUERY = gql`
  mutation uploadCustomerDocuments(
    $order_id: String!
    $document_type: DocumentTypeEnum
    $address_type: String
    $file: String!
  ) {
    uploadCustomerDocuments(
      order_id: $order_id
      document_type: $document_type
      address_type: $address_type
      file: $file
    ) {
      status
    }
  }
`;

export const SUBMIT_DOCUMENTS_QUERY = gql`
  mutation submitDocuments($order_id: String!, $input: DocumentTypes!) {
    submitDocuments(order_id: $order_id, input: $input) {
      status
    }
  }
`;
