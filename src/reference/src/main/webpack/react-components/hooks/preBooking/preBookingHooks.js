import apolloClient, {
  apolloClientForGet
} from "../../../services/graphql.service";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import {
  BOOKING_GET_PINCODE_QUERY,
  GET_ALL_PRODUCTS_QUERY,
  PREBOOKING_CHANGE_VARIANT_QUERY
} from "../../queries/preBookingQueries";
import { setSpinnerActionDispatcher } from "../../store/spinner/spinnerActions";
import { showNotificationDispatcher } from "../../store/notification/notificationActions";
import CONSTANT from "../../../site/scripts/constant";
import Logger from "../../../services/logger.service";

export const usePincode = () => {
  const [getPincode] = useLazyQuery(BOOKING_GET_PINCODE_QUERY, {
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
  return getPincode;
};

export const useGetAllProducts = () => {
  const [allProducts] = useLazyQuery(GET_ALL_PRODUCTS_QUERY, {
    client: apolloClientForGet,
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      setSpinnerActionDispatcher(false);
      if (data.products) {
        return data.products;
      }
    },
    onError: (error) => {
      setSpinnerActionDispatcher(false);
      Logger.error(error);
    }
  });
  return allProducts;
};

export const useChangeVariant = () => {
  const [getChangeVariant] = useMutation(PREBOOKING_CHANGE_VARIANT_QUERY, {
    client: apolloClient,
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      setSpinnerActionDispatcher(false);
      if (
        data.changeProductVariant &&
        data.changeProductVariant.status === "200"
      ) {
        return data;
      } else {
        if (data.changeProductVariant && data.changeProductVariant.message) {
          showNotificationDispatcher({
            title: data.changeProductVariant.message,
            type: CONSTANT.NOTIFICATION_TYPES.ERROR,
            isVisible: true
          });
        }
      }
    },
    onError: (error) => {
      setSpinnerActionDispatcher(false);
      Logger.error(error);
    }
  });
  return getChangeVariant;
};
