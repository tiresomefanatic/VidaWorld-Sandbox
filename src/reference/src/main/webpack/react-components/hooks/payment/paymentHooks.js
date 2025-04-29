import apolloClient from "../../../services/graphql.service";
import { useMutation } from "@apollo/react-hooks";
import {
  PREBOOKING_PAYMENT_QUERY,
  PREBOOKING_UPDATE_PAYMENT_QUERY,
  BOOKING_PAYMENT_QUERY,
  UPDATE_BOOKING_PAYMENT_QUERY,
  UPDATE_BOOKING_PAYMENT_WITH_ORDER_ID_QUERY,
  BOOKING_PARTIAL_PAYMENT_QUERY
} from "../../queries/paymentQueries";
import { setSpinnerActionDispatcher } from "../../store/spinner/spinnerActions";
import Logger from "../../../services/logger.service";

export const usePaymentInfo = () => {
  const [getPaymentInfo] = useMutation(PREBOOKING_PAYMENT_QUERY, {
    client: apolloClient,
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      setSpinnerActionDispatcher(false);
      if (data.createPayment) {
        return data;
      }
    },
    onError: (error) => {
      setSpinnerActionDispatcher(false);
      Logger.error(error);
    }
  });
  return getPaymentInfo;
};
export const useUpdatePaymentInfo = () => {
  const [getUpdatedPaymentInfo] = useMutation(PREBOOKING_UPDATE_PAYMENT_QUERY, {
    client: apolloClient,
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      setSpinnerActionDispatcher(false);
      if (data) {
        return data;
      }
    },
    onError: (error) => {
      setSpinnerActionDispatcher(false);
      Logger.error(error);
    }
  });
  return getUpdatedPaymentInfo;
};

export const useBookingPaymentInfo = () => {
  const [getBookingPaymentInfo] = useMutation(BOOKING_PAYMENT_QUERY, {
    client: apolloClient,
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      setSpinnerActionDispatcher(false);
      if (data.createPayment) {
        return data;
      }
    },
    onError: (error) => {
      setSpinnerActionDispatcher(false);
      Logger.error(error);
    }
  });
  return getBookingPaymentInfo;
};

export const useUpdateBookingPaymentInfo = (orderId) => {
  let QUERY = null;
  if (orderId) {
    QUERY = UPDATE_BOOKING_PAYMENT_WITH_ORDER_ID_QUERY;
  } else {
    QUERY = UPDATE_BOOKING_PAYMENT_QUERY;
  }
  if (QUERY) {
    const [getUpdatesBookingPaymentInfo] = useMutation(QUERY, {
      client: apolloClient,
      fetchPolicy: "no-cache",
      onCompleted: (data) => {
        setSpinnerActionDispatcher(false);
        if (data) {
          return data;
        }
      },
      onError: (error) => {
        setSpinnerActionDispatcher(false);
        Logger.error(error);
      }
    });
    return getUpdatesBookingPaymentInfo;
  }
};

export const useBookingPartialPaymentInfo = () => {
  const [getBookingPartialPaymentInfo] = useMutation(
    BOOKING_PARTIAL_PAYMENT_QUERY,
    {
      client: apolloClient,
      fetchPolicy: "no-cache",
      onCompleted: (data) => {
        setSpinnerActionDispatcher(false);
        if (data.createPayment) {
          return data;
        }
      },
      onError: (error) => {
        setSpinnerActionDispatcher(false);
        Logger.error(error);
      }
    }
  );
  return getBookingPartialPaymentInfo;
};
