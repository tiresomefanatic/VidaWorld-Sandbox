import React, { useEffect, useState } from "react";
import UserOrders from "../UserOrders/UserOrders";
import UserTestRides from "../UserTestRides/UserTestRides";
import MyScooter from "../MyScooter/MyScooter";
import PropTypes from "prop-types";
import appUtils from "../../../site/scripts/utils/appUtils";
import UserLongTestDrive from "../UserLongTestDrive/UserLongTestDrive";
import Recent from "../Recent/Recent";
import { cryptoUtils } from "../../../site/scripts/utils/encryptDecryptUtils";

const ProfileTabs = (props) => {
  const { config } = props;
  const { navConfig, myscooterconfig } = config;
  const [isMyscooterActive, setMyscooterActive] = useState(false);
  const [isOrderActive, setOrderActive] = useState(false);
  const [isTestRideActive, setTestRideActive] = useState(false);
  const [isLongTestRideActive, setLongTestRideActive] = useState(false);
  const [isRecentActive, setRecentActive] = useState(false);

  useEffect(() => {
    let decryptedParams = "";
    const queryString = location.href.split("?")[1];
    if (queryString) {
      decryptedParams = cryptoUtils.decrypt(queryString);
    }
    const params = new URLSearchParams(decryptedParams);
    if (params.has("tabId") && params.get("tabId") === "longTerm") {
      setLongTestRideActive(true);
    } else if (queryString && queryString === "testride") {
      setTestRideActive(true);
    } else {
      setOrderActive(true);
    }
  }, []);

  const deactivateAllTabs = () => {
    setMyscooterActive(false);
    setOrderActive(false);
    setTestRideActive(false);
    setLongTestRideActive(false);
    setRecentActive(false);
  };

  const handleMyScooterTab = (e) => {
    e.preventDefault();
    deactivateAllTabs();
    setMyscooterActive(true);
  };

  const handleMyRecentTab = (e) => {
    e.preventDefault();
    deactivateAllTabs();
    setRecentActive(true);
  };

  const handleOrdersTab = (e) => {
    e.preventDefault();
    deactivateAllTabs();
    setOrderActive(true);
  };

  const handleTestRideTab = (e) => {
    e.preventDefault();
    deactivateAllTabs();
    setTestRideActive(true);
  };

  const handleLongTestRideTab = (e) => {
    e.preventDefault();
    deactivateAllTabs();
    setLongTestRideActive(true);
  };

  return (
    <div className="vida-container vida-profile-tabs">
      <nav className="links vida-profile-tabs__nav">
        {appUtils.getConfig("isMyScooterEnabled") ? (
          <a
            href="#"
            onClick={(e) => handleMyScooterTab(e)}
            className={
              isMyscooterActive ? "vida-profile-tabs__nav-item--active" : ""
            }
          >
            {navConfig.myscooter}
          </a>
        ) : (
          ""
        )}
        <a
          href="#"
          onClick={(e) => handleOrdersTab(e)}
          className={isOrderActive ? "vida-profile-tabs__nav-item--active" : ""}
        >
          {navConfig.myorders}
        </a>
        {appUtils.getConfig("isShortTermTestRideEnabled") ? (
          <a
            href="#"
            onClick={(e) => handleTestRideTab(e)}
            className={
              isTestRideActive ? "vida-profile-tabs__nav-item--active" : ""
            }
          >
            {navConfig.shorttestrides}
          </a>
        ) : (
          ""
        )}
        {appUtils.getConfig("isLongTermTestRideEnabled") ? (
          <a
            href="#"
            onClick={(e) => handleLongTestRideTab(e)}
            className={
              isLongTestRideActive ? "vida-profile-tabs__nav-item--active" : ""
            }
          >
            {navConfig.longtestrides}
          </a>
        ) : (
          ""
        )}
        {appUtils.getConfig("isRecentEnabled") ? (
          <a
            href="#"
            onClick={(e) => handleMyRecentTab(e)}
            className={
              isRecentActive ? "vida-profile-tabs__nav-item--active" : ""
            }
          >
            {navConfig.recents}
          </a>
        ) : (
          ""
        )}
      </nav>

      {isMyscooterActive && <MyScooter config={myscooterconfig} />}

      {isOrderActive && (
        <UserOrders
          userOrderConfig={config.myOrderConfig}
          cancelOrderConfig={config.cancelOrderConfig}
          cancelPrebookingOrderConfig={config.cancelPrebookingOrderConfig}
        />
      )}

      {isTestRideActive && (
        <UserTestRides
          userTestRideConfig={config.userTestRideConfig}
          cancelTestDriveConfig={config.cancelTestDriveConfig}
        />
      )}
      {isLongTestRideActive && (
        <UserLongTestDrive
          userLongTestRideConfig={config.userLongTestRideConfig}
          cancelLongTestDriveConfig={config.cancelLongTestDriveConfig}
        />
      )}
      {!isRecentActive && <Recent recentConfig={config.recentConfig} />}
    </div>
  );
};

ProfileTabs.propTypes = {
  config: PropTypes.object
};

export default ProfileTabs;
