import apolloClient from "../../../services/graphql.service";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import {
  VALIDATE_AADHAR,
  VALIDATE_AADHAR_STATUS
} from "../../queries/validateAadharQuery";
import Logger from "../../../services/logger.service";
import { setSpinnerActionDispatcher } from "../../store/spinner/spinnerActions";

export const useValidateAadhar = () => {
  const [aadharSignzyData] = useLazyQuery(VALIDATE_AADHAR, {
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
  return aadharSignzyData;
};

export const useValidateAadharStatus = () => {
  const [aadharValidationStatus] = useMutation(VALIDATE_AADHAR_STATUS, {
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
  return aadharValidationStatus;
};
