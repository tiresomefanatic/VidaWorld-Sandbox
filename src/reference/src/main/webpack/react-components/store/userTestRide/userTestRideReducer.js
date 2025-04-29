import { USER_TEST_RIDE_DATA } from "./userTestRideTypes";

const initialState = {
  items: null
};

/* User Test Ride Reducer */
export default function userTestRideReducer(state = initialState, action) {
  switch (action.type) {
    case USER_TEST_RIDE_DATA:
      return {
        ...state,
        items: action.payload.items
      };
    default:
      return state;
  }
}
