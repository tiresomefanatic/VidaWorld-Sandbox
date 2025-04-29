import apolloClient from "../../../services/graphql.service";
import { useMutation } from "@apollo/react-hooks";
import { MAKE_PAYMENT_QUICK_RESERVE_QUERY } from "../../queries/quickReserveQueries";
import Logger from "../../../services/logger.service";
import { setSpinnerActionDispatcher } from "../../store/spinner/spinnerActions";

export const useQuickReservePayment = () => {
  const [quickReservePayment] = useMutation(MAKE_PAYMENT_QUICK_RESERVE_QUERY, {
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
  return quickReservePayment;
};
