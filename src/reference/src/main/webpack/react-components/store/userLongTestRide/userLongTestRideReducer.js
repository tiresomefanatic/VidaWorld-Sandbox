import { USER_LONG_TEST_RIDE_DATA } from "./userLongTestRideTypes";

const initialState = {
  items: null
};

/* User Test Ride Reducer */
export default function userLongTestRideReducer(state = initialState, action) {
  switch (action.type) {
    case USER_LONG_TEST_RIDE_DATA:
      return {
        ...state,
        items: action.payload
      };
    default:
      return state;
  }
}
