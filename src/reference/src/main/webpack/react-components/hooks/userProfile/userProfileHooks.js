import apolloClient from "../../../services/graphql.service";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import {
  GET_USER_DATA_QUERY,
  GET_ELLIGIBLE_ADDRESS_UPDATE_QUERY,
  GET_PROFILE_PICTURE_QUERY,
  UPDATE_USER_DATA_QUERY,
  VERIFY_UPDATED_USER_DATA_QUERY,
  UPLOAD_PROFILE_IMAGE_QUERY,
  UPDATE_USER_DATA_FOR_NOTIFICATION_QUERY,
  GET_ALL_USER_TEST_RIDES_QUERY,
  GET_ALL_USER_LONG_TEST_RIDES_QUERY,
  CANCEL_USER_LONG_TEST_RIDES_QUERY,
  CANCEL_USER_TEST_RIDES_QUERY,
  CANCEL_USER_PRE_BOOKING_QUERY,
  GET_USER_ORDERS_QUERY,
  CANCEL_USER_ORDER,
  GET_ORDERS_INVOICE_QUERY,
  GET_ACTIVE_RESERVATION
} from "../../queries/userProfileQueries";
import {
  setUserProfileDataDispatcher,
  setElligibleAdressUpdateDispatcher
} from "../../store/userProfile/userProfileActions";
import { setUserTestRideDispatcher } from "../../store/userTestRide/userTestRideActions";
import { setUserLongTestRideDispatcher } from "../../store/userLongTestRide/userLongTestRideActions";
import {
  setUserPreBookingDispatcher,
  setUserOrdersDispatcher,
  setUserPurchaseButtonShowDispatcher,
  setUserPurchaseNoOrdersDispatcher
} from "../../store/userOrder/userOrderActions";
import { showNotificationDispatcher } from "../../store/notification/notificationActions";
import Logger from "../../../services/logger.service";
import appUtils from "../../../site/scripts/utils/appUtils";
import loginUtils from "../../../site/scripts/utils/loginUtils";
import CONSTANT from "../../../site/scripts/constant";
import { setSpinnerActionDispatcher } from "../../store/spinner/spinnerActions";

export const useUserData = () => {
  const loginUrl = appUtils.getPageUrl("loginUrl");
  const [getUserData] = useLazyQuery(GET_USER_DATA_QUERY, {
    client: apolloClient,
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      if (data && data.customer) {
        setUserProfileDataDispatcher(data.customer);
        //REF: Spinner false sets false to remaining API calls
        // setSpinnerActionDispatcher(false);
        loginUtils.setAdobeAnalyticsData(
          data.customer?.customer_primary_email,
          data.customer?.mobile_number,
          data?.customer?.customer_city,
          data?.customer?.customer_state,
          data?.customer?.customer_pincode,
          data?.customer?.customer_country
        );
      } else {
        //REF: Spinner false sets false to remaining API calls
        // setSpinnerActionDispatcher(false);
        loginUtils.removeSessionToken();
        if (loginUrl) {
          window.location.href = loginUrl;
        }
      }
    },
    onError: () => {
      setSpinnerActionDispatcher(false);
      loginUtils.removeSessionToken();
      if (loginUrl) {
        window.location.href = loginUrl;
      }
    }
  });
  return getUserData;
};

export const useElligibleAddressUpdate = () => {
  const [getElligibleAddressUpdate] = useLazyQuery(
    GET_ELLIGIBLE_ADDRESS_UPDATE_QUERY,
    {
      client: apolloClient,
      fetchPolicy: "no-cache",
      onCompleted: (data) => {
        if (data) {
          setElligibleAdressUpdateDispatcher(data.customer);
          setSpinnerActionDispatcher(false);
        } else {
          setSpinnerActionDispatcher(false);
        }
      },
      onError: () => {
        setSpinnerActionDispatcher(false);
      }
    }
  );
  return getElligibleAddressUpdate;
};

