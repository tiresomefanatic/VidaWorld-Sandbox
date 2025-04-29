import apolloClient from "../../../../services/graphql.service";
import { useMutation } from "@apollo/react-hooks";
import { UPDATE_PAYMENT_STATUS } from "../../../queries/testDriveStatusQueries";
import Logger from "../../../../services/logger.service";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";

export const useUpdatePaymentStatus = () => {
  const [getUpdatePaymentStatus] = useMutation(UPDATE_PAYMENT_STATUS, {
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
  return getUpdatePaymentStatus;
};
