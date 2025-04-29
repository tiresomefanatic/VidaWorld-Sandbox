import apolloClient from "../../../services/graphql.service";
import { useLazyQuery } from "@apollo/react-hooks";
import { GET_LOAN_DETAILS } from "../../queries/emiCalculatorQueries";
import { setSpinnerActionDispatcher } from "../../store/spinner/spinnerActions";
import Logger from "../../../services/logger.service";

export const useGetLoanDetails = () => {
  const [loanDetails] = useLazyQuery(GET_LOAN_DETAILS, {
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
  return loanDetails;
};
