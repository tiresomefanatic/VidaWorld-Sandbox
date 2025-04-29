import Store from "../store";
import {
  USER_PRE_BOOKING_DATA,
  USER_ORDER_DATA,
  USER_PURCHASE_BUTTON_SHOW,
  USER_PURCHASE_NO_ORDERS
} from "./userOrderTypes";

/* User Pre Booking Action */
const setUserPreBookingAction = (userPreBookingData) => {
  return {
    type: USER_PRE_BOOKING_DATA,
    payload: userPreBookingData
  };
};

export const setUserPreBookingDispatcher = (userPreBookingData) => {
  Store.dispatch(setUserPreBookingAction(userPreBookingData));
};

/* User Orders Action */
const setUserOrdersAction = (userOrderData) => {
  return {
    type: USER_ORDER_DATA,
    payload: userOrderData
  };
};

export const setUserOrdersDispatcher = (userOrderData) => {
  Store.dispatch(setUserOrdersAction(userOrderData));
};

/* User Purchsae button show */
const setUserPurchaseButtonShowAction = (userPurchaseButtonShow) => {
  return {
    type: USER_PURCHASE_BUTTON_SHOW,
    payload: userPurchaseButtonShow
  };
};

export const setUserPurchaseButtonShowDispatcher = (userPurchaseButtonShow) => {
  Store.dispatch(setUserPurchaseButtonShowAction(userPurchaseButtonShow));
};

/* No Orders found*/
const setNoOrdersAction = (userPurchaseNoOrders) => {
  return {
    type: USER_PURCHASE_NO_ORDERS,
    payload: userPurchaseNoOrders
  };
};

export const setUserPurchaseNoOrdersDispatcher = (userPurchaseNoOrders) => {
  Store.dispatch(setNoOrdersAction(userPurchaseNoOrders));
};
