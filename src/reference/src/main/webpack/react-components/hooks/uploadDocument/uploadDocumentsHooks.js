import apolloClient from "../../../services/graphql.service";
import { useMutation } from "@apollo/react-hooks";
import {
  UPLOAD_DOCUMENTS_QUERY,
  SUBMIT_DOCUMENTS_QUERY
} from "../../queries/uploadDocumentsQueries";
import Logger from "../../../services/logger.service";
export const useUploadDocuments = () => {
  const [setUploadDocuments] = useMutation(UPLOAD_DOCUMENTS_QUERY, {
    client: apolloClient,
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      if (data) {
        return data;
      }
    },
    onError: (error) => {
      Logger.error(error);
    }
  });
  return setUploadDocuments;
};
export const useSubmitDocuments = () => {
  const [setSubmitDocuments] = useMutation(SUBMIT_DOCUMENTS_QUERY, {
    client: apolloClient,
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      if (data) {
        return data;
      }
    },
    onError: (error) => {
      Logger.error(error);
    }
  });
  return setSubmitDocuments;
};
