import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import EditProfile from "./EditProfile";
import PropTypes from "prop-types";
import breakpoints from "../../../../site/scripts/media-breakpoints";
import OtpForm from "../OtpForm/OtpForm";
import {
  useGenerateOTP,
  useVerifyOTP
} from "../../../hooks/userAccess/userAccessHooks";
import { connect } from "react-redux";
import Logger from "../../../../services/logger.service";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import { setUserStatusActionDispatcher } from "../../../store/userAccess/userAccessActions";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";
import appUtils from "../../../../site/scripts/utils/appUtils";
import {
  cryptoUtils,
  RSAUtils
} from "../../../../site/scripts/utils/encryptDecryptUtils";
import CONSTANT from "../../../../site/scripts/constant";
import Cookies from "js-cookie";
import { getUtmParams } from "../../../../react-components/services/utmParams/utmParams";
import { useSaveMyDesign } from "../../../hooks/designYourVida/designYourVidaHooks";
import { showNotificationDispatcher } from "../../../store/notification/notificationActions";

const UserAccess = (props) => {
  const [activeTab, setActiveTab] = useState(0);
  const [showUserAccess, setShowUserAccess] = useState(true);
  const [showNextRegisterForm, setshowNextRegisterForm] = useState(true);
  const [showLoginError, setShowLoginError] = useState("");
  const [showRegisterError, setShowRegisterError] = useState("");
  const [showOtpError, setShowOtpError] = useState("");
  const [isOpened, setIsOpened] = useState(false);
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
  const postSaveDesign = useSaveMyDesign();

  const [showEmailverify, setShowEmailverify] = useState(false);
  const [showEmailOtp, setShowEmailOtp] = useState(false);

  const handleToggleDrawer = () => {
    setIsOpened(!isOpened);
  };

  const setLoginStatus = () => {
    // const header = document.querySelector(".vida-header");
    // Header.enableUserAccessLinks(header);
    // Push the user status "true" to the Reducer
    setUserStatusActionDispatcher({
      isUserLoggedIn: true
    });
  };

  const trackLoginSignupSuccessFail = (eventName) => {
    if (isAnalyticsEnabled) {
      analyticsUtils.trackCTAClicksVida2("", eventName);
    }
  };

  const trackVerifyOtp = (text, position) => {
    if (isAnalyticsEnabled) {
      const verifyOtpCtaDetails = {
        ctaText: text,
        ctaLocation: position
      };
      analyticsUtils.trackCTAClicksVida2(verifyOtpCtaDetails, "verifyOtpCta");
    }
  };

  //sending data for generating OTP
  const handleGenerateOTP = async (data, event, generateOtpBtnLabel) => {
    if (data.isLogin) {
      setShowLoginError("");
      trackVerifyOtp(generateOtpBtnLabel, "loginPage");
    } else {
      setShowRegisterError("");
      trackVerifyOtp(generateOtpBtnLabel, "signUpPage");
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
          setShowOtpError("");
          window.scrollTo(0, 0);
          setShowUserAccess(false);

          // showEmailverify && setShowEmailverify(false)
        } else if (loginResult?.errors?.message) {
          if (data.isLogin) {
            setShowLoginError(loginResult?.errors?.message);
          } else {
            setShowRegisterError(loginResult?.errors?.message);
            if (
              loginResult.errors?.message
                .toLowerCase()
                .includes("already exist")
            ) {
              const formDetails = {
                formType: "SignUp",
                formErrorField: loginResult.errors.message
                  .toLowerCase()
                  .includes("phone number and email")
                  ? "Phone Number | Email"
                  : loginResult.errors.message
                      .toLowerCase()
                      .includes("phone number")
                  ? "Phone Number"
                  : "Email"
              };
              analyticsUtils.trackBuyJourneyDropOut(
                formDetails,
                loginResult?.errors?.message
              );
            }
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
        country_code: countryCode || "+91",
        customer_city: customerCity || "",
        customer_state: customerState || "",
        customer_country: customerCountry || "",
        utm_params: params,
        sub_source: ""
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

      if (loginResult?.data) {
        if (loginResult?.data?.VerifyOtp?.status_code === 200) {
          if (loginResult?.data?.VerifyOtp?.pinNo) {
            Cookies.set(
              CONSTANT.COOKIE_PIN_NUMBER,
              loginResult?.data?.VerifyOtp?.pinNo,
              {
                expires: appUtils.getConfig("tokenExpirtyInDays"),
                secure: true,
                sameSite: "strict"
              }
            );
          }
          trackLoginSignupSuccessFail("otpSuccess");
          if (isLogin) {
            // For Login
            if (isAnalyticsEnabled) {
              trackLoginSignupSuccessFail("loginComplete");
              analyticsUtils.trackLoginCompleteVida2();
            }
          } else {
            // for sign-up
            if (isAnalyticsEnabled) {
              trackLoginSignupSuccessFail("signupComplete");
              if (showEmailOtp) {
                analyticsUtils.trackSignupCompleteVida2();
              }
              //need to remove this after analytics confirmation
              // else {
              //   const customLink = {
              //     name: event.target.innerText,
              //     position: "Bottom",
              //     type: "Button",
              //     clickType: "other"
              //   };
              //   analyticsUtils.trackSignupOTPClick(customLink);
              // }
            }
          }
          const currentUrl = new URL(window.location.href);
          //const redirectionUrl = currentUrl?.search?.split("?redirectURL=")[1];

          if (loginResult?.data?.VerifyOtp?.status_code === 200 && !isLogin) {
            setshowNextRegisterForm(false);
          } else {
            // window.location.href = appUtils.checkIfFalsy(redirectionUrl)
            //   ? appUtils.getPageUrl("profileUrl") //Please dont change this to vidaProfileURL
            //   : redirectionUrl;
            setSpinnerActionDispatcher(true);
            const currentUrl = new URL(window.location.href);
            const redirectionUrl =
              currentUrl?.search?.split("?redirectURL=")[1];
            const queryString =
              redirectionUrl && currentUrl?.search?.split("?")[2];
            const decryptedParams =
              queryString && cryptoUtils.decrypt(queryString);
            const params = new URLSearchParams("?" + decryptedParams);
            const productItemId = params.get("productItemId");
            const productItemSkuId = params.get("productItemSkuId");
            if (productItemId && productItemSkuId) {
              const variables = {
                product_ItemId: productItemId,
                product_ItemSkuId: productItemSkuId
              };
              const saveMyDesignDetails = await postSaveDesign({
                variables
              });
              if (
                saveMyDesignDetails?.data?.saveMyDesign?.status.toLowerCase() ===
                "success"
              ) {
                showNotificationDispatcher({
                  title: saveMyDesignDetails?.data?.saveMyDesign?.message,
                  type: CONSTANT.NOTIFICATION_TYPES.SUCCESS,
                  isVisible: true
                });
                setTimeout(() => {
                  window.location.href =
                    redirectionUrl || appUtils.getPageUrl("profileUrl");
                }, 1000);
              } else {
                setSpinnerActionDispatcher(false);
                showNotificationDispatcher({
                  title: saveMyDesignDetails?.errors?.message,
                  type: CONSTANT.NOTIFICATION_TYPES.ERROR,
                  isVisible: true
                });
              }
            } else {
              window.location.href = appUtils.getPageUrl("profileUrl");
            }
          }
          if (activeTab !== 0) {
            // For Signup
            setShowEmailverify(true);
            setLoginStatus();
          }
        }
      } else {
        setShowOtpError(loginResult?.errors?.message);
        trackLoginSignupSuccessFail("otpFailure");
        if (isLogin) {
          trackLoginSignupSuccessFail("loginFailure");
        } else {
          trackLoginSignupSuccessFail("signupFailure");
        }
      }
    } catch (error) {
      Logger.error(error);
    }
  };

  const handleSecondFormSubmit = async () => {
    setSpinnerActionDispatcher(true);
    const currentUrl = new URL(window.location.href);
    const redirectionUrl = currentUrl?.search?.split("?redirectURL=")[1];
    const queryString = redirectionUrl && currentUrl?.search?.split("?")[2];
    const decryptedParams = queryString && cryptoUtils.decrypt(queryString);
    const params = new URLSearchParams("?" + decryptedParams);
    const productItemId = params.get("productItemId");
    const productItemSkuId = params.get("productItemSkuId");
    if (productItemId && productItemSkuId) {
      const variables = {
        product_ItemId: productItemId,
        product_ItemSkuId: productItemSkuId
      };
      const saveMyDesignDetails = await postSaveDesign({
        variables
      });
      if (
        saveMyDesignDetails?.data?.saveMyDesign?.status.toLowerCase() ===
        "success"
      ) {
        showNotificationDispatcher({
          title: saveMyDesignDetails?.data?.saveMyDesign?.message,
          type: CONSTANT.NOTIFICATION_TYPES.SUCCESS,
          isVisible: true
        });
        setTimeout(() => {
          window.location.href =
            redirectionUrl || appUtils.getPageUrl("profileUrl");
        }, 1000);
      } else {
        setSpinnerActionDispatcher(false);
        showNotificationDispatcher({
          title: saveMyDesignDetails?.errors?.message,
          type: CONSTANT.NOTIFICATION_TYPES.ERROR,
          isVisible: true
        });
      }
    } else {
      window.location.href = appUtils.getPageUrl("profileUrl"); //Please dont change this to vidaProfileUrl;
    }
  };

  const handleSendEmailOtp = (data, event) => {
    handleGenerateOTP(data, event);
    setShowEmailOtp(true);
  };

  const handleCancelEmailVerification = (e) => {
    const currentUrl = new URL(window.location.href);
    const redirectionUrl = currentUrl?.search?.split("?redirectURL=")[1];

    if (isAnalyticsEnabled) {
      const customLink = {
        ctaText: e.target.innerText,
        ctaLocation: "header"
      };
      const additionalPageName = ":Verify OTP";
      const additionalJourneyName = "";
      analyticsUtils.trackCtaClickV2(
        customLink,
        additionalPageName,
        additionalJourneyName,
        function () {
          window.location.href =
            redirectionUrl || appUtils.getPageUrl("profileUrl");
        }
      );
    } else {
      window.location.href =
        redirectionUrl || appUtils.getPageUrl("profileUrl");
    }
  };

  const resendOtpHandler = () => {
    setShowOtpError("");
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
        let pageName = "loginPage";
        if (!isLogin) {
          pageName = "signupPage";
        }
        const customLink = {
          ctaText: event.currentTarget.innerText,
          position: pageName
        };
        analyticsUtils.trackCTAClicksVida2(customLink, "ctaButtonClick");
      }
    } catch (error) {
      Logger.error(error);
    }
  };

  // const handleTabChange = (tabID) => {
  //   window.scrollTo(0, 0);
  //   setActiveTab(tabID);
  //   clearError(tabID);
  //   if (isAnalyticsEnabled) {
  //     if (tabID === 0) {
  //       analyticsUtils.trackLoginStart();
  //     } else {
  //       analyticsUtils.trackSignupStart();
  //     }
  //   }
  // };

  return (
    <div className="vida-user-access-wrapper">
      <img
        className="user-access-bg-img"
        src={
          showNextRegisterForm
            ? config.isLoginPage
              ? isDesktop
                ? config.loginBannerDesktopImg
                : config.loginBannerMobileImg
              : isDesktop
              ? config.registerBannerDesktopImg
              : config.registerBannerMobileImg
            : isDesktop
            ? config.secondRegisterBannerDesktopImg
            : config.secondRegisterBannerMobileImg
        }
        alt={
          showNextRegisterForm
            ? config.isLoginPage
              ? config.loginBannerImgAlt
              : config.registerBannerImgAlt
            : config.secondRegisterImgAlt || "user_access_banner_img"
        }
        title={
          showNextRegisterForm
            ? config.isLoginPage
              ? config.loginBannerImgTitle
              : config.registerBannerImgTitle
            : config.secondRegisterImgTitle
        }
        loading="lazy"
      ></img>
      <div className="vida-user-access-container">
        <div className="user-access-banner-container">
          <div
            className={
              config.isLoginPage
                ? "user-access-banner-title"
                : "user-access-banner-title title-black"
            }
          >
            <h1>
              {showNextRegisterForm
                ? config.isLoginPage
                  ? config.loginBannerTitle
                  : config.registerBannerTitle
                : config.secondRegisterBannerTitle}
            </h1>
          </div>
          <div
            className={
              config.isLoginPage
                ? "user-access-banner-description"
                : "user-access-banner-description description-black"
            }
          >
            <p>
              {showNextRegisterForm
                ? config.isLoginPage
                  ? config.loginBannerDescription
                  : config.registerBannerDescription
                : config.secondRegisterBannerDescription}
            </p>
          </div>
        </div>
        <div
          className={
            isDesktop
              ? showNextRegisterForm
                ? "user-access-content-container"
                : "user-access-content-container container-height"
              : isOpened
              ? "user-access-content-container slide-down"
              : "user-access-content-container"
          }
        >
          <div className="drawer-btn-wrapper">
            <div className="drawer-btn" onClick={handleToggleDrawer}></div>
          </div>

          {showNextRegisterForm ? (
            <div className="user-access-primary-form-conatiner">
              {showUserAccess ? (
                <div className="user-access-login-container">
                  {config.isLoginPage ? (
                    <LoginForm
                      loginConfig={config.loginConfig}
                      generateOTPHandler={handleGenerateOTP}
                      showLoginError={showLoginError}
                    ></LoginForm>
                  ) : (
                    <RegisterForm
                      registerConfig={config.registerConfig}
                      generateOTPHandler={handleGenerateOTP}
                      changeNumberHandler={handleChangeNumber}
                      showRegisterError={showRegisterError}
                      isRequired={true}
                    ></RegisterForm>
                  )}
                </div>
              ) : (
                <div className="user-access-otp-container">
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
                    resendOtpHandler={resendOtpHandler}
                    altDataPosition={isLogin ? "loginPage" : "signupPage"}
                  ></OtpForm>
                </div>
              )}
            </div>
          ) : (
            <div className="user-access-secondary-form-conatiner">
              <EditProfile
                config={config.userProfileConfig}
                secondFormSubmitHandler={handleSecondFormSubmit}
              />
            </div>
          )}
        </div>
      </div>
    </div>
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
