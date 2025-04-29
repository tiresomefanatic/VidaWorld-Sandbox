import Store from "../store";
import { PRE_BOOKING_DATA, PRE_BOOKING_USER_DATA } from "./preBookingTypes";

/* Pre Booking Data Action */
export const setPreBookingDataAction = (preBookingData) => {
  return {
    type: PRE_BOOKING_DATA,
    payload: preBookingData
  };
};

export const setPreBookingDataDispatcher = (preBookingData) => {
  Store.dispatch(setPreBookingDataAction(preBookingData));
};

/* Pre Booking User Data Action */
export const setPreBookingUserDataAction = (preBookingData) => {
  return {
    type: PRE_BOOKING_USER_DATA,
    payload: preBookingData
  };
};

export const setPreBookingUserDataDispatcher = (preBookingData) => {
  Store.dispatch(setPreBookingUserDataAction(preBookingData));
};
