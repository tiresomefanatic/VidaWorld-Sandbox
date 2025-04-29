import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { setSpinnerActionDispatcher } from "../../store/spinner/spinnerActions";
import appUtils from "../../../site/scripts/utils/appUtils";
import {
  useLongTermTestRideDetails,
  usePaymentURL
} from "../../hooks/testDrive/testDriveSummary/testDriveSummaryHooks";
import { cryptoUtils } from "../../../site/scripts/utils/encryptDecryptUtils";
import currencyUtils from "../../../site/scripts/utils/currencyUtils";
import dateUtils from "../../../site/scripts/utils/dateUtils";
import analyticsUtils from "../../../site/scripts/utils/analyticsUtils";

const TestDriveSummary = (props) => {
  const longTermTestDriveUrl = appUtils.getPageUrl("longTermTestDriveUrl");
  const { title, summaryDetails, terms, primaryBtn, backgroundImg } =
    props.config;
  const { firstName, lastName, country } = props;
  const userName = firstName + " " + lastName;
  const [checked, setChecked] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  const [termsError, setTermsError] = useState(false);
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();

  const { handleSubmit } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });
  let decryptedParams = "",
    bookingId;
  const queryString = location.href.split("?")[1];
  if (queryString) {
    decryptedParams = cryptoUtils.decrypt(queryString);
  }
  const params = new URLSearchParams(decryptedParams);
  const setPaymentURL = usePaymentURL();
  const getLongTermTestRideDetails = useLongTermTestRideDetails();
  const toggleTermsCheck = () => {
    setChecked(!checked);
    if (checked) {
      setTermsError(true);
    } else {
      setTermsError(false);
    }
  };

  const goToLongTermTestDriveForm = () => {
    if (params && params.has("bookingId")) {
      const encryptedParams = cryptoUtils.encrypt(
        `bookingId=${params.get(
          "bookingId"
        )}&isReschedule=false&country=${country}`
      );
      if (isAnalyticsEnabled) {
        const customLink = {
          name: "Back",
          position: "Bottom",
          type: "Icon",
          clickType: "other"
        };
        const ctaPageName = ":Long term Test Drive";
        const additionalJourneyName = "Booking";
        analyticsUtils.trackCtaClick(
          customLink,
          ctaPageName,
          additionalJourneyName,
          function () {
            window.location.href = `${longTermTestDriveUrl}?${encryptedParams}`;
          }
        );
      } else {
        window.location.href = `${longTermTestDriveUrl}?${encryptedParams}`;
      }
    }
  };

  const handleMakePayment = async (formData, event) => {
    if (params && params.has("bookingId")) {
      bookingId = params.get("bookingId");
      setSpinnerActionDispatcher(true);
      const res = await setPaymentURL({
        variables: {
          testRideId: parseInt(bookingId)
        }
      });
      if (
        res.data &&
        res.data.freedoCreatePayment &&
        res.data.freedoCreatePayment.payment_url
      ) {
        if (isAnalyticsEnabled) {
          const customLink = {
            name: event.nativeEvent.submitter.innerText,
            position: "Bottom",
            type: "Button",
            clickType: "other"
          };
          const ctaPageName = ":Long term Test Drive";
          const additionalJourneyName = "Booking";
          analyticsUtils.trackCtaClick(
            customLink,
            ctaPageName,
            additionalJourneyName,
            function () {
              window.location.href = res.data.freedoCreatePayment.payment_url;
            }
          );
        } else {
          window.location.href = res.data.freedoCreatePayment.payment_url;
        }
      }
    }
  };

  const handleFormSubmit = async (formData, event) => {
    try {
      if (checked) {
        handleMakePayment(formData, event);
      } else {
        setTermsError(true);
      }
    } catch (error) {
      Logger.error(error);
    }
  };

  useEffect(() => {
    setSpinnerActionDispatcher(true);
    if (params && params.has("bookingId")) {
      bookingId = params.get("bookingId");
      getLongTermTestRideDetails({
        variables: {
          bookingId: parseInt(bookingId)
        }
      }).then((res) => {
        if (
          res.data.GetLongTermTestRideDataByID &&
          res.data.GetLongTermTestRideDataByID.statusCode === 200
        ) {
          setSummaryData(res.data.GetLongTermTestRideDataByID);
        }
      });

      if (isAnalyticsEnabled) {
        const additionalPageName = ":Long Term Test Drive Summary";
        const additionalJourneyName = "Booking";
        analyticsUtils.trackPageLoad(additionalPageName, additionalJourneyName);
      }
    }
  }, []);

  return (
    <>
      {summaryData ? (
        <div className="vida-test-drive__container">
          <div className="vida-test-drive__asset vida-test-drive__asset-block">
            <img src={backgroundImg} alt="Vida Test Drive" />
          </div>
          <div className="vida-test-drive__content vida-test-drive__content-summary">
            <h2>{title}</h2>

            <div className="vida-test-drive__content-items">
              <div className="vida-test-drive__display-fields">
                <h3 className="vida-test-drive__content-header">
                  <span className="vida-test-drive__content-items-label">
                    <p className="vida-test-drive__content-items-label-item">
                      {summaryDetails.amountLabel}
                    </p>
                    <p className="vida-test-drive__content-items-penal-statement">
                      {summaryDetails.disclaimer}
                    </p>
                  </span>
                  <span className="vida-test-drive__content-items-value">
                    {summaryData &&
                      currencyUtils.getCurrencyFormatValue(
                        summaryData["price"]
                      )}
                  </span>
                </h3>
                {/* <div className="vida-test-drive__content-fare">
              <div className="vida-test-drive__content-fare-item">
                <span className="vida-test-drive__content-fare-label">
                  {summaryDetails.baseLabel}
                </span>
                <span className="vida-test-drive__content-fare-label">
                  ₹150
                </span>
              </div>
              <div className="vida-test-drive__content-fare-item">
                <span className="vida-test-drive__content-fare-label">
                  {summaryDetails.taxLabel}
                </span>
                <span className="vida-test-drive__content-fare-label">₹50</span>
              </div>
            </div> */}
                <div className="vida-test-drive__content-details">
                  {userName && (
                    <div className="vida-test-drive__content-data">
                      <i className="icon-user"></i>
                      <span className="h4-md">{userName}</span>
                    </div>
                  )}

                  {summaryData &&
                    (summaryData.address1 ||
                      summaryData.address2 ||
                      summaryData.landmark ||
                      summaryData.zip) && (
                      <div className="vida-test-drive__content-data">
                        <i className="icon-location-marker"></i>
                        <span className="h4-md">
                          {summaryData.address1 && summaryData.address1 + ", "}
                          {summaryData.address2 && summaryData.address2 + ", "}
                          {summaryData.landmark && summaryData.landmark + ", "}
                          {summaryData.zip}
                        </span>
                      </div>
                    )}

                  {summaryData && summaryData.startDate && (
                    <div className="vida-test-drive__content-data">
                      <i className="icon-calendar"></i>
                      <span className="h4-md">
                        {dateUtils.getFormatedDate(
                          summaryData.startDate,
                          "dddd D MMMM, YYYY"
                        )}
                      </span>
                    </div>
                  )}

                  {summaryData && summaryData.startTime && summaryData.endTime && (
                    <div className="vida-test-drive__content-data">
                      <i className="icon-clock"></i>
                      <span className="h4-md">
                        {summaryData.startTime} - {summaryData.endTime}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <form
                className="form vida-test-summary-form"
                onSubmit={handleSubmit((formData, event) =>
                  handleFormSubmit(formData, event)
                )}
              >
                <div className="vida-test-drive__content-terms">
                  <div className="form__group form__field-checkbox">
                    <label className="vida-test-drive__label">
                      {terms}
                      <input
                        type="checkbox"
                        name="agreeTerms"
                        htmlFor="terms"
                        className={termsError ? "checkbox__error" : ""}
                        defaultChecked={checked}
                        onChange={() => toggleTermsCheck()}
                      ></input>
                      <span className="form__field-checkbox-mark"></span>
                    </label>
                  </div>
                </div>
                <div className="vida-test-drive__btn-container">
                  <button
                    type="button"
                    className="btn--round"
                    onClick={goToLongTermTestDriveForm}
                  >
                    <i className="icon-arrow-narrow"></i>
                  </button>
                  <button
                    type="submit"
                    className="btn btn--primary"
                    disabled={!checked}
                  >
                    {primaryBtn.label}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

TestDriveSummary.propTypes = {
  config: PropTypes.object,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  country: PropTypes.string
};

TestDriveSummary.defaultProps = {};

const mapStateToProps = ({ userProfileDataReducer }) => {
  return {
    firstName: userProfileDataReducer.fname,
    lastName: userProfileDataReducer.lname,
    country: userProfileDataReducer.country
  };
};
export default connect(mapStateToProps)(TestDriveSummary);