export const useUpdateProfile = (updateForNotification, showmsg = true) => {
  const [updateUserProfile] = useMutation(
    updateForNotification
      ? UPDATE_USER_DATA_FOR_NOTIFICATION_QUERY
      : UPDATE_USER_DATA_QUERY,
    {
      client: apolloClient,
      fetchPolicy: "no-cache",
      onCompleted: (data) => {
        // Condition added for Testride form submission
        if (showmsg) {
          showNotificationDispatcher({
            title: data.updateProfile.message,
            type: CONSTANT.NOTIFICATION_TYPES.SUCCESS,
            isVisible: true
          });
        }
        setSpinnerActionDispatcher(false);
      },
      onError: (error) => {
        setSpinnerActionDispatcher(false);
        Logger.error(error);
      }
    }
  );
  return updateUserProfile;
};

export const useVerifyUpdateProfile = () => {
  const [verifyUpdateUserProfile] = useMutation(
    VERIFY_UPDATED_USER_DATA_QUERY,
    {
      client: apolloClient,
      fetchPolicy: "no-cache",
      onCompleted: (data) => {
        showNotificationDispatcher({
          title: data.updateProfile.message,
          type: CONSTANT.NOTIFICATION_TYPES.SUCCESS,
          isVisible: true
        });
        setSpinnerActionDispatcher(false);
      },
      onError: (error) => {
        setSpinnerActionDispatcher(false);
        Logger.error(error);
      }
    }
  );
  return verifyUpdateUserProfile;
};

export const useUploadProfileImage = () => {
  const [uploadProfileImage] = useMutation(UPLOAD_PROFILE_IMAGE_QUERY, {
    client: apolloClient,
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      showNotificationDispatcher({
        title: data.uploadProfileImage.message,
        type: data.uploadProfileImage.status
          ? CONSTANT.NOTIFICATION_TYPES.SUCCESS
          : CONSTANT.NOTIFICATION_TYPES.ERROR,
        isVisible: true
      });
      setSpinnerActionDispatcher(false);
    },
    onError: (error) => {
      setSpinnerActionDispatcher(false);
      Logger.error(error);
    }
  });
  return uploadProfileImage;
};

export const useProfileImage = () => {
  const [getProfileImage] = useLazyQuery(GET_PROFILE_PICTURE_QUERY, {
    client: apolloClient,
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      if (data) {
        return data;
      }
      // else {
      //   loginUtils.removeSessionToken();
      //   if (loginUrl) {
      //     window.location.href = loginUrl;
      //   }
      // }
    },
    onError: () => {
      setSpinnerActionDispatcher(false);
      // loginUtils.removeSessionToken();
      // if (loginUrl) {
      //   window.location.href = loginUrl;
      // }
    }
  });
  return getProfileImage;
};

export const useAllUserTestRides = () => {
  const [getAllUserTestRides] = useLazyQuery(GET_ALL_USER_TEST_RIDES_QUERY, {
    client: apolloClient,
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      if (data && data.getAllTestRide) {
        setUserTestRideDispatcher(data.getAllTestRide);
        setSpinnerActionDispatcher(false);
      }
    },
    onError: (error) => {
      setSpinnerActionDispatcher(false);
      Logger.error(error);
    }
  });
  return getAllUserTestRides;
};

export const useAllUserLongTestRides = () => {
  const [getAllUserLongTestRides] = useLazyQuery(
    GET_ALL_USER_LONG_TEST_RIDES_QUERY,
    {
      client: apolloClient,
      fetchPolicy: "no-cache",
      onCompleted: (data) => {
        if (
          data &&
          data.GetRentalByAccount &&
          data.GetRentalByAccount.rentalRecord
        ) {
          setUserLongTestRideDispatcher(data.GetRentalByAccount.rentalRecord);
          setSpinnerActionDispatcher(false);
        }
      },
      onError: (error) => {
        setSpinnerActionDispatcher(false);

        Logger.error(error);
      }
    }
  );
  return getAllUserLongTestRides;
};

