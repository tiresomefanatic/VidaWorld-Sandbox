import {
  USER_PROFILE_DATA,
  UPLOAD_PROFILE_IMAGE,
  ELLIGIBLE_ADDRESS_UPDATE
} from "./userProfileTypes";

const initialState = {
  fname: "",
  lname: "",
  code: "",
  number: "",
  email: "",
  country: "",
  state: "",
  city: "",
  pincode: "",
  isEligibleForAddressUpdate: false,
  profile_pic: "",
  email_verified: false,
  customer_number: ""
};

/* User Data Reducer */
export default function userProfileDataReducer(state = initialState, action) {
  switch (action.type) {
    case USER_PROFILE_DATA:
      return {
        ...state,
        fname: action.payload.firstname,
        lname: action.payload.lastname,
        code: action.payload.country_code,
        number: action.payload.mobile_number,
        email: action.payload.customer_primary_email,
        country: action.payload.customer_country,
        state: action.payload.customer_state,
        city: action.payload.customer_city,
        pincode: action.payload.customer_pincode,
        profile_pic: action.payload.profile_pic,
        email_verified: action.payload.email_verified,
        customer_number: action.payload.sf_customer_number
      };
    case UPLOAD_PROFILE_IMAGE:
      return {
        ...state,
        profile_pic: action.payload
      };
    case ELLIGIBLE_ADDRESS_UPDATE:
      return {
        ...state,
        isEligibleForAddressUpdate: action.payload.isEligibleForAddressUpdate
      };
    default:
      return state;
  }
}
