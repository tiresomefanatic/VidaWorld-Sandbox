import apolloClient from "../../../services/graphql.service";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import {
  GET_NOMINEE_DETAILS,
  UPDATE_NOMINEE_DETAILS
} from "../../queries/nomineeDetailsQueries";
import { setSpinnerActionDispatcher } from "../../store/spinner/spinnerActions";
import Logger from "../../../services/logger.service";

export const useGetNomineeDetails = () => {
  const [getNomineeDetails] = useLazyQuery(GET_NOMINEE_DETAILS, {
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
  return getNomineeDetails;
};

export const useUpdateNomineeDetails = () => {
  const [updatedNomineeDetails] = useMutation(UPDATE_NOMINEE_DETAILS, {
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
  return updatedNomineeDetails;
};
