import apolloClient from "../../../services/graphql.service";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import {
  GENERATE_LOGIN_OTP_QUERY,
  GENERATE_REGISTER_OTP_QUERY,
  GENERATE_EMAIL_VERIFY_OTP_QUERY,
  GENERATE_BOOKING_LOGIN_OTP_QUERY,
  GENERATE_BOOKING_REGISTER_OTP_QUERY,
  GENERATE_TESTDRIVE_SEND_OTP_QUERY,
  VERIFY_LOGIN_OTP_QUERY,
  VERIFY_REGISTER_OTP_QUERY,
  VERIFY_BOOKING_LOGIN_OTP_QUERY,
  VERIFY_BOOKING_REGISTER_OTP_QUERY,
  VERIFY_TESTDRIVE_SEND_OTP_QUERY,
  GENERATE_WEB_POPUP_REGISTER_OTP_QUERY,
  LOGOUT_QUERY
  // VERIFY_WEB_POPUP_OTP_QUERY
} from "../../queries/userAccessQueries";
import { GET_USER_DATA_QUERY } from "../../queries/userProfileQueries";

import {
  setSFIDActionDispatcher,
  setUserCheckActionDispatcher
} from "../../store/userAccess/userAccessActions";
import { setUserProfileDataDispatcher } from "../../store/userProfile/userProfileActions";
import appUtils from "../../../site/scripts/utils/appUtils";
import loginUtils from "../../../site/scripts/utils/loginUtils";
import Logger from "../../../services/logger.service";
import { setSpinnerActionDispatcher } from "../../store/spinner/spinnerActions";

export const useGenerateOTP = (isLogin, verifyEmail) => {
  const [getInfo] = useMutation(
    isLogin
      ? GENERATE_LOGIN_OTP_QUERY
      : verifyEmail
      ? GENERATE_EMAIL_VERIFY_OTP_QUERY
      : GENERATE_REGISTER_OTP_QUERY,
    {
      client: apolloClient,
      fetchPolicy: "no-cache",
      onCompleted: (data) => {
        if (data && data.SendOtp) {
          setSFIDActionDispatcher({
            SFID: data.SendOtp.SF_ID
          });
          setSpinnerActionDispatcher(false);
          return data;
        }
      },
      onError: (error) => {
        setSpinnerActionDispatcher(false);
        Logger.error(error);
      }
    }
  );
  return getInfo;
};

// used for both pre-booking & test-drive
export const useGenerateBookingOTP = (isLogin) => {
  const [getInfo] = useMutation(
    isLogin
      ? GENERATE_BOOKING_LOGIN_OTP_QUERY
      : GENERATE_BOOKING_REGISTER_OTP_QUERY,
    {
      client: apolloClient,
      fetchPolicy: "no-cache",
      onCompleted: (data) => {
        if (data && data.SendOtp) {
          setSFIDActionDispatcher({
            SFID: data.SendOtp.SF_ID
          });
          setUserCheckActionDispatcher({
            isLogin: false,
            customerExists: data.SendOtp.customer_exist
          });
          setSpinnerActionDispatcher(false);
          return data;
        }
      },
      onError: (error) => {
        setSpinnerActionDispatcher(false);
        Logger.error(error);
      }
    }
  );
  return getInfo;
};

// used for web popup
export const useGenerateWebPopupOTP = (isLogin) => {
  const [getInfo] = useMutation(GENERATE_WEB_POPUP_REGISTER_OTP_QUERY, {
    client: apolloClient,
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      if (data && data.SendOtp) {
        setSFIDActionDispatcher({
          SFID: data.SendOtp.SF_ID
        });
        setUserCheckActionDispatcher({
          isLogin: false,
          customerExists: data.SendOtp.customer_exist
        });
        setSpinnerActionDispatcher(false);
        return data;
      }
    },
    onError: (error) => {
      setSpinnerActionDispatcher(false);
      Logger.error(error);
    }
  });
  return getInfo;
};

// export const useVerifyWebPopupOTP = () => {
//   const [getInfo] = useMutation(VERIFY_WEB_POPUP_OTP_QUERY, {
//     client: apolloClient,
//     fetchPolicy: "no-cache",
//     onCompleted: (data) => {
//       setSpinnerActionDispatcher(false);
//       if (data && data.VerifyOtp && data.VerifyOtp.status_code === 200) {
//         // const token = data.VerifyOtp.token;
//         // const accountID = data.VerifyOtp.account_id || "";
//         // const leadID = data.VerifyOtp.lead_id || "";
//         // const cusNum = data.VerifyOtp.sf_customer_number || "";
//         // loginUtils.setSessionToken(token);
//         // loginUtils.setVidaID(accountID, leadID, cusNum);
//       }
//     },
//     onError: (error) => {
//       setSpinnerActionDispatcher(false);
//       Logger.error(error);
//     }
//   });
// };

