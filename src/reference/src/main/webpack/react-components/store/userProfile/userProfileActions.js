import Store from "../store";
import {
  USER_PROFILE_DATA,
  UPLOAD_PROFILE_IMAGE,
  ELLIGIBLE_ADDRESS_UPDATE
} from "./userProfileTypes";

/* User Profile Data Action */
const setUserProfileDataAction = (userProfileData) => {
  return {
    type: USER_PROFILE_DATA,
    payload: userProfileData
  };
};

export const setUserProfileDataDispatcher = (userProfileData) => {
  Store.dispatch(setUserProfileDataAction(userProfileData));
};

/* Upload profile image */
const setUserImageAction = (userProfilePicture) => {
  return {
    type: UPLOAD_PROFILE_IMAGE,
    payload: userProfilePicture
  };
};

export const setUserImageDispatcher = (userProfilePicture) => {
  Store.dispatch(setUserImageAction(userProfilePicture));
};

/* Elligible Address Update */
const setElligibleAdressUpdateAction = (addressUpdate) => {
  return {
    type: ELLIGIBLE_ADDRESS_UPDATE,
    payload: addressUpdate
  };
};

export const setElligibleAdressUpdateDispatcher = (addressUpdate) => {
  Store.dispatch(setElligibleAdressUpdateAction(addressUpdate));
};
