import Store from "../store";
import {
  USER_FORM_DATA,
  USER_CHECK,
  SFID,
  USER_STATUS
} from "./userAccessTypes";

/* User Data Action */
export const setUserFormDataAction = (userFormData) => {
  return {
    type: USER_FORM_DATA,
    payload: userFormData
  };
};

export const setUserFormDataActionDispatcher = (userFormData) => {
  Store.dispatch(setUserFormDataAction(userFormData));
};

/* User Check Action */
export const setUserCheckAction = (userCheckData) => {
  return {
    type: USER_CHECK,
    payload: userCheckData
  };
};

export const setUserCheckActionDispatcher = (userCheckData) => {
  Store.dispatch(setUserCheckAction(userCheckData));
};

/* SFID Action */
export const setSFIDAction = (sfid) => {
  return {
    type: SFID,
    payload: sfid
  };
};

export const setSFIDActionDispatcher = (sfid) => {
  Store.dispatch(setSFIDAction(sfid));
};

/* User Status Action */
export const setUserStatusAction = (status) => {
  return {
    type: USER_STATUS,
    payload: status
  };
};

export const setUserStatusActionDispatcher = (status) => {
  Store.dispatch(setUserStatusAction(status));
};
