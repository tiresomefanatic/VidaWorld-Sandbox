import { useMutation } from "@apollo/client";
import Logger from "../../../services/logger.service";
import apolloClient from "../../../services/graphql.service";
import {
  WEBPOPUP_SENDOTP,
  WEBPOPUP_VERIFY_OTP
} from "../../queries/webPopUpQueries";

export const generateWebPopUpOTP = () => {
  const [sendWebPopUpOTP] = useMutation(WEBPOPUP_SENDOTP, {
    client: apolloClient,
    fetchPolicy: "no-cache",
    // onCompleted: () => {
    //   console.log("completed");
    // },
    onError: (error) => {
      Logger.error(error);
    }
  });

  return sendWebPopUpOTP;
};

export const validateWebPopupOTP = () => {
  const [verifyWebPopUpOTP] = useMutation(WEBPOPUP_VERIFY_OTP, {
    fetchPolicy: "no-cache",
    client: apolloClient,
    // onCompleted: () => {
    //   console.log("verify OTP completed");
    // },
    onError: (error) => {
      Logger.error(error);
    }
  });

  return verifyWebPopUpOTP;
};
