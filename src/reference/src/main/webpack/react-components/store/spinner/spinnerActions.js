import Store from "../store";
import { LOADING_COMPLETE, LOADING_IN_PROGRESS } from "./spinnerTypes";

/* Spinner Action */
export const setSpinnerAction = (loadingStatus) => {
  return {
    type: loadingStatus ? LOADING_IN_PROGRESS : LOADING_COMPLETE
  };
};

export const setSpinnerActionDispatcher = (loadingStatus) => {
  Store.dispatch(setSpinnerAction(loadingStatus));
};
