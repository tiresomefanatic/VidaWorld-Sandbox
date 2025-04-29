import apolloClient from "../../../services/graphql.service";
import { SCHEDULE_DELIVERY_QUERY } from "../../queries/scheduleDeliveryQuery";
import Logger from "../../../services/logger.service";
import { setSpinnerActionDispatcher } from "../../store/spinner/spinnerActions";
import { useMutation } from "@apollo/client";

export const useScheduleDelivery = () => {
  const [scheduleDeliveryData] = useMutation(SCHEDULE_DELIVERY_QUERY, {
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
  return scheduleDeliveryData;
};
