import apolloClient from "../../../../services/graphql.service";
import { useMutation } from "@apollo/react-hooks";
import {
  UPLOAD_TEST_DRIVE_EMERGENCY_DETAILS_QUERY,
  GET_SIGNED_URL_QUERY
} from "../../../queries/testDriveUploadDocumentQueries";
import Logger from "../../../../services/logger.service";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";

export const useUpdateEmergencyDetails = () => {
  const [setEmergencyDetails] = useMutation(
    UPLOAD_TEST_DRIVE_EMERGENCY_DETAILS_QUERY,
    {
      client: apolloClient,
      fetchPolicy: "no-cache",
      onCompleted: (data) => {
        setSpinnerActionDispatcher(false);
        if (data) {
          return data;
        }
      },
      onError: (error) => {
        setSpinnerActionDispatcher(false);
        Logger.error(error);
      }
    }
  );
  return setEmergencyDetails;
};
export const useSignedURL = () => {
  const [setSignedURL] = useMutation(GET_SIGNED_URL_QUERY, {
    client: apolloClient,
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      setSpinnerActionDispatcher(false);
      if (data) {
        return data;
      }
    },
    onError: (error) => {
      setSpinnerActionDispatcher(false);
      Logger.error(error);
    }
  });
  return setSignedURL;
};
