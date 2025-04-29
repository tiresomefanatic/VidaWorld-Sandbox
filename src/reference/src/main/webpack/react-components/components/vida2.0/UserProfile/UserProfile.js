import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import appUtils from "../../../../site/scripts/utils/appUtils";
import ProfileDetails from "../ProfileDetails/ProfileDetails";
import breakpoints from "../../../../site/scripts/media-breakpoints";
import {
  useUserData,
  useElligibleAddressUpdate
} from "../../../hooks/userProfile/userProfileHooks";
import { connect } from "react-redux";
import loginUtils from "../../../../site/scripts/utils/loginUtils";
import ProfileImageUpload from "../ProfileImageUpload/ProfileImageUpload";
import Logout from "../Logout/Logout";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import CONSTANT from "../../../../site/scripts/constant";
import { useAllUserTestRides } from "../../../hooks/userProfile/userProfileHooks";
// import TestRideCard from "./TestRideCard/TestRideCard";
// import UserInfo from "./UserInfo/UserInfo";
import { cryptoUtils } from "../../../../site/scripts/utils/encryptDecryptUtils";
import { useGetAllSaveMyDesign } from "../../../hooks/designYourVida/designYourVidaHooks";

const UserProfile = (props) => {
  const { config, userProfileProps } = props;
  const { profile_pic, allUserTestRidesData } = userProfileProps;
  const {
    testRideCardConfig,
    buyNowCardConfig,
    orderCardConfig,
    profilePicConfig,
    firstNameField,
    lastNameField,
    phoneNumberField,
    emailField,
    pinCodeField,
    datalayerConfig,
    rewardsCardConfig,
    offersCardConfig,
    myVidaCardConfig,
    communityCardConfig
    // bookingForm
  } = config;
  // const isLoggedIn = loginUtils.isSessionActive();
  const [fileName, setFileName] = useState();
  const [isEligible, setIsEligible] = useState();
  const [isTestRideAvailable, setIsTestRideAvailable] = useState(true);
  const [scheduledData, setScheduledData] = useState([]);
  const [profileTestRideFlipSwitch, setProfileTestRideFlipSwitch] =
    useState(false);

  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;
  const isTab = window.matchMedia(breakpoints.mediaExpression.tablet).matches;

  const getUserData = useUserData();
  const getAllTestRides = useAllUserTestRides();
  const getElligibleAddressUpdate = useElligibleAddressUpdate();

  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();

  const checkEligibleForTestRide = async () => {
    if (allUserTestRidesData.items && allUserTestRidesData.items.length > 0) {
      const shortTestRideData = allUserTestRidesData?.items.filter(
        (item) => !item.IsLTTR
      );

      const confirmedData = shortTestRideData.filter(
        (item) => item.dmpl__Status__c === CONSTANT.TEST_RIDE_STATUS.CONFIRMED
      );

      if (confirmedData.length > 0) {
        window.location.href = orderCardConfig.orderNavLink + "?" + "testride";
      } else {
        window.location.href = testRideCardConfig.testRideNavLink;
      }
    } else {
      window.location.href = testRideCardConfig.testRideNavLink;
    }
  };
  const fetchAllSaveMyDesign = useGetAllSaveMyDesign();

  const ctaTracking = (e, text, isTestRideUrl) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        ctaText: text || e?.target?.alt || e?.target?.innerText,
        ctaLocation:
          e?.target?.dataset?.linkPosition ||
          e?.target?.closest("a")?.dataset?.linkPosition
      };
      analyticsUtils.trackCTAClicksVida2(customLink, "ctaButtonClick");
    }

    // condition to check if already testride have booked
    if (isTestRideUrl) {
      checkEligibleForTestRide();
    }
  };

  const checkEligibleForAddress = async () => {
    const eligibleResult = await getElligibleAddressUpdate();

    if (
      eligibleResult &&
      eligibleResult?.data &&
      eligibleResult.data.customer
    ) {
      setIsEligible(eligibleResult.data.customer.isEligibleForAddressUpdate);
    }
  };

  useEffect(() => {
    getUserData();
    getAllTestRides();
    checkEligibleForAddress();
  }, []);

  useEffect(() => {
    if (allUserTestRidesData.items && allUserTestRidesData.items.length > 0) {
      const shortTestRideData = allUserTestRidesData?.items.filter(
        (item) => !item.IsLTTR
      );

      const confirmedData = shortTestRideData.filter(
        (item) => item.dmpl__Status__c === CONSTANT.TEST_RIDE_STATUS.CONFIRMED
      );
      setScheduledData(confirmedData);
      if (confirmedData && confirmedData.length > 0) {
        setIsTestRideAvailable(true);
      } else {
        setIsTestRideAvailable(false);
      }
    } else if (
      allUserTestRidesData.items &&
      allUserTestRidesData.items.length === 0
    ) {
      setIsTestRideAvailable(false);
    }
  }, [allUserTestRidesData.items]);

  const handleFileName = (fileName) => {
    setFileName(fileName);
  };

  const getSaveMyDesign = async () => {
    const result = await fetchAllSaveMyDesign();
    const productItemId = result.data.getAllSaveMyDesign?.items.length
      ? result.data.getAllSaveMyDesign?.items[0].product_ItemId
      : "";
    const productItemSkuId = result.data.getAllSaveMyDesign?.items.length
      ? result.data.getAllSaveMyDesign?.items[0].product_ItemSkuId
      : "";
    const encryptParams = [
      "productItemId=",
      productItemId,
      "&productItemSkuId=",
      productItemSkuId
    ].join("");
    const encryptedParams = cryptoUtils.encrypt(encryptParams);
    const redirectUrl = myVidaCardConfig.myVidaNavLink + "?" + encryptedParams;
    window.location.href = redirectUrl;
  };

  // const myVidaClickHandler = (event) => {
  //   ctaTracking(event, myVidaCardConfig.myVidaHeader, false);
  //   getSaveMyDesign();
  // };

  // const rewardsClickHandler = (event) => {
  //   ctaTracking(event, rewardsCardConfig.rewardsHeader, false);
  //   window.location.href = rewardsCardConfig.rewardsNavLink;
  // };

  // const offersCardHandler = (event) => {
  //   ctaTracking(event, offersCardConfig.offersHeader, false);
  //   window.location.href = offersCardConfig.offersNavLink;
  // };

  // const communityCardHandler = (event) => {
  //   ctaTracking(event, communityCardConfig.communityHeader, false);
  //   window.location.href = communityCardConfig.communityNavLink;
  // };

  // To switch between user profile/ test ride cards , Need to be changed after design update
  // const onTestRideToProfileSwitch = () => {
  //   if (isTestRideAvailable) {
  //     setProfileTestRideFlipSwitch(!profileTestRideFlipSwitch);
  //   }
  // };

  // const checkProfileCardValid = () => {
  //   return (
  //     (isTestRideAvailable && profileTestRideFlipSwitch) ||
  //     (!isTestRideAvailable && !profileTestRideFlipSwitch)
  //   );
  // };

  return (
    <div className="user-profile">
      {!isDesktop && !isTab && !isTestRideAvailable && (
        <div className="user-profile-logout-link">
          <Logout />
        </div>
      )}
      <div className="vida-user-order-details">
        {!profile_pic && (
          <div className="user-image-card">
            <h1>{profilePicConfig?.uploadPicText}</h1>
            <div className="image-upload">
              <label htmlFor="profile-image">
                <img
                  src={`${appUtils.getConfig(
                    "resourcePath"
                  )}images/svg/plus-circle.svg`}
                  loading="lazy"
                />
              </label>
              <ProfileImageUpload
                handleFileName={handleFileName}
                config={config}
                id="profile-image"
                fileName={fileName}
              />
            </div>
          </div>
        )}
        {/* {!isTestRideAvailable && ( */}
        <a
          className="user-test-ride-card-link"
          onClick={checkEligibleForTestRide}
        >
          <div className="user-test-ride-card">
            <div className="user-test-ride-card__image">
              <img
                src={testRideCardConfig.testRideScooterImage}
                alt={testRideCardConfig?.testRideScooterImgAlt}
                title={testRideCardConfig?.testRideScooterImgTitle}
                loading="lazy"
              />
            </div>

            <div className="user-test-ride-card__details">
              <h2 className="user-test-ride__label">
                {testRideCardConfig?.testRideHeader}
              </h2>
              <p className="user-test-ride__value">
                {testRideCardConfig?.testRideDescription}
              </p>
            </div>
            <div className="user-test-ride-card__action">
              <a
                data-link-position={
                  datalayerConfig?.dataPosition || "userProfile"
                }
                onClick={(e) =>
                  ctaTracking(
                    e,
                    testRideCardConfig?.testRideHeader,
                    testRideCardConfig?.isTestRideUrl
                  )
                }
              >
                <img
                  src={`${appUtils.getConfig(
                    "resourcePath"
                  )}images/svg/solar_square-arrow-right-up-bold-duotone.svg`}
                  loading="lazy"
                ></img>
              </a>
            </div>
          </div>
        </a>
        {/* )} */}
        <a
          className="user-buy-now-card-link"
          href={buyNowCardConfig.buyNowNavLink}
        >
          <div className="user-buy-now-card">
            <div className="user-test-ride-card__image">
              <img
                src={buyNowCardConfig.buyNowCardScooterImage}
                alt={buyNowCardConfig?.buyNowScooterImgAlt}
                title={buyNowCardConfig?.buyNowScooterImgTitle}
                loading="lazy"
              />
            </div>

            <div className="user-test-ride-card__details">
              <h2 className="user-test-ride__label">
                {buyNowCardConfig?.buyNowCardHeader}
              </h2>
              <p className="user-test-ride__value">
                {buyNowCardConfig?.buyNowCardDescription}
              </p>
            </div>
            <div className="user-test-ride-card__action">
              <a
                data-link-position={
                  datalayerConfig?.dataPosition || "userProfile"
                }
                onClick={(e) =>
                  ctaTracking(
                    e,
                    buyNowCardConfig?.buyNowCardHeader,
                    buyNowCardConfig?.isTestRideUrl
                  )
                }
                href={buyNowCardConfig.buyNowNavLink}
              >
                <img
                  src={`${appUtils.getConfig(
                    "resourcePath"
                  )}images/svg/solar_square-arrow-right-up-bold-duotone.svg`}
                  loading="lazy"
                ></img>
              </a>
            </div>
          </div>
        </a>
        <a className="user-order-card-link" href={orderCardConfig.orderNavLink}>
          <div className="user-order-card">
            <div className="user-test-ride-card__image">
              <img
                src={orderCardConfig.orderCardScooterImage}
                alt={orderCardConfig?.orderCardScooterImgAlt}
                title={orderCardConfig?.orderCardScooterImgTitle}
                loading="lazy"
              />
            </div>

            <div className="user-test-ride-card__details">
              <h2 className="user-test-ride__label">
                {orderCardConfig?.orderCardHeader}
              </h2>
              <p className="user-test-ride__value">
                {orderCardConfig?.orderCardDescription}
              </p>
            </div>
            <div className="user-test-ride-card__action">
              <a
                data-link-position={
                  datalayerConfig?.dataPosition || "userProfile"
                }
                onClick={(e) =>
                  ctaTracking(
                    e,
                    orderCardConfig?.orderCardHeader,
                    orderCardConfig?.isTestRideUrl
                  )
                }
                href={orderCardConfig.orderNavLink}
              >
                <img
                  src={`${appUtils.getConfig(
                    "resourcePath"
                  )}images/svg/solar_square-arrow-right-up-bold-duotone.svg`}
                  loading="lazy"
                ></img>
              </a>
            </div>
          </div>
        </a>
        {/* <div className="reward-offers-container">
          <div
            className="my-vida-container"
            onClick={() => myVidaClickHandler(event)}
          >
            <div className="icon-header-container">
              <div className="icon-container">
                <img
                  src={`${appUtils.getConfig(
                    "resourcePath"
                  )}images/png/solar_scooter.png`}
                  alt=""
                />
              </div>
              <div className="header-container">
                <p>{myVidaCardConfig.myVidaHeader}</p>
              </div>
            </div>
            <div className="description-container">
              <p>{myVidaCardConfig.myVidaDescription}</p>
            </div>
          </div>
          <div
            className="my-rewards-container"
            onClick={() => rewardsClickHandler(event)}
          >
            <div className="icon-header-container">
              <div className="icon-container">
                <img
                  src={`${appUtils.getConfig(
                    "resourcePath"
                  )}images/png/solar_star.png`}
                  alt=""
                />
              </div>
              <div className="header-container">
                <p>{rewardsCardConfig.rewardsHeader}</p>
              </div>
            </div>
            <div className="description-container">
              <p>{rewardsCardConfig.rewardsDescription}</p>
            </div>
          </div>
          <div
            className="my-offers-container"
            onClick={() => offersCardHandler(event)}
          >
            <div className="icon-header-container">
              <div className="icon-container">
                <img
                  src={`${appUtils.getConfig(
                    "resourcePath"
                  )}images/png/solar_gift.png`}
                  alt=""
                />
              </div>
              <div className="header-container">
                <p>{offersCardConfig.offersHeader}</p>
              </div>
            </div>
            <div className="description-container">
              <p>{offersCardConfig.offersDescription}</p>
            </div>
          </div>
          <div
            className="my-community-container"
            onClick={() => communityCardHandler(event)}
          >
            <div className="icon-desc-container">
              <div className="icon-container">
                <img
                  src={`${appUtils.getConfig(
                    "resourcePath"
                  )}images/png/solar_community.png`}
                  alt=""
                />
              </div>
              <div className="description-container">
                <p>{communityCardConfig.communityHeader}</p>
              </div>
            </div>
            <div className="redirection-container">
              <img
                src={`${appUtils.getConfig(
                  "resourcePath"
                )}images/svg/solar_square-arrow-right-up-bold-duotone.svg`}
                loading="lazy"
              ></img>
            </div>
          </div>
        </div> */}
      </div>
      {/* <div
        className="vida-profile-test-ride-card-wrapper"
        style={{
          gap: `${
            (isTestRideAvailable && profileTestRideFlipSwitch) ||
            (!isTestRideAvailable && !profileTestRideFlipSwitch)
              ? "8rem"
              : 0
          }`
        }}
      > */}
      {/* {allUserTestRidesData?.items && isTestRideAvailable && ( */}
      {/* <UserInfo
          config={config}
          onTestRideToProfileSwitch={onTestRideToProfileSwitch}
        ></UserInfo> */}
      {/* )} */}
      {/* {checkProfileCardValid() && ( */}
      <div className="vida-user-details">
        <ProfileDetails
          firstNameField={firstNameField}
          lastNameField={lastNameField}
          emailField={emailField}
          phoneNumberField={phoneNumberField}
          pinCodeField={pinCodeField}
          profilePicConfig={profilePicConfig}
          config={config}
          eligibleForAddressUpdate={isEligible}
        />
      </div>
      {/* )} */}
      {/* {allUserTestRidesData?.items &&
          isTestRideAvailable &&
          !profileTestRideFlipSwitch && (
            <TestRideCard
              config={bookingForm}
              scheduledData={scheduledData}
              isSuccess={false}
            ></TestRideCard>
          )} */}
    </div>
    // </div>
  );
};

const mapStateToProps = ({ userProfileDataReducer, userTestRideReducer }) => {
  return {
    userProfileProps: {
      profile_pic: userProfileDataReducer.profile_pic,
      allUserTestRidesData: {
        items: userTestRideReducer.items
      }
    }
  };
};

UserProfile.propTypes = {
  config: PropTypes.object,
  userProfileProps: PropTypes.shape({
    profile_pic: PropTypes.string,
    allUserTestRidesData: PropTypes.shape({
      items: PropTypes.array
    })
  })
};

export default connect(mapStateToProps)(UserProfile);
