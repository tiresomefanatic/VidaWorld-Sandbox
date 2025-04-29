import apolloClient from "../../../services/graphql.service";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import {
  GET_PRICE_BY_EXCHANGE,
  CREATE_ORDER_QUERY,
  GET_ORDER_QUERY,
  GET_OPTIMIZED_ORDER_QUERY,
  GET_STOCK_AVAILABILITY,
  UPDATE_ORDER_DATA,
  GET_GST_DETAILS_QUERY,
  GET_INSURANCE_QUOTATION_QUERY,
  UPDATE_ORDER_ADDRESS_DATA,
  AUTOVERT_QUERY,
  SUBSCRIPTION_PLAN_QUERY,
  GET_AADHAR_VERIFIED,
  CREATE_AADHAR_VERIFICATION,
  VERIFY_SIGNZY_VERIFICATION,
  UPDATE_OPTIMIZED_ORDER_QUERY,
  EXCHANGE_AGREED_QUERY,
  UPDATE_ORDER_DISCOUNT,
  GET_DISCOUNT_OFFERS
} from "../../queries/purchaseConfigQueries";
import {
  setOrderDataDispatcher,
  setTradeInDataDispatcher,
  setAadharVerifiedDispatcher
} from "../../store/purchaseConfig/purchaseConfigActions";
import Logger from "../../../services/logger.service";
import { setSpinnerActionDispatcher } from "../../store/spinner/spinnerActions";

export const useGetPriceByExchange = () => {
  const [getExchangePrice] = useMutation(GET_PRICE_BY_EXCHANGE, {
    client: apolloClient,
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      setSpinnerActionDispatcher(false);
      if (data && data.getPriceByExchangeData.status_code !== 200) {
        Logger.error(data.getPriceByExchangeData.message);
      }
    },
    onError: (error) => {
      setSpinnerActionDispatcher(false);
      Logger.error(error);
    }
  });

  return getExchangePrice;
};

export const useCreateOrder = () => {
  const [getCreateOrderData] = useMutation(CREATE_ORDER_QUERY, {
    client: apolloClient,
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      setSpinnerActionDispatcher(false);
      if (data && data.CreateSaleOrder.status_code !== 200) {
        Logger.error(data.CreateSaleOrder.message);
      }
    },
    onError: (error) => {
      setSpinnerActionDispatcher(false);
      Logger.error(error);
    }
  });

  return getCreateOrderData;
};

export const useGetStockAvailability = () => {
  const [getStockAvailability] = useLazyQuery(GET_STOCK_AVAILABILITY, {
    client: apolloClient,
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      setSpinnerActionDispatcher(false);
      if (data && data.GetStockAvailabilityCheck.status_code !== 200) {
        Logger.error(data.GetStockAvailabilityCheck.message);
      }
    },
    onError: (error) => {
      setSpinnerActionDispatcher(false);
      Logger.error(error);
    }
  });

  return getStockAvailability;
};

export const useGetOrderData = () => {
  const [getOrderData] = useLazyQuery(GET_ORDER_QUERY, {
    client: apolloClient,
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      const addresses = data.GetSalesOrderDetails.addresses;
      const billing_address = addresses.find(
        (address) => address.address_type === "Billing Address"
      );
      const shipping_address = addresses.find(
        (address) => address.address_type === "Shipping Address"
      );
      const orderDetails = data.GetSalesOrderDetails;
      orderDetails["billing_address"] = billing_address;
      orderDetails["shipping_address"] = shipping_address;
      const { exchange_data, exchange_amount, exchange_selected } =
        data.GetSalesOrderDetails;
      Object.keys(exchange_data).forEach(
        (k) =>
          (exchange_data[k] = exchange_data[k] === null ? "" : exchange_data[k])
      );
      if (exchange_selected === "Y") {
        const tradeInProps = {
          ...exchange_data,
          tradeInSelected: exchange_selected === "Y" ? true : false,
          exchange_amount
        };
        setTradeInDataDispatcher(tradeInProps);
      }

      setOrderDataDispatcher(orderDetails);
      setSpinnerActionDispatcher(false);
    },
    onError: (error) => {
      setSpinnerActionDispatcher(false);
      Logger.error(error);
    }
  });
  return getOrderData;
};

export const useOptimizedGetOrderData = () => {
  const [getOrderData] = useLazyQuery(GET_OPTIMIZED_ORDER_QUERY, {
    client: apolloClient,
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      const addresses = data.OpGetSaleOrderDetails.addresses;
      const billing_address = addresses.find(
        (address) => address.address_type === "Billing Address"
      );
      const shipping_address = addresses.find(
        (address) => address.address_type === "Shipping Address"
      );
      const orderDetails = data.OpGetSaleOrderDetails;
      orderDetails["billing_address"] = billing_address;
      orderDetails["shipping_address"] = shipping_address;
      const {
        exchange_data,
        exchange_amount,
        exchange_selected,
        exchange_approved
      } = data.OpGetSaleOrderDetails;
      Object.keys(exchange_data).forEach(
        (k) =>
          (exchange_data[k] = exchange_data[k] === null ? "" : exchange_data[k])
      );
      if (exchange_selected === "Y") {
        const tradeInProps = {
          ...exchange_data,
          tradeInSelected: exchange_selected === "Y" ? true : false,
          exchange_amount,
          exchange_approved
        };
        setTradeInDataDispatcher(tradeInProps);
      }
      setOrderDataDispatcher(orderDetails);
      setSpinnerActionDispatcher(false);
    },
    onError: (error) => {
      setSpinnerActionDispatcher(false);
      Logger.error(error);
    }
  });
  return getOrderData;
};

