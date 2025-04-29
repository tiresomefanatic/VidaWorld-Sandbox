import apolloClient from "../../../services/graphql.service";
import { useMutation } from "@apollo/react-hooks";
import { GET_EXCHANGE_INSPECTION_DETAILS } from "../../queries/exchangeInspectionQueries";
import { setSpinnerActionDispatcher } from "../../store/spinner/spinnerActions";
import Logger from "../../../services/logger.service";

export const useGetExchangeInspectionDetails = () => {
  const [getexchangeInspectionDetails] = useMutation(
    GET_EXCHANGE_INSPECTION_DETAILS,
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
  return getexchangeInspectionDetails;
};
