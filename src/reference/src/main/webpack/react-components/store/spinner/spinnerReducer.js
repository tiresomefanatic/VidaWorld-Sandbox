import { LOADING_COMPLETE, LOADING_IN_PROGRESS } from "./spinnerTypes";

const initialState = {
  loading: null
};

/* Spinner Reducer */
export default function spinnerReducer(state = initialState, action) {
  switch (action.type) {
    case LOADING_COMPLETE:
      return {
        ...state,
        loading: false
      };
    case LOADING_IN_PROGRESS:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}
