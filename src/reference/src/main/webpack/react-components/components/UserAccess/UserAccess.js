import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import PropTypes from "prop-types";
import breakpoints from "../../../site/scripts/media-breakpoints";
import OtpForm from "../OtpForm/OtpForm";
import Header from "../../../components/header/header";
import {
  useGenerateOTP,
  useVerifyOTP
} from "../../hooks/userAccess/userAccessHooks";
import { connect } from "react-redux";
import Logger from "../../../services/logger.service";
import analyticsUtils from "../../../site/scripts/utils/analyticsUtils";
import { setUserStatusActionDispatcher } from "../../store/userAccess/userAccessActions";
import { setSpinnerActionDispatcher } from "../../store/spinner/spinnerActions";
import appUtils from "../../../site/scripts/utils/appUtils";
import {
  cryptoUtils,
  RSAUtils
} from "../../../site/scripts/utils/encryptDecryptUtils";
import CONSTANT from "../../../site/scripts/constant";
import Cookies from "js-cookie";
import { getUtmParams } from "../../../react-components/services/utmParams/utmParams";

const UserAccess = (props) => {
  const [activeTab, setActiveTab] = useState(0);
  const [showUserAccess, setShowUserAccess] = useState(true);
  const [showLoginError, setShowLoginError] = useState("");
  const [showRegisterError, setShowRegisterError] = useState("");
  const [showOtpError, setShowOtpError] = useState("");
  const {
    config,
    sfid,
    isLogin,
    countryCode,
    customerCity,
    numberOrEmail,
    mobileNumber,
    email,
    fname,
    lname,
    whatsappConsent,
    customerState,
    customerCountry
  } = props;
  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();

  const generateLoginOTP = useGenerateOTP(true, false);
  const generateRegisterOTP = useGenerateOTP(false, false);
  const generateVerifyEmailOTP = useGenerateOTP(false, true);

  const verifyOTP = useVerifyOTP(isLogin);

  const [showEmailverify, setShowEmailverify] = useState(false);
  const [showEmailOtp, setShowEmailOtp] = useState(false);

  const setLoginStatus = () => {
    const header = document.querySelector(".vida-header");
    Header.enableUserAccessLinks(header);
    // Push the user status "true" to the Reducer
    setUserStatusActionDispatcher({
      isUserLoggedIn: true
    });
  };

  //sending data for generating OTP
  const handleGenerateOTP = async (data, event) => {
    if (data.isLogin) {
      setShowLoginError("");
    } else {
      setShowRegisterError("");
    }
    try {
      setSpinnerActionDispatcher(true);
      let variables = {
        country_code: data.countryCode || countryCode
      };
      if (data.isLogin) {
        variables = {
          ...variables,
          ...{
            username: RSAUtils.encrypt(data.numberOrEmail),
            is_login: data.isLogin
          }
        };
      } else {
        if (showEmailverify) {
          variables = {
            ...variables,
            ...{
              mobile_number: RSAUtils.encrypt(mobileNumber),
              email: RSAUtils.encrypt(email)
            }
          };
        } else {
          variables = {
            ...variables,
            ...{
              mobile_number: RSAUtils.encrypt(data.mobileNumber),
              email: RSAUtils.encrypt(data.email),
              is_login: data.isLogin
            }
          };
        }
      }
      const loginResult = data.isLogin
        ? await generateLoginOTP({
            variables
          })
        : showEmailverify
        ? await generateVerifyEmailOTP({
            variables
          })
        : await generateRegisterOTP({
            variables
          });

      if (loginResult) {
        if (loginResult.data) {
          if (isAnalyticsEnabled) {
            const customLink = {
              name: event.target.innerText,
              position: "Bottom",
              type: "Button",
              clickType: "other"
            };
            if (activeTab) {
              analyticsUtils.trackSignupOTPClick(customLink);
              analyticsUtils.trackSignupPageView("Verify Mobile OTP");
            } else {
              analyticsUtils.trackLoginOTPClick(customLink);
              analyticsUtils.trackLoginPageView();
            }
          }
          setShowOtpError("");
          window.scrollTo(0, 0);
          setShowUserAccess(false);
          // showEmailverify && setShowEmailverify(false)
        } else if (loginResult.errors && loginResult.errors.message) {
          if (data.isLogin) {
            setShowLoginError(loginResult.errors.message);
          } else {
            setShowRegisterError(loginResult.errors.message);
          }
        } else {
          Logger.error(loginResult);
        }
      }
    } catch (error) {
      Logger.error(error);
    }
  };

  //OTP verification API call with data
  const handleVerifyOTP = async (event, otp) => {
    try {
      setSpinnerActionDispatcher(true);
      setShowOtpError("");

      const params = getUtmParams();
      let variables = {
        SF_ID: sfid,
        otp: RSAUtils.encrypt(otp),
        country_code: countryCode ? countryCode : "+91",
        customer_city: customerCity ? customerCity : "",
        customer_state: customerState ? customerState : "",
        customer_country: customerCountry ? customerCountry : "",
        utm_params: params
      };

      const queryString = location.href.split("?")[1];
      if (queryString) {
        const decryptedParams = cryptoUtils.decrypt(queryString);
        if (decryptedParams) {
          const params = new URLSearchParams("?" + decryptedParams);
          if (
            params.has("source") &&
            params.get("source").toLowerCase() ===
              CONSTANT.URLPARAMS.ECCENTRIC &&
            !showEmailOtp
          ) {
            variables = {
              ...variables,
              pinNo: params.get("pin_no")
            };
          }
        }
      }

      if (!isLogin) {
        if (showEmailOtp) {
          variables = {
            ...variables,
            ...{
              fname,
              lname,
              mobile_number: RSAUtils.encrypt(mobileNumber),
              email: RSAUtils.encrypt(email)
            }
          };
        } else {
          variables = {
            ...variables,
            ...{
              fname,
              lname,
              mobile_number: RSAUtils.encrypt(mobileNumber),
              email: RSAUtils.encrypt(email),
              whatsapp_consent: whatsappConsent,
              is_login: isLogin
            }
          };
        }
      } else {
        variables = {
          ...variables,
          ...{
            username: RSAUtils.encrypt(numberOrEmail),
            is_login: isLogin
          }
        };
      }
      const loginResult = await verifyOTP({
        variables
      });

      if (loginResult && loginResult.data) {
        if (loginResult.data.VerifyOtp.status_code === 200) {
          if (loginResult.data.VerifyOtp.pinNo) {
            Cookies.set(
              CONSTANT.COOKIE_PIN_NUMBER,
              loginResult.data.VerifyOtp.pinNo,
              {
                expires: appUtils.getConfig("tokenExpirtyInDays"),
                secure: true,
                sameSite: "strict"
              }
            );
          }
          const currentUrl = new URL(window.location.href);
          const redirectionUrl =
            currentUrl.search && currentUrl.search.split("?redirectURL=")[1];

          if (activeTab === 0) {
            if (isAnalyticsEnabled) {
              // For Login
              analyticsUtils.trackLoginComplete(function () {
                window.location.href = redirectionUrl
                  ? redirectionUrl
                  : appUtils.getPageUrl("profileUrl");
              });
            } else {
              window.location.href = redirectionUrl
                ? redirectionUrl
                : appUtils.getPageUrl("profileUrl");
            }
          } else {
            // For Signup
            setShowEmailverify(true);
            setLoginStatus();
            if (isAnalyticsEnabled) {
              if (showEmailOtp) {
                analyticsUtils.trackSignupComplete(function () {
                  window.location.href = redirectionUrl
                    ? redirectionUrl
                    : appUtils.getPageUrl("profileUrl");
                });
              } else {
                const customLink = {
                  name: event.target.innerText,
                  position: "Bottom",
                  type: "Button",
                  clickType: "other"
                };
                analyticsUtils.trackSignupOTPClick(customLink);
              }
            } else {
              window.location.href = redirectionUrl
                ? redirectionUrl
                : appUtils.getPageUrl("profileUrl");
            }
          }
        }
      } else {
        setShowOtpError(loginResult.errors.message);
      }
    } catch (error) {
      Logger.error(error);
    }
  };

  const handleSendEmailOtp = (data, event) => {
    handleGenerateOTP(data, event);
    setShowEmailOtp(true);
  };

  const handleCancelEmailVerification = (e) => {
    const currentUrl = new URL(window.location.href);
    const redirectionUrl =
      currentUrl.search && currentUrl.search.split("?redirectURL=")[1];

    if (isAnalyticsEnabled) {
      const customLink = {
        name: e.target.innerText,
        position: "Bottom",
        type: "Link",
        clickType: "other"
      };
      const additionalPageName = ":Verify OTP";
      const additionalJourneyName = "";
      analyticsUtils.trackCtaClick(
        customLink,
        additionalPageName,
        additionalJourneyName,
        function () {
          window.location.href = redirectionUrl
            ? redirectionUrl
            : appUtils.getPageUrl("profileUrl");
        }
      );
    } else {
      window.location.href = redirectionUrl
        ? redirectionUrl
        : appUtils.getPageUrl("profileUrl");
    }
  };

  //Login and Register tab swtich function
  const handleTabSwitch = (isLogin) => {
    try {
      window.scrollTo(0, 0);
      setActiveTab(isLogin);
      if (isLogin) {
        setShowLoginError("");
      } else {
        setShowRegisterError("");
      }
    } catch (error) {
      Logger.error(error);
    }
  };

  const clearError = (tabId) => {
    if (tabId === 0) {
      setShowLoginError("");
    } else {
      setShowRegisterError("");
    }
  };

  //To change number if user enter incorrect number
  const handleChangeNumber = (event) => {
    try {
      setShowUserAccess({
        fname,
        lname,
        email,
        isLogin: true
      });
      setShowOtpError("");
      window.scrollTo(0, 0);
      setActiveTab(Number(!isLogin));
      if (isAnalyticsEnabled) {
        const customLink = {
          name: event.currentTarget.innerText,
          position: "Middle",
          type: "Link",
          clickType: "other"
        };
        if (activeTab) {
          analyticsUtils.trackSignupOTPClick(customLink);
          analyticsUtils.trackSignupPageView("Verify Mobile OTP");
        } else {
          analyticsUtils.trackLoginOTPClick(customLink);
          analyticsUtils.trackLoginPageView();
        }
      }
    } catch (error) {
      Logger.error(error);
    }
  };

  const handleTabChange = (tabID) => {
    window.scrollTo(0, 0);
    setActiveTab(tabID);
    clearError(tabID);
    if (isAnalyticsEnabled) {
      if (tabID === 0) {
        analyticsUtils.trackLoginStart();
      } else {
        analyticsUtils.trackSignupStart();
      }
    }
  };

  return (
    <section
      className="vida-user-access"
      style={{
        backgroundImage: `url(${isDesktop ? config.homepageImg : ""})`
      }}
    >
      <div className="vida-container vida-user-access__container">
        <div className="vida-user-access__content-container">
          {showUserAccess ? (
            <div className="vide-user-access__tabs-container">
              <div className="vida-user-access__tabs">
                {config.tabs.map((tab) => {
                  return (
                    <div
                      key={tab.id}
                      onClick={() => {
                        handleTabChange(tab.id);
                      }}
                      className={`vida-user-access__tab
                    ${
                      activeTab === tab.id
                        ? "vida-user-access__tab--active"
                        : ""
                    }
                  `}
                    >
                      <label className="vida-user-access__label">
                        {tab.label}
                      </label>
                    </div>
                  );
                })}
              </div>

              <div className="vida-user-access__tab-content">
                {activeTab === 0 ? (
                  <LoginForm
                    loginConfig={config.loginConfig}
                    generateOTPHandler={handleGenerateOTP}
                    tabSwitchHandler={handleTabSwitch}
                    showLoginError={showLoginError}
                  ></LoginForm>
                ) : (
                  <RegisterForm
                    registerConfig={config.registerConfig}
                    generateOTPHandler={handleGenerateOTP}
                    tabSwitchHandler={handleTabSwitch}
                    changeNumberHandler={handleChangeNumber}
                    showRegisterError={showRegisterError}
                  ></RegisterForm>
                )}
              </div>
            </div>
          ) : (
            <div className="vida-user-access__otp-container">
              <OtpForm
                otpConfig={config.otpConfig}
                verifyOTPHandler={handleVerifyOTP}
                changeNumberHandler={handleChangeNumber}
                isLogin={isLogin}
                showError={showOtpError}
                activeTab={activeTab}
                showEmailverify={showEmailverify}
                showEmailOtp={showEmailOtp}
                cancelEmailVerification={handleCancelEmailVerification}
                sendEmailOtp={handleSendEmailOtp}
              ></OtpForm>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const mapStateToProps = ({ userAccessReducer }) => {
  return {
    sfid: userAccessReducer.sfid,
    isLogin: userAccessReducer.isLogin,
    countryCode: userAccessReducer.countryCode,
    numberOrEmail: userAccessReducer.numberOrEmail,
    mobileNumber: userAccessReducer.mobileNumber,
    customerCity: userAccessReducer.customerCity,
    customerState: userAccessReducer.customerState,
    customerCountry: userAccessReducer.customerCountry,
    fname: userAccessReducer.fname,
    lname: userAccessReducer.lname,
    email: userAccessReducer.email,
    whatsappConsent: userAccessReducer.whatsappConsent
  };
};

UserAccess.propTypes = {
  config: PropTypes.object,
  sfid: PropTypes.string,
  isLogin: PropTypes.bool,
  countryCode: PropTypes.string,
  customerCity: PropTypes.string,
  customerState: PropTypes.string,
  customerCountry: PropTypes.string,
  numberOrEmail: PropTypes.string,
  mobileNumber: PropTypes.string,
  fname: PropTypes.string,
  lname: PropTypes.string,
  email: PropTypes.string,
  whatsappConsent: PropTypes.bool
};

UserAccess.defaultProps = {
  config: {},
  sfid: "",
  isLogin: false,
  countryCode: "",
  customerCity: "",
  customerState: "",
  customerCountry: "",
  mobileNumber: "",
  fname: "",
  lname: "",
  email: ""
};

export default connect(mapStateToProps)(UserAccess);
