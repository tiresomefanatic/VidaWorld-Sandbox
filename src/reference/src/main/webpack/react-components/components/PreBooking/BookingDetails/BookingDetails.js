import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setPreBookingUserDataAction } from "../../../store/preBooking/preBookingActions";
import { useForm } from "react-hook-form";
import { useUserData } from "../../../hooks/userProfile/userProfileHooks";
import { usePincode } from "../../../hooks/preBooking/preBookingHooks";
import Logout from "../../Logout/Logout";
import CONSTANT from "../../../../site/scripts/constant";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";
import NumberField from "../../form/NumberField/NumberField";
import Popup from "../../Popup/Popup";
import Logger from "../../../../services/logger.service";

const BookingDetails = (props) => {
  const [isNotified, setNotified] = useState(false);
  const [isFormSubmitted, setFormSubmitted] = useState(false);
  const [showChangePincode, setshowChangePincode] = useState(false);
  const [isOverridePopup, setOverridePopup] = useState(false);
  const [updatedCityState, setUpdatedCityState] = useState([]);
  const [profileData, setProfileData] = useState({});
  const getUserData = useUserData();
  useEffect(() => {
    //REF: Hide spinner for remaining API calls
    // setSpinnerActionDispatcher(true);
    getUserData();
  }, []);
  const {
    personalDetails,
    setPreBookingUserInfo,
    userData,
    showSteps,
    showBookingSummaryFields,
    genericConfig,
    overrideInfo,
    updateOverridePrice
  } = props;
  const {
    pinCodeField,
    checkAvailabilityBtn,
    welcomeTitle,
    switchAccount,
    // promotionBanner,
    notificationBtn,
    changePincodeLabel
  } = personalDetails;
  const {
    register,
    handleSubmit,
    setError,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });

  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();

  const onChangePincode = (e) => {
    e.preventDefault();
    reset({ pincode: "" });
    setNotified(false);
    setshowChangePincode(false);

    if (isAnalyticsEnabled) {
      const customLink = {
        name: e.target.innerText,
        position: "Middle",
        type: "Link",
        clickType: "other"
      };
      const additionalPageName = ":Reserve for Pin Code";
      analyticsUtils.trackCtaClick(customLink, additionalPageName);
    }
  };

  const getPin = usePincode();

  //to handle form data Submission
  const handleFormSubmit = async (formData) => {
    setFormSubmitted(true);
    if (!isNotified) {
      setSpinnerActionDispatcher(true);
      const result = await getPin({
        variables: {
          postcode: formData.pincode
        }
      });
      if (result) {
        const items =
          result.data &&
          result.data.getNearByBranches &&
          result.data.getNearByBranches.items;
        if (items && items.length) {
          try {
            if (result.data.getNearByBranches.isSameCity) {
              setPreBookingUserInfo({
                pincode: formData.pincode,
                branchId: items[0].branches[0].id,
                partnerId: items[0].branches[0].partnerAccountId
              });
              showBookingSummaryFields(true);
            } else {
              const data = {
                pincode: formData.pincode,
                branchId: items[0].branches[0].id,
                partnerId: items[0].branches[0].partnerAccountId
              };

              const updatedCityState = [
                result.data.getNearByBranches.city,
                result.data.getNearByBranches.state,
                result.data.getNearByBranches.country
              ];
              setUpdatedCityState(updatedCityState);

              setProfileData(data);
              setSpinnerActionDispatcher(false);
              document.querySelector("html").classList.add("overflow-hidden");
              setOverridePopup(true);
            }
          } catch (error) {
            Logger.error(error);
          }
        } else {
          if (!result.data.getNearByBranches.isSameCity) {
            updateOverridePrice &&
              updateOverridePrice(
                result.data.getNearByBranches.city,
                result.data.getNearByBranches.state,
                result.data.getNearByBranches.country
              );
          }
          setError("pincode", { type: "validate" });
          setNotified(true);
          setshowChangePincode(true);
          if (isAnalyticsEnabled) {
            const customLink = {
              name: "Get Notified",
              position: "Bottom",
              type: "Button",
              clickType: "other"
            };
            const location = {
              state: "",
              city: "",
              pinCode: formData.pincode,
              country: ""
            };
            const error = {
              errorType: "Validation Error",
              errorDescription:
                "Unfortunately, we don't have service in your area yet."
            };
            const additionalPageName = ":Reserve for Pin Code";
            analyticsUtils.trackServiceNotAvailable(
              customLink,
              location,
              error,
              additionalPageName
            );
          }
        }
      }
    } else {
      showBookingSummaryFields(false);
    }
  };

  const cancelOverride = () => {
    reset({ pincode: "" });
    setNotified(false);
    setshowChangePincode(false);
    setOverridePopup(false);
    document.querySelector("html").classList.remove("overflow-hidden");
  };

  const overrideProfileData = () => {
    setPreBookingUserInfo(profileData);
    setOverridePopup(false);
    document.querySelector("html").classList.remove("overflow-hidden");
    updateOverridePrice &&
      updateOverridePrice(
        updatedCityState[0],
        updatedCityState[1],
        updatedCityState[2]
      );
    showBookingSummaryFields(true);
  };

  useEffect(() => {
    if (userData.pincode && !isFormSubmitted) {
      setValue("pincode", userData.pincode);
    }
  }, [userData]);

  return (
    <div className="form vida-booking-details__register">
      <div className="form vida-booking-details__step">
        <p>
          {genericConfig.stepLabel}
          <span>{showSteps}</span>
          <span>of {CONSTANT.PRE_BOOKING_STEPS.TOTAL_STEPS}</span>
        </p>
      </div>
      <div>
        <h1 className="vida-booking-details__title">{welcomeTitle}</h1>
        <h2 className="vida-booking-details__user-name">
          {`${userData.fname} ${userData.lname}`}
        </h2>
      </div>
      <form onSubmit={handleSubmit((formData) => handleFormSubmit(formData))}>
        <div className="vida-booking-details__pincode">
          <NumberField
            name="pincode"
            label={pinCodeField.label}
            placeholder={pinCodeField.placeholder}
            validationRules={pinCodeField.validationRules}
            register={register}
            errors={errors}
            isDisabled={showChangePincode}
            maxLength={CONSTANT.RESTRICT_PINCODE}
            value=""
            setValue={setValue}
          />
        </div>
        {showChangePincode && (
          <div className="vida-booking-details__change-value">
            <a
              href=""
              onClick={(e) => {
                onChangePincode(e);
              }}
            >
              {changePincodeLabel}
            </a>
          </div>
        )}
        <div className="vida-booking-details__btn-container">
          {!isNotified ? (
            <button type="submit" className="btn btn--primary full-width">
              {checkAvailabilityBtn.label}
            </button>
          ) : (
            <button type="submit" className="btn btn--primary full-width">
              {notificationBtn.label}
              <i className="icon-bell"></i>
            </button>
          )}
        </div>
        {/* <div className="vida-booking-details__promo-banner">
          <div className=" vida-booking-details__scooter-icon">
            <i className="icon-scooter"></i>
          </div>
          <label>{promotionBanner}</label>
        </div> */}
        <div className="vida-booking-details__switch-account">
          <p>{switchAccount.message}</p>
          <Logout label={switchAccount.redirectionLabel} />
        </div>
      </form>
      {isOverridePopup && (
        <Popup handlePopupClose={cancelOverride}>
          <h3>{overrideInfo.title}</h3>
          <p>{overrideInfo.content}</p>
          <div>
            <button className="btn btn--secondary" onClick={cancelOverride}>
              {overrideInfo.cancelBtn.label}
            </button>
            <button className="btn btn--primary" onClick={overrideProfileData}>
              {overrideInfo.overrideBtn.label}
            </button>
          </div>
        </Popup>
      )}
    </div>
  );
};

