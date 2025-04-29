import gql from "graphql-tag";

export const UPDATE_PAYMENT_STATUS = gql`
  mutation updateFreedoPayment($encryptedResponse: String!) {
    updateFreedoPayment(encrypted_response: $encryptedResponse) {
      payment_status
      status_code
      message
      ccavenue_status
      freedo_booking_id
      orderID
      orderStatus
      orderValue
      paymentType
      paymentMethod
      account_id
      rental_id
      booking_id
    }
  }
`;
