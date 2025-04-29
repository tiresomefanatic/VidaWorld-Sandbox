import apolloClient from "../../../../services/graphql.service";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import {
  GET_LONG_TERM_TEST_RIDE_DATA,
  GET_PAYMENT_DATA
} from "../../../queries/testDriveSummaryQueries";
import Logger from "../../../../services/logger.service";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";

export const useLongTermTestRideDetails = () => {
  const [getLongTermTestRideDetails] = useLazyQuery(
    GET_LONG_TERM_TEST_RIDE_DATA,
    {
      client: apolloClient,
      fetchPolicy: "no-cache",
      onCompleted: () => {
        setSpinnerActionDispatcher(false);
      },
      onError: (error) => {
        setSpinnerActionDispatcher(false);
        Logger.error(error);
      }
    }
  );
  return getLongTermTestRideDetails;
};

export const usePaymentURL = () => {
  const [getPaymentDetails] = useMutation(GET_PAYMENT_DATA, {
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
  return getPaymentDetails;
};
