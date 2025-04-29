import apolloClient from "../../../services/graphql.service";
import { useMutation } from "@apollo/react-hooks";
import {
  CREATE_LOAN_LEASE_PAYMENT_QUERY,
  CANCEL_LOAN_LEASE_PAYMENT_QUERY
} from "../../queries/createLoanLeasePaymentQueries";
import { setSpinnerActionDispatcher } from "../../store/spinner/spinnerActions";
import Logger from "../../../services/logger.service";

export const useLoanLeasePaymentInfo = () => {
  const [getLoanLeasePaymentInfo] = useMutation(
    CREATE_LOAN_LEASE_PAYMENT_QUERY,
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
  return getLoanLeasePaymentInfo;
};

export const useCancelLoanLeasePaymentInfo = () => {
  const [getCancelLoanLeasePaymentInfo] = useMutation(
    CANCEL_LOAN_LEASE_PAYMENT_QUERY,
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
  return getCancelLoanLeasePaymentInfo;
};
