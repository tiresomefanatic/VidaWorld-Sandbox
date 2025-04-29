import { SAMPLE_DATA, COUNTRY_LIST } from "./sampleTypes";

const initialState = {
  firstName: "",
  lastName: "",
  countries: []
};

/* User Info Reducer */
export default function sampleReducer(state = initialState, action) {
  switch (action.type) {
    case SAMPLE_DATA:
      return {
        ...state,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName
      };
    case COUNTRY_LIST:
      return {
        ...state,
        countries: action.payload
      };
    default:
      return state;
  }
}