export const useVerifyOTP = (isLogin) => {
  const [getInfo] = useMutation(
    isLogin ? VERIFY_LOGIN_OTP_QUERY : VERIFY_REGISTER_OTP_QUERY,
    {
      client: apolloClient,
      fetchPolicy: "no-cache",
      onCompleted: (data) => {
        setSpinnerActionDispatcher(false);
        if (data && data.VerifyOtp && data.VerifyOtp.status_code === 200) {
          const token = data.VerifyOtp.token;
          const accountID = data.VerifyOtp.account_id || "";
          const leadID = data.VerifyOtp.lead_id || "";
          const cusNum = data.VerifyOtp.sf_customer_number || "";
          loginUtils.setSessionToken(token);
          loginUtils.setVidaID(accountID, leadID, cusNum);
        }
      },
      onError: (error) => {
        setSpinnerActionDispatcher(false);
        Logger.error(error);
      }
    }
  );

  return getInfo;
};

export const useVerifyBookingOTP = (isLogin) => {
  const [getInfo] = useMutation(
    isLogin
      ? VERIFY_BOOKING_LOGIN_OTP_QUERY
      : VERIFY_BOOKING_REGISTER_OTP_QUERY,
    {
      client: apolloClient,
      fetchPolicy: "no-cache",
      onCompleted: (data) => {
        setSpinnerActionDispatcher(false);
        if (data && data.VerifyOtp && data.VerifyOtp.status_code === 200) {
          const token = data.VerifyOtp.token;
          const accountID = data.VerifyOtp.account_id || "";
          const leadID = data.VerifyOtp.lead_id || "";
          const cusNum = data.VerifyOtp.sf_customer_number || "";
          loginUtils.setSessionToken(token);
          loginUtils.setVidaID(accountID, leadID, cusNum);
        }
      },
      onError: (error) => {
        setSpinnerActionDispatcher(false);
        Logger.error(error);
      }
    }
  );

  return getInfo;
};

export const useLogout = () => {
  const [logout] = useMutation(LOGOUT_QUERY, {
    client: apolloClient,
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      setSpinnerActionDispatcher(false);

      if (data) {
        loginUtils.removeSessionToken();
        return data;
      }
    },
    onError: (error) => {
      setSpinnerActionDispatcher(false);

      Logger.error(error);
    }
  });

  return logout;
};

// Fetch user data when logged in
export const useUserData = () => {
  const loginUrl = appUtils.getPageUrl("loginUrl");
  const [getUserData] = useLazyQuery(GET_USER_DATA_QUERY, {
    client: apolloClient,
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      setSpinnerActionDispatcher(false);
      if (data && data.customer) {
        setUserProfileDataDispatcher(data.customer);
        loginUtils.setAdobeAnalyticsData(
          data.customer?.customer_primary_email,
          data.customer?.mobile_number
        );
      } else {
        loginUtils.removeSessionToken();
        if (loginUrl) {
          window.location.href = loginUrl;
        }
      }
    },
    onError: () => {
      setSpinnerActionDispatcher(false);
      loginUtils.removeSessionToken();
      if (loginUrl) {
        window.location.href = loginUrl;
      }
    }
  });
  return getUserData;
};

// TestDrive new design
export const useTestDriveSendOtp = () => {
  const [getTestdriveSendOtp] = useMutation(GENERATE_TESTDRIVE_SEND_OTP_QUERY, {
    client: apolloClient,
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      if (data && data.SendOtp) {
        setSFIDActionDispatcher({
          SFID: data.SendOtp.SF_ID
        });
        setUserCheckActionDispatcher({
          customerExists: data.SendOtp.customer_exist
        });
        setSpinnerActionDispatcher(false);
        return data;
      }
    },
    onError: (error) => {
      setSpinnerActionDispatcher(false);
      Logger.error(error);
    }
  });
  return getTestdriveSendOtp;
};

export const useTestDriveVerifyOtp = () => {
  const [getTestdriveVerifyOtp] = useMutation(VERIFY_TESTDRIVE_SEND_OTP_QUERY, {
    client: apolloClient,
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      setSpinnerActionDispatcher(false);
      if (data && data.VerifyOtp && data.VerifyOtp.status_code === 200) {
        const token = data.VerifyOtp.token;
        const accountID = data.VerifyOtp.account_id || "";
        const leadID = data.VerifyOtp.lead_id || "";
        const cusNum = data.VerifyOtp.sf_customer_number || "";
        loginUtils.setSessionToken(token);
        loginUtils.setVidaID(accountID, leadID, cusNum);
      }
    },
    onError: (error) => {
      setSpinnerActionDispatcher(false);
      Logger.error(error);
    }
  });

  return getTestdriveVerifyOtp;
};
