import Store from "../store";
import {
  ORDER_DATA,
  SELECTED_POLICY_DATA,
  UPDATED_POLICY_DATA,
  RESET_ADDON_DATA,
  HOME_DELIVERY_SELECTED,
  SET_CPA_OPTED,
  RESET_SELECTED_POLICY_DATA,
  AADHAR_DATA,
  UNCHECK_AADHAR_SELECT,
  GST_DATA,
  RESET_GST_DATA,
  PAYMENT_DATA,
  SUBSCRIPTION_DATA,
  TRADE_IN_DATA,
  CLEAR_TRADE_IN_DATA,
  AADHAR_VERIFIED,
  ADDRESS_DATA,
  RESET_INDIVIDUAL_ADDRESS_DATA,
  OFFER_DATA
} from "./purchaseConfigTypes";

/* Order Data Action */
export const setOrderDataAction = (orderData) => {
  return {
    type: ORDER_DATA,
    payload: orderData
  };
};

export const setOrderDataDispatcher = (orderData) => {
  Store.dispatch(setOrderDataAction(orderData));
};

export const setSelectedPolicyDataAction = (selectedPolicyData) => {
  return {
    type: SELECTED_POLICY_DATA,
    payload: selectedPolicyData
  };
};

export const setSelectedPolicyDataDispatcher = (selectedPolicyData) => {
  Store.dispatch(setSelectedPolicyDataAction(selectedPolicyData));
};

export const setUpdatedPolicyDataAction = (updatedPolicyData) => {
  return {
    type: UPDATED_POLICY_DATA,
    payload: updatedPolicyData
  };
};

export const setUpdatedPolicyDataDispatcher = (updatedPolicyData) => {
  Store.dispatch(setUpdatedPolicyDataAction(updatedPolicyData));
};

export const setResetAddonDataAction = () => {
  return {
    type: RESET_ADDON_DATA
  };
};

export const setResetAddonDataDispatcher = () => {
  Store.dispatch(setResetAddonDataAction());
};

export const setHomeDeliveryDataAction = (homeDeliveryData) => {
  return {
    type: HOME_DELIVERY_SELECTED,
    payload: homeDeliveryData
  };
};

export const setHomeDeliveryDataDispatcher = (homeDeliveryData) => {
  Store.dispatch(setHomeDeliveryDataAction(homeDeliveryData));
};

export const setCpaOptedAction = (cpaOptedData) => {
  return {
    type: SET_CPA_OPTED,
    payload: cpaOptedData
  };
};

export const setCpaOptedDataDispatcher = (cpaOptedData) => {
  Store.dispatch(setCpaOptedAction(cpaOptedData));
};

export const setResetSelectedPolicyDataAction = () => {
  return {
    type: RESET_SELECTED_POLICY_DATA
  };
};

export const setResetSelectedPolicyDataDispatcher = () => {
  Store.dispatch(setResetSelectedPolicyDataAction());
};

/* Purchase Config aadhar Data Action */
export const setAadharDataAction = (aadharData) => {
  return {
    type: AADHAR_DATA,
    payload: aadharData
  };
};

export const setAadharDataDispatcher = (aadharData) => {
  Store.dispatch(setAadharDataAction(aadharData));
};

export const setUncheckAaadharSelectAction = () => {
  return {
    type: UNCHECK_AADHAR_SELECT
  };
};

export const setUncheckAaadharSelectDispatcher = () => {
  Store.dispatch(setUncheckAaadharSelectAction());
};

/* Purchase Config GST Data Action */
export const setGstDataAction = (gstData) => {
  return {
    type: GST_DATA,
    payload: gstData
  };
};

export const setGstDataDispatcher = (gstData) => {
  Store.dispatch(setGstDataAction(gstData));
};

export const setResetGSTDataAction = () => {
  return {
    type: RESET_GST_DATA
  };
};

export const setResetGSTDataDispatcher = () => {
  Store.dispatch(setResetGSTDataAction());
};

/* Purchase Config GST Data Action */
export const setAddressDataAction = (addressData) => {
  return {
    type: ADDRESS_DATA,
    payload: addressData
  };
};

export const setAddressDataDispatcher = (addressData) => {
  Store.dispatch(setAddressDataAction(addressData));
};

export const setResetIndividualAddressAction = () => {
  return {
    type: RESET_INDIVIDUAL_ADDRESS_DATA
  };
};

export const setResetIndividualAddressDispatcher = () => {
  Store.dispatch(setResetIndividualAddressAction());
};

/* Purchase Config Payment Data Action */
export const setPaymentDataAction = (paymentData) => {
  return {
    type: PAYMENT_DATA,
    payload: paymentData
  };
};

export const setPaymentDataDispatcher = (paymentData) => {
  Store.dispatch(setPaymentDataAction(paymentData));
};

/** Set Subscription plan data dispatcher */
export const setSubscriptionDataAction = (subscriptionPlanData) => {
  return {
    type: SUBSCRIPTION_DATA,
    payload: subscriptionPlanData
  };
};

export const setSubscriptionDataDispatcher = (subscriptionPlanData) => {
  Store.dispatch(setSubscriptionDataAction(subscriptionPlanData));
};

/** Set Subscription plan data dispatcher */
export const setTradeInDataAction = (tradeInData) => {
  return {
    type: TRADE_IN_DATA,
    payload: tradeInData
  };
};

export const setTradeInDataDispatcher = (tradeInData) => {
  Store.dispatch(setTradeInDataAction(tradeInData));
};
export const clearTradeInDataAction = () => {
  return {
    type: CLEAR_TRADE_IN_DATA
  };
};

export const clearTradeInDataDispatcher = () => {
  Store.dispatch(clearTradeInDataAction());
};

/* Order Data Action */
export const setAadharVerifiedAction = (aadharVerified) => {
  return {
    type: AADHAR_VERIFIED,
    payload: aadharVerified
  };
};

export const setAadharVerifiedDispatcher = (aadharVerified) => {
  Store.dispatch(setAadharVerifiedAction(aadharVerified));
};

export const setOfferDataAction = (offerData) => {
  return {
    type: OFFER_DATA,
    payload: offerData
  };
};

export const setOfferDataDispatcher = (offerData) => {
  Store.dispatch(setOfferDataAction(offerData));
};
