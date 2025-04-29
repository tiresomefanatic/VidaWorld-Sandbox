import appUtils from "./appUtils";
import loginUtils from "./loginUtils";

function analyticsUtils() {
  const metaObject = {};
  let pageInfo = {},
    pageInfoV2 = {},
    userInfo = {},
    errorConfig = {};

  /**
   * Method to set Userinfo on every event
   */
  const getUserInfo = () => {
    if (loginUtils.isSessionActive()) {
      return {
        status: "logged-in",
        ...loginUtils.getVidaID()
      };
    } else {
      return {
        status: "logged-out"
      };
    }
  };

  /**
   * Method to set UserLocation on every event
   */
  const getUserLocation = () => {
    return loginUtils.getVidaLocation();
  };

  const utils = {
    /**
     * Method to convert price datatype string to float
     */
    priceConversion(productPrice) {
      return parseFloat(productPrice.split(",").join(""));
    },

    /**
     * Method to check whether analytics is enabled or not
     */
    isAnalyticsEnabled() {
      return appUtils.getAnalyticsConfig("isAnalyticsEnabled");
    },

    /**
     * Method to initialize the analytics data from Meta tags
     */
    initAnalyticsData() {
      const metaElements = document.querySelectorAll("meta[property]");
      for (const meta of metaElements) {
        const property = meta.getAttribute("property");
        const content = meta.getAttribute("content");
        if (property != undefined) {
          metaObject[property] = content;
        }
      }

      pageInfo = {
        pageCategory: metaObject.pageCategory || "",
        pageName: metaObject.pageName || metaObject.pageCategory || "",
        journeyName: metaObject.pageCategory || "",
        language: metaObject.language || "",
        country: metaObject.country || "",
        eventName: "",
        platform: "Web",
        url: window.location.href
      };
      // Create a copy of the pageInfo object to avoid modifying the original
      pageInfoV2 = { ...pageInfo };
      delete pageInfoV2.eventName;

      userInfo = getUserInfo();
      errorConfig = {
        errorDescription: metaObject.errorDescription || "",
        errorType: metaObject.errorCode || "",
        errorPage: metaObject.isErrorPage
          ? metaObject.isErrorPage.toLowerCase() == "true"
            ? true
            : false
          : false
      };
    },

    /**
     * Method to get page name dynamically
     */
    getDynamicPageName(additionalPageName) {
      return additionalPageName
        ? additionalPageName === ""
          ? pageInfo.pageCategory
          : `${pageInfo.pageCategory}${additionalPageName}`
        : pageInfo.pageName || pageInfo.pageCategory;
    },

    /**
     * Method to get journey name dynamically
     */
    getDynamicJourneyName(additionalJourneyName) {
      return additionalJourneyName
        ? additionalJourneyName === ""
          ? pageInfo.pageCategory
          : `${pageInfo.pageCategory} ${additionalJourneyName}`
        : pageInfo.pageCategory;
    },

    /**
     * Method to call on every page load
     * @param {string} additionalPageName
     * @param {string} additionalJourneyName
     */
    trackPageLoad(additionalPageName, additionalJourneyName) {
      window.adobeDataLayer = window.adobeDataLayer || [];
      window.adobeDataLayer.push({
        event: !JSON.parse(errorConfig["errorPage"]) ? "pageView" : "errorPage",
        page: {
          pageInfo: {
            ...pageInfo,
            pageName: this.getDynamicPageName(additionalPageName),
            journeyName: this.getDynamicJourneyName(additionalJourneyName),
            eventName: !JSON.parse(errorConfig["errorPage"])
              ? "pageView"
              : "errorPage"
          }
        },
        user: {
          userInfo: getUserInfo()
        },
        ...(!JSON.parse(errorConfig["errorPage"]) || errorConfig)
      });
    },

    /**
     * Method to track data layer on every page load for vida 2.0.
     * @param {string} additionalPageName - Additional page name to be included in the data layer.
     * @param {string} additionalJourneyName - Additional journey name to be included in the data layer.
     */
    trackDatalayerPageLoad(additionalPageName, additionalJourneyName) {
      window.digitalData = window.digitalData || [];

      window.digitalData.push({
        event: !JSON.parse(errorConfig["errorPage"]) ? "pageView" : "errorPage",
        page: {
          pageInfo: {
            ...pageInfoV2,
            pageName: this.getDynamicPageName(additionalPageName),
            journeyName: this.getDynamicJourneyName(additionalJourneyName)
          }
        },
        user: {
          userInfo: getUserInfo()
        },
        ...(!JSON.parse(errorConfig["errorPage"]) || errorConfig)
      });
    },

    /**
     * Tracks test ride form data.
     * @param {string} pageName
     */
    trackTestRideFormData(pageName) {
      window.digitalData = window.digitalData || [];
      window.digitalData.push({
        event: "pageView",
        page: { pageInfo: { ...pageInfoV2, pageName: pageName } },
        user: { userInfo: getUserInfo() }
      });
    },

    /**
     * Tracks form data.
     * @param {string} eventName
     * @param {string} customLink
     */
    trackFormData(eventName, customLink) {
      window.digitalData = window.digitalData || [];
      window.digitalData.push({
        event: eventName,
        form: customLink,
        page: {
          pageInfo: { ...pageInfoV2 }
        },
        user: { userInfo: getUserInfo() }
      });
    },

    /**
     * Method to call on Register now click in login page
     * @param {object} customLink
     */
    trackCTAClicksVida2(customLink, eventName, redirectCallback, pageName) {
      window.digitalData = window.digitalData || [];
      const eventData = {
        page: {
          pageInfo: { ...pageInfoV2, ...(pageName && { pageName }) }
        },
        user: {
          userInfo: getUserInfo()
        }
      };

      if (!eventName && window._satellite) {
        eventData.linkDetails = customLink;
        window.digitalData.push(eventData);
        window._satellite.track("hamburgerClick");
      } else if (
        window._satellite &&
        (eventName === "otpSuccess" || eventName === "otpFailure")
      ) {
        window.digitalData.push(eventData);
        window._satellite.track(eventName);
      } else if (eventName === "breadcrumbClick") {
        eventData.linkDetails = customLink;
        window.digitalData.push(eventData);
        _satellite.track("breadcrumbClick");
      } else {
        eventData.event = eventName || "hamburgerClick";
        if (customLink !== "") {
          eventData.linkDetails = customLink;
        }
        window.digitalData.push(eventData);
        _satellite.track(eventName);
      }
      setTimeout(() => redirectCallback && redirectCallback(), 1000);
      _satellite.track("breadcrumbClick");
    },

    /**
     * Tracks document download events.
     * @param {Object} documentDetails
     */
    trackDocumentDetailsClick(documentDetails) {
      window.digitalData.push({
        event: "downloadClick",
        page: {
          pageInfo: {
            ...pageInfoV2
          }
        },
        user: {
          userInfo: getUserInfo()
        },
        documentDetails: documentDetails
      });
    },

    /**
     * Method to call on Pre booking dealer confirm
     * @param {string} customLink
     */
    trackCTAClickWithDealerDetails(customLink) {
      window.digitalData = window.digitalData || [];
      window.digitalData.push({
        event: "confirmDealerClick",
        page: {
          pageInfo: {
            ...pageInfoV2
          }
        },
        dealerDetails: customLink,
        user: {
          userInfo: getUserInfo()
        }
      });
    },

    /**
     * Method to call only for Login Page after generate otp button clicked
     */
    trackLoginPageView() {
      window.digitalData = window.digitalData || [];
      window.digitalData.push({
        event: !JSON.parse(errorConfig["errorPage"]) ? "pageView" : "errorPage",
        page: {
          pageInfo: {
            ...pageInfo,
            pageName: "Login:Verify OTP",
            journeyName: "Login",
            eventName: !JSON.parse(errorConfig["errorPage"])
              ? "pageView"
              : "errorPage"
          }
        },
        user: {
          userInfo: getUserInfo()
        },
        ...(!JSON.parse(errorConfig["errorPage"]) || errorConfig)
      });
    },

    /**
     * Method to call only for Registration Page after generate otp button clicked
     */
    trackSignupPageView(additionalPageName) {
      window.digitalData = window.digitalData || [];
      window.digitalData.push({
        event: !JSON.parse(errorConfig["errorPage"]) ? "pageView" : "errorPage",
        page: {
          pageInfo: {
            ...pageInfo,
            pageName: "Signup:" + additionalPageName,
            journeyName: "Registration",
            eventName: !JSON.parse(errorConfig["errorPage"])
              ? "pageView"
              : "errorPage"
          }
        },
        user: {
          userInfo: getUserInfo()
        },
        ...(!JSON.parse(errorConfig["errorPage"]) || errorConfig)
      });
    },

    /**
     * Method to call only for Prebooking Page after verify otp button clicked
     */
    trackPreBookPageView(pageViewName) {
      window.digitalData = window.digitalData || [];
      window.digitalData.push({
        event: !JSON.parse(errorConfig["errorPage"]) ? "pageView" : "errorPage",
        page: {
          pageInfo: {
            ...pageInfo,
            pageName: `${pageInfo.pageCategory}:${pageViewName}`,
            eventName: !JSON.parse(errorConfig["errorPage"])
              ? "pageView"
              : "errorPage"
          }
        },
        user: {
          userInfo: getUserInfo()
        },
        ...(!JSON.parse(errorConfig["errorPage"]) || errorConfig)
      });
    },

    /**
     * Method to call on Service not available
     * @param {object} customLink
     * @param {object} location
     * @param {object} error
     * @param {string} additionalPageName
     * @param {string} additionalJourneyName
     */
    trackServiceNotAvailable(
      customLink,
      location,
      error,
      additionalPageName,
      additionalJourneyName
    ) {
      window.adobeDataLayer = window.adobeDataLayer || [];
      window.adobeDataLayer.push({
        event: "serviceNotAvailable",
        page: {
          pageInfo: {
            ...pageInfo,
            pageName: this.getDynamicPageName(additionalPageName),
            journeyName: this.getDynamicJourneyName(additionalJourneyName),
            eventName: "serviceNotAvailable"
          }
        },
        customLink: customLink,
        location: location,
        error: error,
        user: {
          userInfo: getUserInfo()
        }
      });
    },

    /**
     * Method to call on CTA click
     * @param {object} customLink
     * @param {string} additionalPageName
     * @param {string} additionalJourneyName
     * @param {function} redirectCallback
     */
    trackCtaClick(
      customLink,
      additionalPageName,
      additionalJourneyName,
      redirectCallback
    ) {
      window.adobeDataLayer = window.adobeDataLayer || [];
      window.adobeDataLayer.push({
        event: "ctaClick",
        page: {
          pageInfo: {
            ...pageInfo,
            pageName: this.getDynamicPageName(additionalPageName),
            journeyName: this.getDynamicJourneyName(additionalJourneyName),
            eventName: "ctaClick"
          }
        },
        customLink: customLink,
        user: {
          userInfo: getUserInfo()
        }
      });
      redirectCallback && redirectCallback();
    },

    /**
     * Method to call on CTA click
     * @param {object} customLink
     * @param {string} additionalPageName
     * @param {string} additionalJourneyName
     * @param {function} redirectCallback
     */
    trackCtaClickV2(
      customLink,
      additionalPageName,
      additionalJourneyName,
      redirectCallback
    ) {
      window.digitalData = window.digitalData || [];
      window.digitalData.push({
        event: "ctaButtonClick",
        page: {
          pageInfo: {
            ...pageInfo,
            pageName: this.getDynamicPageName(additionalPageName),
            journeyName: this.getDynamicJourneyName(additionalJourneyName)
          }
        },
        linkDetails: customLink,
        user: {
          userInfo: getUserInfo()
        }
      });
      redirectCallback && redirectCallback();
    },

    /**
     * Method to call on Register now click in login page
     * @param {object} customLink
     */
    trackRegisterNow(customLink) {
      window.digitalData = window.digitalData || [];
      window.digitalData.push({
        event: "ctaClick",
        page: {
          pageInfo: {
            ...pageInfo,
            pageName: "Login",
            journeyName: "Login",
            eventName: "ctaClick"
          }
        },
        customLink: customLink,
        user: {
          userInfo: getUserInfo()
        }
      });
    },

    /**
     * Method to call on Login link in Signup page
     * @param {object} customLink
     */
    trackLoginNow(customLink) {
      window.digitalData = window.digitalData || [];
      window.digitalData.push({
        event: "ctaClick",
        page: {
          pageInfo: {
            ...pageInfo,
            pageName: "Registration",
            journeyName: "Registration",
            eventName: "ctaClick"
          }
        },
        customLink: customLink,
        user: {
          userInfo: getUserInfo()
        }
      });
    },

    /**
     * Method to call after verify otp clicked in login page
     * @param {object} customLink
     */
    trackLoginOTPClick(customLink) {
      window.digitalData = window.digitalData || [];
      window.digitalData.push({
        event: "ctaButtonClick",
        page: {
          pageInfo: {
            ...pageInfo,
            pageName: "Login:Verify OTP",
            journeyName: "Login",
            eventName: "ctaClick"
          }
        },
        ctaDetails: customLink,
        user: {
          userInfo: getUserInfo()
        }
      });
    },

    /**
     * Method to call after verify otp clicked in singup page
     * @param {object} customLink
     */
    trackSignupOTPClick(customLink) {
      window.digitalData = window.digitalData || [];
      window.digitalData.push({
        event: "ctaButtonClick",
        page: {
          pageInfo: {
            ...pageInfo,
            pageName: "Registration",
            journeyName: "Registration",
            eventName: "ctaClick"
          }
        },
        ctaDetails: customLink,
        user: {
          userInfo: getUserInfo()
        }
      });
    },

    /**
     * Method to call after Change Number clicked in Pre-Booking pre login
     * @param {object} customLink
     */
    trackPreBookChangeNumber(customLink) {
      window.adobeDataLayer = window.adobeDataLayer || [];
      window.adobeDataLayer.push({
        event: "ctaClick",
        page: {
          pageInfo: {
            ...pageInfo,
            pageName: `${pageInfo.pageCategory}:Mobile Number`,
            eventName: "ctaClick"
          }
        },
        customLink: customLink,
        user: {
          userInfo: getUserInfo()
        }
      });
    },

    /**
     * Method to call after Agree link clicked in registration page
     * @param {object} customLink
     */
    trackTermsCondition(customLink, redirectCallback) {
      window.adobeDataLayer = window.adobeDataLayer || [];
      window.adobeDataLayer.push({
        event: "ctaClick",
        page: {
          pageInfo: {
            ...pageInfo,
            pageName: "Registration",
            journeyName: "Registration",
            eventName: "ctaClick"
          }
        },
        customLink: customLink,
        user: {
          userInfo: getUserInfo()
        }
      });
      redirectCallback && redirectCallback();
    },

    /**
     * Method to call on every social icon on the page
     * @param {object} customLink
     * @param {function} redirectCallback
     */
    trackSocialIcons(customLink, redirectCallback) {
      window.adobeDataLayer = window.adobeDataLayer || [];
      window.adobeDataLayer.push({
        event: "ctaClick",
        page: {
          pageInfo: {
            ...pageInfo,
            eventName: "ctaClick"
          }
        },
        customLink: customLink,
        user: {
          userInfo: getUserInfo()
        }
      });
      redirectCallback && redirectCallback();
    },

    /**
     * Method to call on Login Start
     */
    trackLoginStart() {
      window.digitalData = window.digitalData || [];
      const cleanedPageInfo = { ...pageInfo };
      delete cleanedPageInfo.platform;
      delete cleanedPageInfo.eventName;
      window.digitalData.push({
        event: "loginStart",
        page: {
          pageInfo: {
            ...cleanedPageInfo
          }
        },
        user: {
          userInfo: {
            status: userInfo.status
          }
        }
      });
    },

    /**
     * Method to call on Login Complete
     * @param {function} redirectCallback
     */
    trackLoginComplete(redirectCallback) {
      window.digitalData = window.digitalData || [];
      if (window._satellite && window.digitalData) {
        window.digitalData.push({
          page: {
            pageInfo: {
              ...pageInfo,
              pageName: "Login:Verify OTP",
              journeyName: "Login"
            }
          },
          user: {
            userInfo: getUserInfo()
          }
        });
        _satellite.track("loginComplete");
        redirectCallback && redirectCallback();
      }
    },
    /**
     * Method to call on Login Complete Vida 2.0
     * paran not available
     */
    trackLoginCompleteVida2() {
      window.digitalData = window.digitalData || [];
      if (window._satellite && window.digitalData) {
        window.digitalData.push({
          page: {
            pageInfo: {
              ...pageInfo,
              pageName: "Login:Verify OTP",
              journeyName: "Login"
            }
          },
          user: {
            userInfo: getUserInfo()
          }
        });
        _satellite.track("loginComplete");
      }
    },

    /**
     * Method to call on Signup Start
     */
    trackSignupStart() {
      window.digitalData = window.digitalData || [];
      const cleanedPageInfo = { ...pageInfo };
      delete cleanedPageInfo.platform;
      delete cleanedPageInfo.eventName;
      window.digitalData.push({
        event: "signupStart",
        page: {
          pageInfo: {
            ...cleanedPageInfo
          }
        },
        user: {
          userInfo: {
            status: userInfo.status
          }
        }
      });
    },

    /**
     * Method to call on Signup Complete
     * @param {string} redirectCallback
     */
    trackSignupComplete(redirectCallback) {
      window.adobeDataLayer = window.adobeDataLayer || [];
      window.adobeDataLayer.push({
        event: "signupComplete",
        page: {
          pageInfo: {
            ...pageInfo,
            pageName: "Signup:Verify OTP",
            journeyName: "Registration",
            eventName: "signupComplete"
          }
        },
        user: {
          userInfo: getUserInfo()
        }
      });
      redirectCallback && redirectCallback();
    },
    /**
     * Method to call on Signup Complete Vida 2.0
     * paran not available
     */
    trackSignupCompleteVida2() {
      window.digitalData = window.digitalData || [];
      if (window._satellite && window.digitalData) {
        window.digitalData.push({
          page: {
            pageInfo: {
              ...pageInfo,
              pageName: "Signup:Verify OTP",
              journeyName: "Registration"
            }
          },
          user: {
            userInfo: getUserInfo()
          }
        });
        _satellite.track("signupComplete");
      }
    },

    /**
     * Method to call on update profile
     * @param {object} profileDetails
     */
    trackUpdateProfile(location) {
      window.digitalData = window.digitalData || [];
      const cleanedPageInfo = { ...pageInfo };
      delete cleanedPageInfo.platform;
      delete cleanedPageInfo.eventName;
      window.digitalData.push({
        event: "updateProfile",
        page: {
          pageInfo: {
            ...cleanedPageInfo,
            journeyName: "Update Profile"
          }
        },
        location: location,
        user: {
          userInfo: getUserInfo()
        }
      });
    },

    /**
     * Method to call on Test drive booking start
     */
    trackTestDriveBookingStart() {
      window.digitalData = window.digitalData || [];
      if (window._satellite && window.digitalData) {
        window.digitalData.push({
          page: {
            pageInfo: {
              ...pageInfoV2
            }
          },
          user: {
            userInfo: getUserInfo()
          },
          bookingDetails: {
            bookingStatus: "Test Drive Booking Start"
          }
        });
        _satellite.track("testDriveBookingStart");
      }
    },

    /**
     * Method to call on custom button click event
     * @param {object} customLink
     * @param {object} location
     * @param {object} productDetails
     * @param {string} additionalPageName
     * @param {string} additionalJourneyName
     * @param {url} redirectCallback
     */
    trackCustomButtonClick(
      customLink,
      location,
      productDetails,
      additionalPageName,
      additionalJourneyName,
      redirectCallback
    ) {
      window.adobeDataLayer.push({
        event: "customButtonClick",
        page: {
          pageInfo: {
            ...pageInfo,
            pageName: this.getDynamicPageName(additionalPageName),
            journeyName: this.getDynamicJourneyName(additionalJourneyName),
            eventName: "customButtonClick"
          }
        },
        user: {
          userInfo: getUserInfo()
        },
        customLink: customLink,
        location: location,
        productDetails: productDetails
      });
      redirectCallback && redirectCallback();
    },

    trackCustomButtonClickV2(
      eventName,
      customLink,
      // location,
      productDetails
      // formDetails
    ) {
      window.digitalData.push({
        event: eventName,
        page: {
          pageInfo: {
            ...pageInfoV2
          }
        },
        user: {
          userInfo: getUserInfo()
        },
        productDetails: productDetails,
        // location: location,
        linkDetails: customLink
        // formDetails: formDetails
      });
      // window._satellite.track(eventName);
    },

    /**
     * Method to call page load on shortterm/longterm
     * @param {string} additionalPageName
     * @param {string} testDriveType
     */
    trackTestdrivePageLoad(additionalPageName, testDriveType) {
      window.adobeDataLayer = window.adobeDataLayer || [];
      window.adobeDataLayer.push({
        event: "pageView",
        page: {
          pageInfo: {
            ...pageInfo,
            pageName: `${pageInfo.pageCategory}${additionalPageName}`,
            journeyName: `${pageInfo.pageCategory} Booking`,
            eventName: "pageView"
          }
        },
        bookingDetails: {
          testDriveType: testDriveType
        },
        user: {
          userInfo: getUserInfo()
        }
      });
    },

    /**
     * Method to call on custom button click event
     * @param {object} customLink
     * @param {object} location
     * @param {object} productDetails
     * @param {string} additionalPageName
     * @param {string} additionalJourneyName
     * @param {url} redirectCallback
     */
    trackNotificationCBClick(
      customLink,
      location,
      productDetails,
      bookingDetails,
      additionalPageName,
      additionalJourneyName,
      redirectCallback
    ) {
      window.adobeDataLayer.push({
        event: "customButtonClick",
        page: {
          pageInfo: {
            ...pageInfo,
            pageName: this.getDynamicPageName(additionalPageName),
            journeyName: this.getDynamicJourneyName(additionalJourneyName),
            eventName: "customButtonClick"
          }
        },
        user: {
          userInfo: getUserInfo()
        },
        customLink: customLink,
        location: location,
        productDetails: productDetails,
        bookingDetails: bookingDetails
      });
      redirectCallback && redirectCallback();
    },

    /**
     * Method to call on Test drive booking complete
     * @param {object} location
     * @param {object} productDetails
     * @param {object} bookingDetails
     * @param {object} order
     */
    trackTestDriveComplete(location, productDetails, bookingDetails, order) {
      window.digitalData.push({
        event: "testDriveBookingComplete",
        page: {
          pageInfo: {
            ...pageInfoV2,
            pageName: `${pageInfo.pageCategory}:Booking Confirmation`,
            journeyName: `${pageInfo.pageCategory} Booking`
          }
        },
        user: {
          userInfo: getUserInfo()
        },
        productDetails: productDetails,
        location: location,
        bookingDetails: bookingDetails
      });
      if ("" !== order) {
        window.digitalData.order = order;
      }
    },

    /**
     * Method to call on Test drive cancel booking
     * @param {object} location
     * @param {object} productDetails
     * @param {object} bookingDetails
     * @param {object} cancellation
     */
    trackTestRideCancel(
      location,
      productDetails,
      bookingDetails,
      cancellation
    ) {
      window.digitalData = window.digitalData || [];
      const data = {
        event: "testRideCancelBooking",
        page: {
          pageInfo: {
            ...pageInfoV2,
            pageName: `Test Drive:Cancellation`,
            journeyName: `Test Drive Cancellation`
          }
        },
        user: {
          userInfo: getUserInfo()
        },
        location: location,
        bookingDetails: bookingDetails,
        cancellation: cancellation
      };
      if ("" !== productDetails) {
        data.productDetails = productDetails;
      }
      window.digitalData.push(data);
    },

    /**
     * Method to call on Test drive Reschedule
     * @param {object} location
     * @param {object} productDetails
     * @param {object} bookingDetails
     */
    trackTestRideReschedule(
      location,
      productDetails,
      bookingDetails,
      redirectCallback
    ) {
      window.digitalData = window.digitalData || [];
      window.digitalData.push({
        event: "testRideReschedule",
        page: {
          pageInfo: {
            ...pageInfoV2,
            pageName: `${pageInfo.pageCategory}:Reschedule Confimation`,
            journeyName: `${pageInfo.pageCategory} Rescheduled`
          }
        },
        user: {
          userInfo: getUserInfo()
        },
        location: location,
        bookingDetails: bookingDetails
      });

      if ("" !== productDetails) {
        window.digitalData.productDetails = productDetails;
      }

      redirectCallback && redirectCallback();
    },

    /**
     * Method to call on Pre booking start
     */
    trackPreBookingStart(location) {
      window.digitalData = window.digitalData || [];
      if (window._satellite && window.digitalData) {
        window.digitalData.push({
          page: {
            pageInfo: {
              ...pageInfoV2
            }
          },
          user: {
            userInfo: getUserInfo()
          },
          location: location || getUserLocation(),
          bookingDetails: {
            bookingStatus: "Reserve Start"
          }
        });
        _satellite.track("reserveStart");
      }
    },

    /**
     * Method to call on Buy Form Start
     */

    trackBuyFormStart(location) {
      window.digitalData = window.digitalData || [];
      if (window._satellite && window.digitalData) {
        window.digitalData.push({
          page: {
            pageInfo: {
              ...pageInfoV2
            }
          },
          user: {
            userInfo: getUserInfo()
          },
          location: location || getUserLocation(),
          bookingDetails: {
            bookingStatus: "Buy Form Start"
          },
          formDetails: {
            formType: "Buy" // As Reservation is not there, it will always be Buy
          }
        });
        _satellite.track("buyFormStart");
      }
    },

    /*
     * Method to call on Pre Booking Form Start
     */

    trackBuyPIIFormStart(formDetails, productDetails) {
      window.digitalData.push({
        event: "buyPIIformStart",
        page: {
          pageInfo: {
            ...pageInfoV2
          }
        },
        productDetails: productDetails,
        bookingDetails: {
          bookingStatus: "Buy Start"
        },
        user: {
          userInfo: getUserInfo()
        },
        formDetails: formDetails
      });
    },
    /**
     * Method to call on Pre booking Continue Button Click
     * @param {object} location
     * @param {object} productDetails
     */
    trackPreBookingPayment(location, productDetails) {
      window.digitalData.push({
        event: "reservePaymentinitiated",
        page: {
          pageInfo: {
            ...pageInfoV2
          }
        },
        user: {
          userInfo: getUserInfo()
        },
        location: location,
        productDetails: productDetails
      });
    },

    /**
     * Method to call on Pre booking Complete
     * @param {object} location
     * @param {object} productDetails
     * @param {object} bookingDetails
     * @param {object} orderDetails
     */
    trackPreBookingComplete(
      location,
      productDetails,
      bookingDetails,
      orderDetails
    ) {
      window.digitalData.push({
        event: "reserveComplete",
        page: {
          pageInfo: {
            ...pageInfoV2
          }
        },
        user: {
          userInfo: getUserInfo()
        },
        location: location,
        productDetails: productDetails,
        bookingDetails: bookingDetails,
        orderDetails: orderDetails
      });
    },

    /**
     * Method to call on Pre booking Complete
     * @param {object} productDetails
     * @param {object} bookingDetails
     * @param {object} cancellation
     */
    trackPreBookingCancel(productDetails, bookingDetails, cancellation) {
      if (window._satellite && window.digitalData) {
        window.digitalData.push({
          event: "reserveCancel",
          page: {
            pageInfo: {
              ...pageInfoV2
            }
          },
          user: {
            userInfo: getUserInfo()
          },
          productDetails: productDetails,
          bookingDetails: bookingDetails,
          cancellation: cancellation
        });
        _satellite.track("reserveCancel");
      }
    },
    /**
     * Method to call Contactus
     * @param {string} journeyName
     * @param {string} eventName
     * @param {object} customLink
     */
    trackContactus(journeyName, eventName, customLink) {
      window.adobeDataLayer.push({
        event: eventName,
        page: {
          pageInfo: {
            ...pageInfo,
            journeyName: journeyName,
            eventName: eventName
          }
        },
        customLink: customLink,
        user: {
          userInfo: getUserInfo()
        }
      });
    },

    /**
     * Method to call Booking start for purchase configurator page
     * @param {object} productDetails
     * @param {object} location
     * @param {object} configuratorDetails
     */
    trackBookingStart(productDetails, location, configuratorDetails) {
      window.adobeDataLayer.push({
        event: "bookingStart",
        page: {
          pageInfo: {
            ...pageInfo,
            eventName: "bookingStart"
          }
        },
        productDetails: productDetails,
        location: location,
        configuratorDetails: configuratorDetails,
        bookingDetails: {
          bookingStatus: "Booking Start"
        },
        user: {
          userInfo: getUserInfo()
        }
      });
    },

    trackBookingVida2Start(productDetails) {
      if (window._satellite && window.digitalData) {
        window.digitalData.push({
          event: "purchaseStart",
          page: {
            pageInfo: {
              ...pageInfoV2
            }
          },
          user: {
            userInfo: getUserInfo()
          },
          productDetails: productDetails,
          bookingDetails: {
            bookingStatus: "Buy Start"
          }
        });
        window._satellite.track("purchaseStart");
      }
    },

    trackDownloadClick(productDetails, document) {
      window.digitalData.push({
        event: "downloadClick",
        pageInfo: {
          pageInfo: { ...pageInfoV2 }
        },
        user: {
          userInfo: getUserInfo()
        },
        productDetails: productDetails,
        documentDetails: {
          documentName: document
        }
      });
    },

    /**
     * Method to call Booking Checkout triggered
     * @param {object} customLink
     * @param {object} location
     * @param {object} productDetails
     *  * @param {object} bookingDetails
     * @param {object} priceBreakup
     * @param {object} configuratorDetails
     */
    trackBookingCheckout(
      location,
      productDetails,
      bookingDetails,
      priceBreakup,
      configuratorDetails,
      customLink,
      redirectCallback
    ) {
      window.adobeDataLayer.push({
        event: "bookingCheckout",
        page: {
          pageInfo: {
            ...pageInfo,
            pageName: "Booking:Details",
            eventName: "bookingCheckout"
          }
        },
        customLink: customLink,
        location: location,
        productDetails: productDetails,
        bookingDetails: bookingDetails,
        priceBreakup: priceBreakup,
        configuratorDetails: configuratorDetails,
        user: {
          userInfo: getUserInfo()
        }
      });

      redirectCallback && redirectCallback();
    },

    /**
     * Method to call Booking payment initiated
     * @param {object} customLink
     * @param {object} location
     * @param {object} productDetails
     */
    trackBookingPayment(customLink, location, productDetails) {
      window.adobeDataLayer.push({
        event: "bookingPaymentInitiated",
        page: {
          pageInfo: {
            ...pageInfo,
            pageName: "Booking:Billing Details",
            eventName: "bookingPaymentInitiated"
          }
        },
        customLink: customLink,
        location: location,
        productDetails: productDetails,
        user: {
          userInfo: getUserInfo()
        }
      });
    },

    trackBookingPaymentVida2(location, productDetails) {
      window.digitalData.push({
        event: "buyPaymentInitiated",
        page: {
          pageInfo: {
            ...pageInfoV2,
            pageName: "Buy:Payment Details"
          }
        },
        location: location,
        productDetails: productDetails,
        user: {
          userInfo: getUserInfo()
        }
      });
    },
    /**
     * Method to call Booking complete
     * @param {object} location
     * @param {object} productDetails
     * @param {object} insuranceDetails
     * @param {object} bookingDetails
     * @param {object} order
     * @param {object} priceBreakup
     *  @param {object} configuratorDetails
     */
    trackBookingComplete(
      location,
      productDetails,
      insuranceDetails,
      bookingDetails,
      order,
      priceBreakup,
      configuratorDetails
    ) {
      window.adobeDataLayer.push({
        event: "bookingComplete",
        page: {
          pageInfo: {
            ...pageInfo,
            pageName: "Booking:Completed",
            eventName: "bookingComplete"
          }
        },
        location: location,
        productDetails: productDetails,
        insuranceDetails: insuranceDetails,
        bookingDetails: bookingDetails,
        order: order,
        priceBreakup: priceBreakup,
        configuratorDetails: configuratorDetails,
        user: {
          userInfo: getUserInfo()
        }
      });
    },

    trackBookingCompleteV2(
      location,
      productDetails,
      insuranceDetails,
      bookingDetails,
      orderDetails,
      priceBreakup
    ) {
      window.digitalData.push({
        event: "buyComplete",
        page: {
          pageInfo: {
            ...pageInfoV2
          }
        },
        user: {
          userInfo: getUserInfo()
        },
        location: location,
        productDetails: productDetails,
        insuranceDetails: insuranceDetails,
        bookingDetails: bookingDetails,
        orderDetails: orderDetails,
        priceBreakup: priceBreakup
      });
    },

    /**
     * Method to call on filling nominee details
     */
    trackNominee(redirectCallback) {
      window.adobeDataLayer.push({
        event: "nomineeDetailUpdated",
        page: {
          pageInfo: {
            ...pageInfo,
            pageName: "Booking:Nominee details",
            eventName: "nomineeDetailUpdated"
          }
        },
        bookingDetails: {
          bookingStatus: "Nominee Details Updated"
        },
        customLink: {
          name: "Submit",
          position: "Bottom",
          type: "Button",
          clickType: "other"
        },
        user: {
          userInfo: getUserInfo()
        }
      });

      redirectCallback && redirectCallback();
    },

    trackNomineeDetailsVida2(bookingDetails) {
      window.digitalData.push({
        event: "nomineeDetailUpdated",
        page: {
          pageInfo: {
            ...pageInfoV2
          }
        },
        user: {
          userInfo: getUserInfo()
        },
        bookingDetails: bookingDetails
      });
    },

    /**
     * Method to call on upload documents
     * @param {object} documentDetails
     * @param {function} redirectCallback
     *
     */
    trackDocument(documentDetails, productDetails, redirectCallback) {
      window.adobeDataLayer.push({
        event: "documentUploadCompleted",
        page: {
          pageInfo: {
            ...pageInfo,
            pageName: "Booking:Upload Documents",
            eventName: "documentUploadCompleted"
          }
        },
        bookingDetails: {
          bookingStatus: "Documents Uploaded Successfully"
        },
        customLink: {
          name: "Submit",
          position: "Bottom",
          type: "Button",
          clickType: "other"
        },
        documentDetails: documentDetails,
        user: {
          userInfo: getUserInfo()
        }
      });

      window.digitalData.push({
        event: "documentUploadCompleted",
        page: {
          pageInfo: {
            ...pageInfoV2,
            pageName: "Buy:Upload Documents",
            eventName: "documentUploadCompleted"
          }
        },
        bookingDetails: {
          bookingStatus: "Documents Uploaded Successfully"
        },
        documentDetails: documentDetails,
        productDetails: productDetails,
        user: {
          userInfo: getUserInfo()
        }
      });

      redirectCallback && redirectCallback();
    },

    /**
     * Method to call aadhar card status
     * @param {string} additionalPageName
     * @param {string} bookingStatus
     *
     */
    trackAadharCard(additionalPageName, bookingStatus) {
      window.adobeDataLayer = window.adobeDataLayer || [];
      window.adobeDataLayer.push({
        event: "aadharCardVerification",
        page: {
          pageInfo: {
            ...pageInfo,
            pageName: this.getDynamicPageName(additionalPageName),
            eventName: "aadharCardVerification"
          }
        },
        bookingDetails: {
          bookingStatus: bookingStatus
        },
        user: {
          userInfo: getUserInfo()
        }
      });

      window.digitalData.push({
        event: "aadharCardVerification",
        page: {
          pageInfo: {
            ...pageInfo,
            pageName: this.getDynamicPageName(additionalPageName),
            eventName: "aadharCardVerification"
          }
        },
        bookingDetails: {
          bookingStatus: bookingStatus
        },
        user: {
          userInfo: getUserInfo()
        }
      });
    },

    /**
     * Method to call hero sure registration start
     */
    trackExchangeStart() {
      window.adobeDataLayer = window.adobeDataLayer || [];
      window.adobeDataLayer.push({
        event: "exchangeTwoWheelerStart",
        page: {
          pageInfo: {
            ...pageInfo,
            pageName: "Exchange Two-Wheeler:Start",
            journeyName: "Exchange Two-Wheeler",
            eventName: "exchangeTwoWheelerStart"
          }
        },
        user: {
          userInfo: getUserInfo()
        }
      });
    },

    /**
     * Method to call hero sure page load
     */
    trackExchangePageLoad(additionalPageName) {
      window.adobeDataLayer = window.adobeDataLayer || [];
      window.adobeDataLayer.push({
        event: "pageView",
        page: {
          pageInfo: {
            ...pageInfo,
            pageName: `Exchange Two-Wheeler${additionalPageName}`,
            journeyName: "Exchange Two-Wheeler",
            eventName: "pageView"
          }
        },
        user: {
          userInfo: getUserInfo()
        }
      });
    },

    /**
     * Method to call hero sure registration completed
     */
    trackExchangeCompleted() {
      window.adobeDataLayer = window.adobeDataLayer || [];
      window.adobeDataLayer.push({
        event: "exchangeTwoWheelerComplete",
        page: {
          pageInfo: {
            ...pageInfo,
            pageName: "Exchange Two-Wheeler:Completed",
            journeyName: "Exchange Two-Wheeler",
            eventName: "exchangeTwoWheelerComplete"
          }
        },
        user: {
          userInfo: getUserInfo()
        }
      });
    },

    /**
     * Method to call on Register now click in login page
     * @param {object} customLink
     * @param {string} additionalPageName
     */
    trackHeroSureCTAEvent(customLink, additionalPageName) {
      window.adobeDataLayer = window.adobeDataLayer || [];
      window.adobeDataLayer.push({
        event: "ctaClick",
        page: {
          pageInfo: {
            ...pageInfo,
            pageName: "Exchange Two-Wheeler" + additionalPageName,
            journeyName: "Exchange Two-Wheeler",
            eventName: "ctaClick"
          }
        },
        customLink: customLink,
        user: {
          userInfo: getUserInfo()
        }
      });
    },

    /**
     * Method to call on Quick reserve initiated
     * @param {object} location
     * @param {object} productDetails
     * @param {object} customLink
     * @param {function} redirectCallback
     */
    trackQuickReserveInit(
      location,
      productDetails,
      customLink,
      redirectCallback
    ) {
      window.adobeDataLayer = window.adobeDataLayer || [];
      window.adobeDataLayer.push({
        event: "quickReserveInitiated",
        page: {
          pageInfo: {
            ...pageInfo,
            journeyName: "Quick Reserve",
            eventName: "quickReserveInitiated"
          }
        },
        location: location,
        productDetails: productDetails,
        customLink: customLink,
        user: {
          userInfo: getUserInfo()
        }
      });
      redirectCallback && redirectCallback();
    },
    /**
     * Method to call page load on aadhar verification
     * @param {string} additionalPageName
     * @param {string} aadharVerified
     */
    trackAadharVerificationPageLoad(additionalPageName, aadharVerified) {
      window.adobeDataLayer = window.adobeDataLayer || [];
      window.adobeDataLayer.push({
        event: "pageView",
        page: {
          pageInfo: {
            ...pageInfo,
            pageName: `${pageInfo.pageCategory}${additionalPageName}`,
            journeyName: `Booking`,
            eventName: "pageView"
          }
        },
        bookingDetails: {
          aadharVerified: aadharVerified
        },
        user: {
          userInfo: getUserInfo()
        }
      });
    },

    /**
     * Method to call on page scroll
     * @param {string} scrollPercentage
     */
    trackPageScroll(scrollPercentage) {
      window.adobeDataLayer = window.adobeDataLayer || [];
      window.adobeDataLayer.push({
        event: "scrollTracking",
        page: {
          pageInfo: {
            ...pageInfo,
            pageName: this.getDynamicPageName(""),
            journeyName: this.getDynamicJourneyName(""),
            eventName: !JSON.parse(errorConfig["errorPage"])
              ? "pageView"
              : "errorPage"
          }
        },
        scrollPercentage,
        user: {
          userInfo: getUserInfo()
        },
        ...(!JSON.parse(errorConfig["errorPage"]) || errorConfig)
      });
    },

    /**
     * Method to call on page scroll
     * @param {string} scrollPercentage
     */

    vidatrackPageScrollDigital(scrollPercentage) {
      window.digitalData.push({
        event: "scrollTracking",
        page: {
          pageInfo: {
            ...pageInfo,
            pageName: this.getDynamicPageName(""),
            journeyName: this.getDynamicJourneyName(""),
            eventName: !JSON.parse(errorConfig["errorPage"])
              ? "pageView"
              : "errorPage"
          }
        },
        scrollPercentage,
        user: {
          userInfo: getUserInfo()
        },
        ...(!JSON.parse(errorConfig["errorPage"]) || errorConfig)
      });
    },
    /**
     * Tracks Web popup  events.
     * @param {Object}
     */
    trackLeadPopupEvents(event, formDetails) {
      if (event == "ctaButtonClick") {
        window.digitalData.push({
          event: event,
          page: {
            pageInfo: {
              ...pageInfoV2
            }
          },
          user: {
            userInfo: getUserInfo()
          },
          linkDetails: formDetails
        });
      } else {
        window.digitalData.push({
          event: event,
          page: {
            pageInfo: {
              ...pageInfoV2
            }
          },
          user: {
            userInfo: getUserInfo()
          },
          formDetails: formDetails
        });
      }
    },

    trackBuyJourneyDropOut(formDetails, errorDescription) {
      window.digitalData.push({
        event: "fielderror",
        page: {
          pageInfo: {
            ...pageInfoV2
          }
        },
        user: {
          userInfo: getUserInfo()
        },
        formDetails: formDetails,
        errorDescription: errorDescription
      });
    },

    trackCancelOrderComplete(
      eventName,
      linkDetails,
      location,
      productDetails,
      insuranceDetails,
      bookingDetails,
      orderDetails,
      priceBreakup
    ) {
      window.digitalData.push({
        event: eventName,
        page: {
          pageInfo: {
            ...pageInfoV2
          }
        },
        user: {
          userInfo: getUserInfo()
        },
        productDetails: productDetails,
        linkDetails: linkDetails,
        location: location,
        insuranceDetails: insuranceDetails,
        bookingDetails: bookingDetails,
        orderDetails: orderDetails,
        priceBreakup: priceBreakup
      });
      window._satellite.track(eventName);
    }
  };
  return utils;
}

const utils = analyticsUtils();
export default Object.freeze(utils);
