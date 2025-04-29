import Store from "../store";
import { USER_TEST_RIDE_DATA } from "./userTestRideTypes";

/* User Test Ride Action */
const setUserTestRideAction = (userTestRideData) => {
  return {
    type: USER_TEST_RIDE_DATA,
    payload: userTestRideData
  };
};

export const setUserTestRideDispatcher = (userTestRideData) => {
  Store.dispatch(setUserTestRideAction(userTestRideData));
};
