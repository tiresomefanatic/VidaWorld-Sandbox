import gql from "graphql-tag";

export const GENERATE_LOGIN_OTP_QUERY = gql`
  mutation SendOtp(
    $country_code: String!
    $username: String!
    $is_login: Boolean!
  ) {
    SendOtp(
      country_code: $country_code
      username: $username
      is_login: $is_login
    ) {
      SF_ID
      customer_exist
      isForcedLogIn
      message
      status_code
    }
  }
`;

export const GENERATE_REGISTER_OTP_QUERY = gql`
  mutation SendOtp(
    $country_code: String!
    $mobile_number: String!
    $email: String!
    $is_login: Boolean!
  ) {
    SendOtp(
      country_code: $country_code
      mobile_number: $mobile_number
      email: $email
      is_login: $is_login
    ) {
      SF_ID
      customer_exist
      isForcedLogIn
      status_code
      message
    }
  }
`;
export const GENERATE_EMAIL_VERIFY_OTP_QUERY = gql`
  mutation SendOtp(
    $country_code: String!
    $mobile_number: String!
    $email: String!
  ) {
    SendOtp(
      country_code: $country_code
      mobile_number: $mobile_number
      email: $email
    ) {
      SF_ID
      customer_exist
      isForcedLogIn
      message
      status_code
    }
  }
`;

export const GENERATE_BOOKING_LOGIN_OTP_QUERY = gql`
  mutation SendOtp(
    $country_code: String!
    $username: String!
    $source: String!
    $email: String!
    $isForcedLogIn: Boolean!
  ) {
    SendOtp(
      country_code: $country_code
      username: $username
      source: $source
      email: $email
      isForcedLogIn: $isForcedLogIn
    ) {
      SF_ID
      status_code
      customer_exist
      isForcedLogIn
      message
    }
  }
`;

export const GENERATE_BOOKING_REGISTER_OTP_QUERY = gql`
  mutation SendOtp(
    $country_code: String!
    $mobile_number: String!
    $email: String!
    $source: String!
    $isForcedLogIn: Boolean!
  ) {
    SendOtp(
      country_code: $country_code
      mobile_number: $mobile_number
      email: $email
      source: $source
      isForcedLogIn: $isForcedLogIn
    ) {
      SF_ID
      status_code
      customer_exist
      isForcedLogIn
      message
    }
  }
`;

export const GENERATE_WEB_POPUP_REGISTER_OTP_QUERY = gql`
  mutation SendOtp(
    $country_code: String!
    $mobile_number: String!
    $is_login: Boolean!
    $email: String!
    $sub_source: String!
  ) {
    SendOtp(
      country_code: $country_code
      mobile_number: $mobile_number
      is_login: $is_login
      email: $email
      sub_source: $sub_source
    ) {
      SF_ID
      status_code
      customer_exist
      isForcedLogIn
      message
    }
  }
`;

// export const VERIFY_WEB_POPUP_OTP_QUERY = gql`
// mutation VerifyOtp(
//   $SF_ID: String!
//     $otp: String!
//     $fname: String!
//     $lname: String!
//     $email: String!
//     $country_code: String!
//     $mobile_number: String!
//     $customer_city: String
//     $customer_state: String
//     $customer_country: String
//     $is_login: Boolean
//     $pinNo: String
//     $whatsapp_consent: Boolean
//     $utm_params: UtmParamsTypes
//     $sub_source: String!
// )`;

export const VERIFY_BOOKING_LOGIN_OTP_QUERY = gql`
  mutation VerifyOtp(
    $SF_ID: String!
    $otp: String!
    $username: String!
    $country_code: String!
    $is_login: Boolean!
    $intrested_in_prebooking: Boolean
    $intrested_in_testride: Boolean
    $customer_city: String
    $customer_state: String
    $customer_country: String
    $customer_pincode: String
    $whatsapp_consent: Boolean
    $customer_exist: Boolean
    $utm_params: UtmParamsTypes
  ) {
    VerifyOtp(
      SF_ID: $SF_ID
      otp: $otp
      username: $username
      country_code: $country_code
      is_login: $is_login
      intrested_in_prebooking: $intrested_in_prebooking
      intrested_in_testride: $intrested_in_testride
      customer_city: $customer_city
      customer_state: $customer_state
      customer_country: $customer_country
      whatsapp_consent: $whatsapp_consent
      customer_pincode: $customer_pincode
      customer_exist: $customer_exist
      utm_params: $utm_params
    ) {
      token
      status_code
      customer_id
      lead_id
      account_id
      message
      sf_customer_number
    }
  }
`;

