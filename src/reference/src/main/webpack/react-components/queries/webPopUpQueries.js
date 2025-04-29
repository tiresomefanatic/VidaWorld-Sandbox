import gql from "graphql-tag";

export const WEBPOPUP_SENDOTP = gql`
  mutation SendOtp(
    $country_code: String!
    $username: String!
    $is_login: Boolean!
    $sub_source: String
  ) {
    SendOtp(
      country_code: $country_code
      username: $username
      is_login: $is_login
      sub_source: $sub_source
    ) {
      SF_ID
      status_code
      message
    }
  }
`;

export const WEBPOPUP_VERIFY_OTP = gql`
  mutation WebPopupVerifyOtp(
    $SF_ID: String!
    $otp: String!
    $fname: String!
    $lname: String!
    $customer_city: String!
    $customer_state: String!
    $country_code: String!
    $username: String!
    $is_login: Boolean
    $sub_source: String
  ) {
    WebPopupVerifyOtp(
      SF_ID: $SF_ID
      otp: $otp
      fname: $fname
      lname: $lname
      customer_city: $customer_city
      customer_state: $customer_state
      country_code: $country_code
      username: $username
      is_login: $is_login
      sub_source: $sub_source
    ) {
      status_code
      lead_id
      message
    }
  }
`;
