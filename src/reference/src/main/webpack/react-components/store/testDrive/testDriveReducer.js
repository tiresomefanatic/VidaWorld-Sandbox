import {
  TEST_DRIVE_DATA,
  TEST_DRIVE_TYPE_UNAVAILABLE,
  LONG_TERM_SELECTED_CITY_ID,
  SELECTED_PLACE,
  SELECTED_MAP_LOCATION,
  MODEL_VARIENT_LIST,
  NEARBY_VIDA_CENTRE_LIST,
  SERVICEABLE_PINCODE_LIST,
  NEARBY_BRANCHES_BY_PINCODE,
  BOOKING_DATES,
  BOOKING_DATES_DELIVERY,
  BOOKING_TIME_SLOT,
  PACKAGE_LIST,
  RESET_BOOKING_DATES,
  RESET_BOOKING_DATES_DELIVERY,
  RESET_BOOKING_TIME_SLOT,
  SUCCESSFUL_APPOINTMENT_DATA
} from "./testDriveTypes";

const initialState = {
  /* Test Drive - Login Screen Selection Attributes */
  location: {
    serviceUnavailableFor: "",
    country: "",
    state: "",
    city: "",
    cityId: ""
  },
  subscribe: false,

  /* Test Drive - Form Selection Attributes */
  place: "",
  mapLocation: {
    lat: 0,
    lng: 0,
    address: "",
    pincode: ""
  },

  /* Test Drive - API Default Attribute */
  source: "testdrive",

  /* Test Drive - Dropdown List */
  modelVariantList: [],
  nearByVidaCentreList: [],
  serviceablePincodesList: {},
  nearbyBranchesByPincode: {},
  bookingDateList: [],
  bookingTimeSlotList: [],
  packageList: [],

  /* Test Drive - Summary */
  successfulTestDrive: {
    modelVarient: {},
    centre: {},
    address: "",
    date: "",
    time: ""
  }
};

/* Test Drive Data Reducer */
export default function testDriveReducer(state = initialState, action) {
  switch (action.type) {
    case TEST_DRIVE_DATA:
      return {
        ...state,
        location: action.payload.location,
        subscribe: action.payload.subscribe
      };
    case TEST_DRIVE_TYPE_UNAVAILABLE:
      return {
        ...state,
        location: {
          ...state.location,
          serviceUnavailableFor: action.payload.serviceUnavailableFor
        }
      };
    case LONG_TERM_SELECTED_CITY_ID:
      return {
        ...state,
        location: {
          ...state.location,
          cityId: action.payload.cityId
        }
      };
    case SELECTED_PLACE:
      return {
        ...state,
        place: action.payload
      };
    case SELECTED_MAP_LOCATION:
      return {
        ...state,
        mapLocation: action.payload
      };
    case MODEL_VARIENT_LIST:
      return {
        ...state,
        modelVariantList: action.payload
      };
    case NEARBY_VIDA_CENTRE_LIST:
      return {
        ...state,
        nearByVidaCentreList: action.payload
      };
    case SERVICEABLE_PINCODE_LIST:
      return {
        ...state,
        serviceablePincodesList: action.payload
      };
    case NEARBY_BRANCHES_BY_PINCODE:
      return {
        ...state,
        nearbyBranchesByPincode: action.payload
      };
    case RESET_BOOKING_DATES:
      return {
        ...state,
        bookingDateList: []
      };
    case BOOKING_DATES:
      return {
        ...state,
        bookingDateList: action.payload
      };
    case RESET_BOOKING_DATES_DELIVERY:
      return {
        ...state,
        bookingDateForDeliveryList: {}
      };
    case BOOKING_DATES_DELIVERY:
      return {
        ...state,
        bookingDateForDeliveryList: action.payload
      };
    case RESET_BOOKING_TIME_SLOT:
      return {
        ...state,
        bookingTimeSlotList: []
      };
    case BOOKING_TIME_SLOT:
      return {
        ...state,
        bookingTimeSlotList: action.payload
      };
    case PACKAGE_LIST:
      return {
        ...state,
        packageList: action.payload
      };
    case SUCCESSFUL_APPOINTMENT_DATA:
      return {
        ...state,
        successfulTestDrive: action.payload
      };
    default:
      return state;
  }
}
