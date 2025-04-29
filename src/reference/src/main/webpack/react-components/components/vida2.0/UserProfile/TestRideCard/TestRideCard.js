import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useUserData } from "../../../../hooks/userProfile/userProfileHooks";
import { useAllUserTestRides } from "../../../../hooks/userProfile/userProfileHooks";
import NameTicket from "../../NameTicket/NameTicket";
import TestRideMsgCard from "../TestRideMsgCard/TestRideMsgCard";
import { useScreenshot } from "use-react-screenshot";
import Logout from "../../Logout/Logout";
import breakpoints from "../../../../../site/scripts/media-breakpoints";

const TestRideCard = (props) => {
  const { config, scheduledData } = props;

  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;

  const ticketDownloadRef = useRef(null);
  const [image, takeScreenShot] = useScreenshot({
    type: "image/jpeg",
    quality: 1.0
  });

  const download = (image, { name = "img", extension = "jpg" } = {}) => {
    const a = document.createElement("a");
    a.href = image;
    a.download = "test-ride-confirmation.jpg";
    a.click();
  };

  const getUserData = useUserData();
  const getAllTestRides = useAllUserTestRides();

  const onDownloadClicked = () => {
    takeScreenShot(ticketDownloadRef.current).then(download);
  };

  const getDate = () => {
    return (
      scheduledData &&
      scheduledData.length > 0 &&
      (scheduledData[0]?.dmpl__DemoDateTime__c).split("T")[0]
    );
  };

  const getTime = () => {
    let time = "";
    if (scheduledData && scheduledData.length > 0) {
      const date = new Date(scheduledData[0]?.dmpl__DemoDateTime__c);
      time = scheduledData[0]?.DemoStartAndEndTime__c.split("-")[0];
    }
    return time;
  };

  useEffect(() => {
    getUserData();
    getAllTestRides();
  }, []);

  return (
    <div className="user-test-ride-container">
      <div className="test-ride-card-header">
        <p className="test-ride-card-header__header">
          {config?.testRideHeader}
        </p>
      </div>
      <div className="test-ride-card-wrapper">
        <div className="test-ride-card-title-wrapper">
          <h4 className="user-test-ride__label">{config?.testRideTitle}</h4>
          <p className="user-test-ride__value">{`You cruised on a VIDA V1 on date ${getDate()} at ${getTime()}. Let’s review`}</p>
        </div>
        <div>
          <NameTicket
            config={config}
            scheduledData={scheduledData}
            isSuccess={true}
            ticketDownloadRef={ticketDownloadRef}
          ></NameTicket>
        </div>

        <div>
          <TestRideMsgCard
            config={config}
            scheduledData={scheduledData}
            downloadTicket={onDownloadClicked}
          ></TestRideMsgCard>
        </div>
        {isDesktop && (
          <div className="user-profile-logout-link">
            <Logout />
          </div>
        )}
      </div>
    </div>
  );
};

TestRideCard.propTypes = {
  config: PropTypes.object,
  scheduledData: PropTypes.array
};

export default TestRideCard;