export const useGetAadharVerified = (setVerifyCheckDone) => {
  const [getAadharVerified] = useLazyQuery(GET_AADHAR_VERIFIED, {
    client: apolloClient,
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      setSpinnerActionDispatcher(false);
      if (
        data &&
        data.OpGetAadhaarVerifyStatus &&
        data.OpGetAadhaarVerifyStatus.aadhaar_verified
      ) {
        setAadharVerifiedDispatcher(true);
      }
      setVerifyCheckDone(true);
    },
    onError: (error) => {
      setSpinnerActionDispatcher(false);
      Logger.error(error);
    }
  });

  return getAadharVerified;
};

export const useCreateAadharVerification = () => {
  const [generateAadhaarVerificationUrl] = useMutation(
    CREATE_AADHAR_VERIFICATION,
    {
      client: apolloClient,
      fetchPolicy: "no-cache",
      onCompleted: (data) => {
        setSpinnerActionDispatcher(false);
      },
      onError: (error) => {
        setSpinnerActionDispatcher(false);
        Logger.error(error);
      }
    }
  );

  return generateAadhaarVerificationUrl;
};

export const useVerifySignzyValue = () => {
  const [opUpdateAadharStatus] = useMutation(VERIFY_SIGNZY_VERIFICATION, {
    client: apolloClient,
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      setSpinnerActionDispatcher(false);
    },
    onError: (error) => {
      setSpinnerActionDispatcher(false);
      Logger.error(error);
    }
  });

  return opUpdateAadharStatus;
};

export const useUpdateOrder = () => {
  const [getUpdateOrderData] = useMutation(UPDATE_ORDER_DATA, {
    client: apolloClient,
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      setSpinnerActionDispatcher(false);
      if (data && data.updateSaleOrder.status_code !== 200) {
        Logger.error(data.updateSaleOrder.message);
      }
    },
    onError: (error) => {
      setSpinnerActionDispatcher(false);
      Logger.error(error);
    }
  });

  return getUpdateOrderData;
};

export const useUpdateOptimizedOrder = () => {
  const [getUpdateOptimizedOrderData] = useMutation(
    UPDATE_OPTIMIZED_ORDER_QUERY,
    {
      client: apolloClient,
      fetchPolicy: "no-cache",
      onCompleted: (data) => {
        setSpinnerActionDispatcher(false);
        if (
          data &&
          data.opUpdateSaleOrder.status_code !== "200" &&
          data.opUpdateSaleOrder.status_code !== "LOAN_PENDING"
        ) {
          Logger.error(data.updateSaleOrder.message);
        }
      },
      onError: (error) => {
        setSpinnerActionDispatcher(false);
        Logger.error(error);
      }
    }
  );

  return getUpdateOptimizedOrderData;
};

export const useInsuranceData = () => {
  const [getInsuranceData] = useLazyQuery(GET_INSURANCE_QUOTATION_QUERY, {
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
  return getInsuranceData;
};

export const useVerifyGST = () => {
  const [gstData] = useLazyQuery(GET_GST_DETAILS_QUERY, {
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
  return gstData;
};

export const useUpdateAddressData = () => {
  const [getUpdateAddressData] = useMutation(UPDATE_ORDER_ADDRESS_DATA, {
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

  return getUpdateAddressData;
};

export const useAutovert = () => {
  const [autovertData] = useLazyQuery(AUTOVERT_QUERY, {
    client: apolloClient,
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      console.log("autovert", data);
    },
    onError: (error) => {
      Logger.error(error);
    }
  });
  return autovertData;
};

export const useSubscriptionPlan = () => {
  const [subscriptionPlantData] = useLazyQuery(SUBSCRIPTION_PLAN_QUERY, {
    client: apolloClient,
    fetchPolicy: "no-cache",
    onCompleted: () => {
      setSpinnerActionDispatcher(false);
    },
    onError: (error) => {
      Logger.error(error);
    }
  });
  return subscriptionPlantData;
};

export const useExchangeAgreed = () => {
  //setSpinnerActionDispatcher(true);

  const [exchangeAgreed] = useMutation(EXCHANGE_AGREED_QUERY, {
    client: apolloClient,
    fetchPolicy: "no-cache",
    onCompleted: () => {
      setSpinnerActionDispatcher(false);
    },
    onError: (error) => {
      Logger.error(error);
    }
  });
  return exchangeAgreed;
};

export const useGetDiscountData = () => {
  const [discountData] = useLazyQuery(GET_DISCOUNT_OFFERS, {
    client: apolloClient,
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      // console.log(data);
    },
    onError: (error) => {
      Logger.error(error);
    }
  });
  return discountData;
};

export const useUpdateDiscountData = () => {
  const [updatedDiscountData] = useMutation(UPDATE_ORDER_DISCOUNT, {
    client: apolloClient,
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      // console.log(data);
    },
    onError: (error) => {
      Logger.error(error);
    }
  });
  return updatedDiscountData;
};