export const useCancelUserTestRide = () => {
  const [cancelTestDriveData] = useMutation(CANCEL_USER_TEST_RIDES_QUERY, {
    client: apolloClient,
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      showNotificationDispatcher({
        title: data.cancelTestDrive.message,
        type: CONSTANT.NOTIFICATION_TYPES.SUCCESS,
        isVisible: true
      });
      setSpinnerActionDispatcher(false);
      return data;
    },
    onError: (error) => {
      setSpinnerActionDispatcher(false);
      Logger.error(error);
    }
  });
  return cancelTestDriveData;
};

export const useCancelUserLongTestRide = () => {
  const [cancelLongTestDriveData] = useMutation(
    CANCEL_USER_LONG_TEST_RIDES_QUERY,
    {
      client: apolloClient,
      fetchPolicy: "no-cache",
      onCompleted: (data) => {
        setSpinnerActionDispatcher(false);
        return data;
      },
      onError: (error) => {
        setSpinnerActionDispatcher(false);
        Logger.error(error);
      }
    }
  );
  return cancelLongTestDriveData;
};

export const useUserOrders = () => {
  const [getUserOrders] = useLazyQuery(GET_USER_ORDERS_QUERY, {
    client: apolloClient,
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      setSpinnerActionDispatcher(false);
      if (data && data.getAllSfOrders) {
        if (data.getAllSfOrders.items.length) {
          const preBookingData =
            data.getAllSfOrders.items[0].preBookCollectionData;
          preBookingData && setUserPreBookingDispatcher(preBookingData);

          const orderData = data.getAllSfOrders.items[0].orderCollectionData;

          if (!preBookingData && !orderData) {
            setUserPurchaseNoOrdersDispatcher(true);
          }

          orderData && setUserOrdersDispatcher(orderData);

          const showPurchaseButton =
            data.getAllSfOrders.items[0].show_purchase_btn;
          showPurchaseButton &&
            setUserPurchaseButtonShowDispatcher(showPurchaseButton);
        } else {
          setUserPurchaseNoOrdersDispatcher(true);
        }
      } else {
        setUserPurchaseNoOrdersDispatcher(true);
      }
    },
    onError: (error) => {
      setSpinnerActionDispatcher(false);
      Logger.error(error);
    }
  });
  return getUserOrders;
};

export const useCancelPreBooking = () => {
  const [cancelPreBookingData] = useMutation(CANCEL_USER_PRE_BOOKING_QUERY, {
    client: apolloClient,
    fetchPolicy: "no-cache",
    onCompleted: () => {
      setSpinnerActionDispatcher(false);
    },
    onError: (error) => {
      setSpinnerActionDispatcher(false);
      Logger.error(error);
    }
  });
  return cancelPreBookingData;
};

export const useCancelOrder = () => {
  const [cancelOrderData] = useMutation(CANCEL_USER_ORDER, {
    client: apolloClient,
    fetchPolicy: "no-cache",
    onCompleted: () => {
      setSpinnerActionDispatcher(false);
    },
    onError: (error) => {
      setSpinnerActionDispatcher(false);
      Logger.error(error);
    }
  });
  return cancelOrderData;
};

export const useOrderInvoice = () => {
  const [orderInvoiceData] = useLazyQuery(GET_ORDERS_INVOICE_QUERY, {
    client: apolloClient,
    fetchPolicy: "no-cache",
    onCompleted: () => {
      setSpinnerActionDispatcher(false);
    },
    onError: (error) => {
      setSpinnerActionDispatcher(false);
      Logger.error(error);
    }
  });
  return orderInvoiceData;
};

export const useCheckActiveReservation = () => {
  const [activeReservationData] = useLazyQuery(GET_ACTIVE_RESERVATION, {
    client: apolloClient,
    fetchPolicy: "no-cache",
    onCompleted: () => {
      setSpinnerActionDispatcher(false);
    },
    onError: (error) => {
      setSpinnerActionDispatcher(false);
      Logger.error(error);
    }
  });
  return activeReservationData;
};
