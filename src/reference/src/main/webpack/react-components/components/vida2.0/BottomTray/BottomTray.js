import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useAllUserTestRides } from "../../../hooks/userProfile/userProfileHooks";
import CONSTANT from "../../../../site/scripts/constant";
import loginUtils from "../../../../site/scripts/utils/loginUtils";
import appUtils from "../../../../site/scripts/utils/appUtils";

const BottomTray = (props) => {
  const { config, allUserTestRidesData } = props;
  const [sizeMatch, setSizeMatch] = useState();
  const screenSize = window.matchMedia("(min-height: 800px)");

  const getAllTestRides = useAllUserTestRides();
  const isLoggedIn = loginUtils.isSessionActive();
  const ordersUrl = appUtils.getPageUrl("ordersUrl");

  function screenSizeHandler(e) {
    // Check if the screen size matches
    if (e.matches) {
      setSizeMatch(true);
    } else {
      setSizeMatch(false);
    }
  }

  // Register event listener
  screenSize.addEventListener("change", screenSizeHandler);

  const checkforTRApplicable = (url) => {
    if (allUserTestRidesData.items && allUserTestRidesData.items.length > 0) {
      const shortTestRideData = allUserTestRidesData?.items.filter(
        (item) => !item.IsLTTR
      );

      const confirmedData = shortTestRideData.filter(
        (item) => item.dmpl__Status__c === CONSTANT.TEST_RIDE_STATUS.CONFIRMED
      );

      if (confirmedData.length > 0) {
        window.location.href = ordersUrl + "?" + "testride";
      } else {
        window.location.href = url;
      }
    } else {
      window.location.href = url;
    }
  };

  const trayClickHandler = (item) => {
    if (item.isTestRideUrl) {
      if (isLoggedIn) {
        checkforTRApplicable(item.navLink);
      } else {
        window.open(item.navLink, item.newTab ? "_blank" : "_self");
      }
    } else {
      window.open(item.navLink, item.newTab ? "_blank" : "_self");
    }
  };

  useEffect(async () => {
    screenSizeHandler(screenSize);
    if (isLoggedIn) {
      await getAllTestRides();
    }
  }, []);

  return (
    <div
      className={
        sizeMatch
          ? "vida-bottom-tray-wrapper"
          : "vida-bottom-tray-wrapper variant-2"
      }
    >
      <div className="vida-bottom-tray-container">
        <div className="bottom-tray-bg-container">
          <img
            className="bottom-tray-bg-img"
            src={config.bottomTrayBgImg}
            alt="bottom_tray_bg"
          ></img>
          <div className="bottom-tray-content-container">
            {config.bottomTrayCardContent?.map((item, index) => (
              <a
                className="bottom-tray-card-wrapper"
                key={index}
                onClick={() => trayClickHandler(item)}
              >
                <img
                  className="bottom-tray-card-bg-img"
                  src={item.cardBgImg}
                  alt="bottom_tray_card_bg"
                ></img>
                <div className="bottom-tray-card-container">
                  <div className="bottom-tray-card-icon">
                    <img
                      className="bottom-tray-card-icon-img"
                      src={item.icon}
                      alt="bottom_tray_card_icon"
                    ></img>
                  </div>
                  <div className="bottom-tray-card-title">
                    <p>{item.title}</p>
                  </div>
                  <div className="bottom-tray-card-description">
                    <p>{item.description}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ userTestRideReducer }) => {
  return {
    allUserTestRidesData: {
      items: userTestRideReducer.items
    }
  };
};

export default connect(mapStateToProps)(BottomTray);

BottomTray.propTypes = {
  config: PropTypes.shape({
    bottomTrayCardContent: PropTypes.arrayOf(PropTypes.any),
    bottomTrayBgImg: PropTypes.string,
    isVariant1: PropTypes.bool
  }),
  allUserTestRidesData: PropTypes.shape({
    items: PropTypes.array
  })
};
// BottomTray.defaultProps = {
//   config: {
//     bottomTrayCardContent: [
//       {
//         cardBgImg: "bottom_tray_card_bg.png",
//         icon: "try_card_icon.png",
//         title: "Try",
//         description: "Experience what Electric can do"
//       },
//       {
//         cardBgImg: "bottom_tray_card_bg.png",
//         icon: "buy_card_icon.png",
//         title: "Buy",
//         description: "23000 EVs lined up. Pick yours."
//       },
//       {
//         cardBgImg: "bottom_tray_card_bg.png",
//         icon: "love_card_icon.png",
//         title: "Love",
//         description: "Join our community"
//       }
//     ],
//     bottomTrayBgImg: "bottom_tray_bg.png",
//     isVariant1: true
//   }
// };
