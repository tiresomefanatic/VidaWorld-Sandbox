import Store from "../store";
import { USER_LONG_TEST_RIDE_DATA } from "./userLongTestRideTypes";

/* User Test Ride Action */
const setUserLongTestRideAction = (userLongTestRideData) => {
  return {
    type: USER_LONG_TEST_RIDE_DATA,
    payload: userLongTestRideData
  };
};

export const setUserLongTestRideDispatcher = (userLongTestRideData) => {
  Store.dispatch(setUserLongTestRideAction(userLongTestRideData));
};
