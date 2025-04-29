import Store from "../store";
import {
  TEST_DRIVE_DATA,
  TEST_DRIVE_TYPE_UNAVAILABLE,
  LONG_TERM_SELECTED_CITY_ID,
  SELECTED_PLACE,
  SELECTED_MAP_LOCATION,
  MODEL_VARIENT_LIST,
  NEARBY_VIDA_CENTRE_LIST,
  SERVICEABLE_PINCODE_LIST,
  NEARBY_BRANCHES_BY_PINCODE,
  BOOKING_DATES,
  RESET_BOOKING_DATES,
  BOOKING_DATES_DELIVERY,
  RESET_BOOKING_DATES_DELIVERY,
  RESET_BOOKING_TIME_SLOT,
  BOOKING_TIME_SLOT,
  PACKAGE_LIST,
  SUCCESSFUL_APPOINTMENT_DATA
} from "./testDriveTypes";

/* Test Drive Data Action */
export const setTestDriveDataAction = (testDriveData) => {
  return {
    type: TEST_DRIVE_DATA,
    payload: testDriveData
  };
};

export const setTestDriveDataDispatcher = (testDriveData) => {
  Store.dispatch(setTestDriveDataAction(testDriveData));
};

/* Test Drive Type Action */
export const setTestDriveTypeUnavailableAction = (testDriveTypeUnavailable) => {
  return {
    type: TEST_DRIVE_TYPE_UNAVAILABLE,
    payload: testDriveTypeUnavailable
  };
};

export const setTestDriveTypeUnavailableDispatcher = (
  testDriveTypeUnavailable
) => {
  Store.dispatch(setTestDriveTypeUnavailableAction(testDriveTypeUnavailable));
};

/* Long Term Test Drive selected city Id Action */
export const setLongTermSelectedCityIdAction = (selectedCityId) => {
  return {
    type: LONG_TERM_SELECTED_CITY_ID,
    payload: selectedCityId
  };
};

export const setLongTermSelectedCityIdDispatcher = (selectedCityId) => {
  Store.dispatch(setLongTermSelectedCityIdAction(selectedCityId));
};

/* Selected atrributes actions */
export const setTestDrivePlaceAction = (place) => {
  return {
    type: SELECTED_PLACE,
    payload: place
  };
};

export const setMapLocationAction = (mapLocation) => {
  return {
    type: SELECTED_MAP_LOCATION,
    payload: mapLocation
  };
};

/* Test Drive Model Variant List Action */
const setModelVariantListAction = (modelVariantList) => {
  return {
    type: MODEL_VARIENT_LIST,
    payload: modelVariantList
  };
};

export const setModelVariantListDispatcher = (modelVariantList) => {
  Store.dispatch(setModelVariantListAction(modelVariantList));
};

/* Test Drive Nearby Vida Centre List Action */
const setNearbyVidaCentreListAction = (nearbyVidaCentreList) => {
  return {
    type: NEARBY_VIDA_CENTRE_LIST,
    payload: nearbyVidaCentreList
  };
};

export const setNearbyVidaCentreListDispatcher = (nearbyVidaCentreList) => {
  Store.dispatch(setNearbyVidaCentreListAction(nearbyVidaCentreList));
};

/* Test Drive Serviceable Pincode List Action */
const setServiceablePincodesListAction = (serviceablePincodesList) => {
  return {
    type: SERVICEABLE_PINCODE_LIST,
    payload: serviceablePincodesList
  };
};

export const setServiceablePincodesListDispatcher = (
  serviceablePincodesList
) => {
  Store.dispatch(setServiceablePincodesListAction(serviceablePincodesList));
};

/* Test Drive Nearby Branches By Pincode Action */
const setNearbyBranchesByPincodeAction = (nearbyBranchesByPincode) => {
  return {
    type: NEARBY_BRANCHES_BY_PINCODE,
    payload: nearbyBranchesByPincode
  };
};

export const setNearbyBranchesByPincodeDispatcher = (
  nearbyBranchesByPincode
) => {
  Store.dispatch(setNearbyBranchesByPincodeAction(nearbyBranchesByPincode));
};

/* Test Drive Date Action */
const setBookingDatesAction = (bookingDates) => {
  return {
    type: BOOKING_DATES,
    payload: bookingDates
  };
};

export const setBookingDatesDispatcher = (bookingDates) => {
  Store.dispatch(setBookingDatesAction(bookingDates));
};

const setBookingDatesForDeliveryAction = (bookingDates) => {
  return {
    type: BOOKING_DATES_DELIVERY,
    payload: bookingDates
  };
};

export const setBookingDatesForDeliveryDispatcher = (bookingDates) => {
  Store.dispatch(setBookingDatesForDeliveryAction(bookingDates));
};

/* Test Drive Reset Date Action */
const resetBookingDatesAction = () => {
  return {
    type: BOOKING_DATES_DELIVERY
  };
};

/* Test Drive Reset Date for Delivery Action */

export const resetBookingDatesDispatcher = () => {
  Store.dispatch(resetBookingDatesAction());
};

const resetBookingDatesForDeliveryAction = () => {
  return {
    type: RESET_BOOKING_DATES_DELIVERY
  };
};

export const resetBookingDatesForDeliveryDispatcher = () => {
  Store.dispatch(resetBookingDatesForDeliveryAction());
};

/* Test Drive Time Slot Action */
const setBookingTimeSlotAction = (bookingTimeSlots) => {
  return {
    type: BOOKING_TIME_SLOT,
    payload: bookingTimeSlots
  };
};

export const setBookingTimeSlotsDispatcher = (bookingTimeSlots) => {
  Store.dispatch(setBookingTimeSlotAction(bookingTimeSlots));
};

/* Test Drive Reset Time Slot Action */
const resetBookingTimeSlotAction = () => {
  return {
    type: RESET_BOOKING_TIME_SLOT
  };
};

export const resetBookingTimeSlotsDispatcher = () => {
  Store.dispatch(resetBookingTimeSlotAction());
};

/* Test Drive Successful Appointment Data Action */
const setSuccessAppointmentDataAction = (successAppointmentData) => {
  return {
    type: SUCCESSFUL_APPOINTMENT_DATA,
    payload: successAppointmentData
  };
};

export const setSuccessAppointmentDataDispatcher = (successAppointmentData) => {
  Store.dispatch(setSuccessAppointmentDataAction(successAppointmentData));
};

/* Test Drive Package List Action */
const setPackageListAction = (packageList) => {
  return {
    type: PACKAGE_LIST,
    payload: packageList
  };
};

export const setPackageListDispatcher = (packageList) => {
  Store.dispatch(setPackageListAction(packageList));
};
