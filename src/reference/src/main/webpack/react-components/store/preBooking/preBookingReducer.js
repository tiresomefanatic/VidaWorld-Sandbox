import { loadState } from "../../../site/scripts/utils/localStorageUtils";
import { PRE_BOOKING_DATA, PRE_BOOKING_USER_DATA } from "./preBookingTypes";

const persistedState = loadState()?.preBookingReducer;
const initialState = persistedState?.partnerId
  ? persistedState
  : {
      source: "prebooking",
      subscribe: false,
      pincode: "",
      branchId: "",
      partnerId: "",
      state: "",
      city: "",
      dealerName: "",
      dealerPhoneNumber: "",
      dealerAddress: "",
      type: "",
      latitude: "",
      longitude: ""
    };

export default function preBookingReducer(state = initialState, action) {
  switch (action.type) {
    case PRE_BOOKING_DATA:
      return {
        ...state,
        source: action.payload.source,
        subscribe: action.payload.subscribe
      };
    case PRE_BOOKING_USER_DATA:
      return {
        ...state,
        pincode: action.payload.pincode,
        branchId: action.payload.branchId,
        partnerId: action.payload.partnerId,
        state: action.payload.state,
        city: action.payload.city,
        dealerName: action.payload.dealerName,
        dealerPhoneNumber: action.payload.dealerPhoneNumber,
        dealerAddress: action.payload.dealerAddress,
        type: action.payload.type,
        latitude: action.payload.latitude,
        longitude: action.payload.longitude
      };
    default:
      return state;
  }
}