export const VERIFY_BOOKING_REGISTER_OTP_QUERY = gql`
  mutation VerifyOtp(
    $SF_ID: String!
    $otp: String!
    $fname: String!
    $lname: String!
    $email: String!
    $country_code: String!
    $mobile_number: String!
    $is_login: Boolean!
    $intrested_in_prebooking: Boolean
    $intrested_in_testride: Boolean
    $customer_city: String
    $customer_state: String
    $customer_country: String
    $customer_pincode: String
    $whatsapp_consent: Boolean
    $customer_exist: Boolean
    $utm_params: UtmParamsTypes
  ) {
    VerifyOtp(
      SF_ID: $SF_ID
      otp: $otp
      fname: $fname
      lname: $lname
      email: $email
      country_code: $country_code
      mobile_number: $mobile_number
      is_login: $is_login
      intrested_in_prebooking: $intrested_in_prebooking
      intrested_in_testride: $intrested_in_testride
      customer_city: $customer_city
      customer_state: $customer_state
      customer_country: $customer_country
      whatsapp_consent: $whatsapp_consent
      customer_pincode: $customer_pincode
      customer_exist: $customer_exist
      utm_params: $utm_params
    ) {
      token
      status_code
      customer_id
      lead_id
      account_id
      message
      sf_customer_number
    }
  }
`;

export const VERIFY_LOGIN_OTP_QUERY = gql`
  mutation VerifyOtp(
    $SF_ID: String!
    $otp: String!
    $country_code: String!
    $is_login: Boolean
    $username: String!
    $pinNo: String
    $customer_city: String
    $customer_state: String
    $customer_country: String
    $utm_params: UtmParamsTypes
  ) {
    VerifyOtp(
      SF_ID: $SF_ID
      otp: $otp
      country_code: $country_code
      username: $username
      is_login: $is_login
      pinNo: $pinNo
      customer_city: $customer_city
      customer_state: $customer_state
      customer_country: $customer_country
      utm_params: $utm_params
    ) {
      token
      status_code
      customer_id
      lead_id
      account_id
      message
      pinNo
      sf_customer_number
    }
  }
`;
export const VERIFY_REGISTER_OTP_QUERY = gql`
  mutation VerifyOtp(
    $SF_ID: String!
    $otp: String!
    $fname: String!
    $lname: String!
    $email: String!
    $country_code: String!
    $mobile_number: String!
    $customer_city: String
    $customer_state: String
    $customer_country: String
    $is_login: Boolean
    $pinNo: String
    $whatsapp_consent: Boolean
    $utm_params: UtmParamsTypes
    $sub_source: String!
  ) {
    VerifyOtp(
      SF_ID: $SF_ID
      otp: $otp
      fname: $fname
      lname: $lname
      email: $email
      country_code: $country_code
      mobile_number: $mobile_number
      customer_city: $customer_city
      customer_state: $customer_state
      customer_country: $customer_country
      is_login: $is_login
      pinNo: $pinNo
      whatsapp_consent: $whatsapp_consent
      utm_params: $utm_params
      sub_source: $sub_source
    ) {
      token
      status_code
      customer_id
      lead_id
      account_id
      message
      pinNo
      sf_customer_number
    }
  }
`;
export const LOGOUT_QUERY = gql`
  mutation {
    revokeCustomerToken {
      result
    }
  }
`;

export const GENERATE_TESTDRIVE_SEND_OTP_QUERY = gql`
  mutation SendOtp(
    $country_code: String!
    $mobile_number: String!
    $email: String!
    $is_login: Boolean!
    $source: String!
  ) {
    SendOtp(
      country_code: $country_code
      mobile_number: $mobile_number
      email: $email
      is_login: $is_login
      source: $source
    ) {
      SF_ID
      status_code
      message
      customer_exist
    }
  }
`;

export const VERIFY_TESTDRIVE_SEND_OTP_QUERY = gql`
  mutation VerifyOtp(
    $SF_ID: String!
    $is_login: Boolean!
    $fname: String!
    $lname: String!
    $email: String!
    $country_code: String!
    $mobile_number: String!
    $otp: String!
    $whatsapp_consent: Boolean
    $source: String!
    $customer_exist: Boolean!
    $utm_params: UtmParamsTypes
    $customer_city: String
    $customer_state: String
  ) {
    VerifyOtp(
      SF_ID: $SF_ID
      is_login: $is_login
      fname: $fname
      lname: $lname
      email: $email
      country_code: $country_code
      mobile_number: $mobile_number
      otp: $otp
      whatsapp_consent: $whatsapp_consent
      source: $source
      customer_exist: $customer_exist
      utm_params: $utm_params
      customer_city: $customer_city
      customer_state: $customer_state
    ) {
      token
      status_code
      customer_id
      lead_id
      account_id
      message
      sf_customer_number
    }
  }
`;
