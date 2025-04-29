import apolloClient from "../../../services/graphql.service";
import { useLazyQuery } from "@apollo/react-hooks";
import { GET_MY_SCOOTER_QUERY } from "../../queries/myScooterQueries";
import { setSpinnerActionDispatcher } from "../../store/spinner/spinnerActions";
import Logger from "../../../services/logger.service";
import { setMyScooterDispatcher } from "../../store/myScooter/myScooterActions";

export const useGetMyScooterDetails = () => {
  const [getMyScooterDetails] = useLazyQuery(GET_MY_SCOOTER_QUERY, {
    client: apolloClient,
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      setSpinnerActionDispatcher(false);
      data.getAllEccentricConfiguration.length &&
        setMyScooterDispatcher(data.getAllEccentricConfiguration[0]);
    },
    onError: (error) => {
      setSpinnerActionDispatcher(false);
      Logger.error(error);
    }
  });
  return getMyScooterDetails;
};