const mapStateToProps = ({ userProfileDataReducer }) => {
  return {
    userData: {
      fname: userProfileDataReducer.fname,
      lname: userProfileDataReducer.lname,
      pincode: userProfileDataReducer.pincode
    }
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setPreBookingUserInfo: (data) => {
      dispatch(setPreBookingUserDataAction(data));
    }
  };
};

BookingDetails.propTypes = {
  personalDetails: PropTypes.shape({
    welcomeTitle: PropTypes.string,
    message: PropTypes.string,
    changePincodeLabel: PropTypes.string,
    pinCodeField: PropTypes.shape({
      label: PropTypes.string,
      placeholder: PropTypes.string,
      validationRules: PropTypes.object
    }),
    switchAccount: PropTypes.shape({
      message: PropTypes.string,
      redirectionLabel: PropTypes.string
    }),
    checkAvailabilityBtn: PropTypes.shape({
      label: PropTypes.string
    }),
    notificationBtn: PropTypes.shape({
      label: PropTypes.string
    })
    // promotionBanner: PropTypes.string
  }),
  genericConfig: PropTypes.shape({
    stepLabel: PropTypes.string
  }),
  overrideInfo: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.string,
    overrideBtn: PropTypes.shape({
      label: PropTypes.string
    }),
    cancelBtn: PropTypes.shape({
      label: PropTypes.string
    })
  }),
  setPreBookingUserInfo: PropTypes.func,
  showBookingSummaryFields: PropTypes.func,
  showSteps: PropTypes.number,
  userData: PropTypes.object,
  updateOverridePrice: PropTypes.func
};

BookingDetails.defaultProps = {
  personalDetails: {}
};
export default connect(mapStateToProps, mapDispatchToProps)(BookingDetails);
