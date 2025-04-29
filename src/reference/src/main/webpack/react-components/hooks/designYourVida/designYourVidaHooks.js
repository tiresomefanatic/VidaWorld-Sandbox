import apolloClient from "../../../services/graphql.service";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import {
  GET_ALL_SAVE_MY_DESIGN_QUERY,
  SAVE_MY_DESIGN_QUERY
} from "../../queries/designYourVidaQueries";
import { setSpinnerActionDispatcher } from "../../store/spinner/spinnerActions";
import Logger from "../../../services/logger.service";

export const useGetAllSaveMyDesign = () => {
  const [getAllSaveMyDesign] = useLazyQuery(GET_ALL_SAVE_MY_DESIGN_QUERY, {
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
  return getAllSaveMyDesign;
};

export const useSaveMyDesign = () => {
  const [saveMyDesign] = useMutation(SAVE_MY_DESIGN_QUERY, {
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
  return saveMyDesign;
};
