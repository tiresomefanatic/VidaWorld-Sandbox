import React, { useState } from "react";
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import dateUtils from "../../../../site/scripts/utils/dateUtils";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import appUtils from "../../../../site/scripts/utils/appUtils";
import { useUpdateTestRideDate } from "../../../hooks/testDrive/testDriveHooks";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";
import CONSTANT from "../../../../site/scripts/constant";
import { showNotificationDispatcher } from "../../../store/notification/notificationActions";

const SuccessPage = (props) => {
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const {
    title,
    message,
    rescheduleMessage,
    info,
    redirectBtn,
    buyLaterLabel,
    buyOptions,
    buyLaterBtn,
    buyLaterConfirmationMsg,
    noOptionSelectedMessage
  } = props.config;
  const { address, date, time } = props.appointmentDetails;
  const { testDriveId } = props;
  const profileUrl = appUtils.getPageUrl("profileUrl");
  const [buyLaterOption, setBuyLaterOption] = useState("");
  const [noOptionSelected, setNoOptionSelected] = useState(false);
  const updateTestRideTentativeDate = useUpdateTestRideDate();

  const handleRedirection = async (e) => {
    if (testDriveId) {
      if (isAnalyticsEnabled) {
        e.preventDefault();
        const customLink = {
          name: e.target.innerText,
          position: "Bottom",
          type: "Button",
          clickType: "other"
        };

        const additionalPageName = "";
        const additionalJourneyName = "";
        analyticsUtils.trackCtaClick(
          customLink,
          additionalPageName,
          additionalJourneyName,
          function () {
            window.location.href = profileUrl;
          }
        );
      } else {
        window.location.href = profileUrl;
      }
    }
    if (!buyLaterOption) {
      setNoOptionSelected(true);
    } else {
      setSpinnerActionDispatcher(true);

      const response = await updateTestRideTentativeDate({
        variables: {
          tentative_date_count: buyLaterOption,
          opportunity_id: Cookies.get(CONSTANT.COOKIE_OPPORTUNITY_ID)
        }
      });

      if (
        response.data &&
        response.data.updateTestRideTentativeDate &&
        response.data.updateTestRideTentativeDate.status_code === "200"
      ) {
        if (isAnalyticsEnabled) {
          e.preventDefault();
          const customLink = {
            name: e.target.innerText,
            position: "Bottom",
            type: "Button",
            clickType: "other"
          };

          const additionalPageName = "Test Ride Success";
          const additionalJourneyName = "";
          analyticsUtils.trackCtaClick(
            customLink,
            additionalPageName,
            additionalJourneyName,
            function () {
              showNotificationDispatcher(
                {
                  title: buyLaterConfirmationMsg,
                  type:
                    // scheduleDelivery.data.scheduleDelivery.status === true
                    // ?
                    CONSTANT.NOTIFICATION_TYPES.SUCCESS,
                  // : CONSTANT.NOTIFICATION_TYPES.ERROR
                  isVisible: true
                },
                () => (window.location.href = profileUrl)
              );
            }
          );
        } else {
          window.location.href = profileUrl;
        }
      }
    }
  };
  const handleRadioBtn = (e) => {
    setNoOptionSelected(false);
    setBuyLaterOption(e.target.value);
  };

  const createOptions = () => {
    return buyOptions.map((option) => {
      return (
        <div key={option.value} className="form__group form__field-radio">
          <label className="form__field-label">
            {option.label}
            <input
              type="radio"
              name="buyOptions"
              id={option.value}
              value={option.value}
              checked={buyLaterOption === option.value}
              onChange={handleRadioBtn}
            ></input>
            <span className="form__field-radio-mark"></span>
          </label>
        </div>
      );
    });
  };

  return (
    <div className="vida-success-page">
      <div className="vida-success-page__title">{title}</div>
      <div className="vida-success-page__message">
        {testDriveId ? rescheduleMessage : message}
      </div>
      <div className="vida-success-page__appointment">
        <p>
          <i className="icon-location-marker"></i>
          <span>{address}</span>
        </p>
        <p>
          <i className="icon-calendar"></i>
          <span>{dateUtils.getFormatedDate(date, "dddd D MMMM, YYYY")}</span>
        </p>
        <p>
          <i className="icon-clock"></i>
          <span>{time}</span>
        </p>
      </div>

      <div className="vida-success-page__info">{info}</div>
      {!testDriveId && (
        <div className="vida-success-page__buy-later">
          <p className="txt-color--orange">{buyLaterLabel}</p>

          {buyOptions ? createOptions() : ""}
        </div>
      )}
      {!testDriveId && noOptionSelected && (
        <p className="vida-success-page__errors">{noOptionSelectedMessage}</p>
      )}

      <button
        className="btn btn--primary btn--lg"
        onClick={(e) => handleRedirection(e)}
      >
        {buyLaterBtn}
      </button>
    </div>
  );
};

SuccessPage.propTypes = {
  appointmentDetails: PropTypes.shape({
    address: PropTypes.string,
    date: PropTypes.string,
    time: PropTypes.string
  }),
  config: PropTypes.shape({
    title: PropTypes.string,
    message: PropTypes.string,
    rescheduleMessage: PropTypes.string,
    info: PropTypes.string,
    redirectBtn: PropTypes.shape({
      label: PropTypes.string,
      actionURL: PropTypes.string
    }),

    buyLaterLabel: PropTypes.string,
    buyOptions: PropTypes.array,
    buyLaterBtn: PropTypes.string,
    buyLaterConfirmationMsg: PropTypes.string,
    noOptionSelectedMessage: PropTypes.string
  }),
  testDriveId: PropTypes.string
};

SuccessPage.defaultProps = {
  config: {}
};

export default SuccessPage;
