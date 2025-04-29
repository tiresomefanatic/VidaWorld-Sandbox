import React from "react";
import PropTypes from "prop-types";
import appUtils from "../../../../../site/scripts/utils/appUtils";
import { RWebShare } from "react-web-share";
import { cryptoUtils } from "../../../../../site/scripts/utils/encryptDecryptUtils";
import analyticsUtils from "../../../../../site/scripts/utils/analyticsUtils";

const TestRideMsgCard = (props) => {
  const { config, scheduledData, downloadTicket } = props;
  const { dataPosition } = config;
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();

  const ctaTracking = (e, text) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        ctaText: text || e?.target?.alt || e?.target?.innerText,
        ctaLocation:
          e?.target?.dataset?.linkPosition ||
          e?.target?.closest("a")?.dataset?.linkPosition
      };
      analyticsUtils.trackCTAClicksVida2(customLink, "ctaButtonClick");
    }
  };

  const ctaTrackingDownload = (e) => {
    if (isAnalyticsEnabled) {
      const closestLink = e?.target?.closest("a");
      const ctaText = e?.target?.alt || e?.target?.innerText;
      const ctaLocation = closestLink?.dataset?.linkPosition;
      const clickURL = closestLink?.getAttribute("href");
      if (clickURL?.endsWith(".pdf")) {
        const documentName = decodeURIComponent(
          clickURL
            .split("/")
            .pop()
            .replace(/\.pdf$/, "")
        );
        analyticsUtils.trackDocumentDetailsClick({
          documentName
        });
      } else {
        analyticsUtils.trackCTAClicksVida2(
          { ctaText, ctaLocation, clickURL },
          "ctaButtonClick"
        );
      }
    }
  };

  const optForReschedule = (event) => {
    event.preventDefault();
    const redirectUrl = appUtils.getPageUrl("testDriveUrl");
    const params = [
      "id=",
      scheduledData[0]?.Id,
      "&state=",
      scheduledData[0]?.State__c,
      "&city=",
      scheduledData[0]?.City__c,
      "&dealerName=",
      scheduledData[0]?.dmpl__DemoAddress__c,
      "&date=",
      scheduledData[0]?.dmpl__DemoDateTime__c,
      "&time=",
      scheduledData[0]?.DemoStartAndEndTime__c,
      "&variantId=",
      scheduledData[0]?.dmpl__ItemId__c
    ].join("");
    const encryptedParams = cryptoUtils.encrypt(params);
    ctaTracking(event, "Test Drive: Booking Confirmation");
    window.location.href = redirectUrl + "?" + encryptedParams;
  };

  const optForCancel = (event) => {
    event.preventDefault();
    const redirectUrl = appUtils.getPageUrl("testDriveUrl");
    const params = [
      "?redirectURL=",
      appUtils.getPageUrl("profileUrl"),
      "&id=",
      scheduledData[0]?.Id,
      "&state=",
      scheduledData[0]?.State__c,
      "&city=",
      scheduledData[0]?.City__c,
      "&dealerName=",
      scheduledData[0]?.dmpl__DemoAddress__c,
      "&date=",
      scheduledData[0]?.dmpl__DemoDateTime__c,
      "&time=",
      scheduledData[0]?.DemoStartAndEndTime__c,
      "&isCancelTestRide=",
      "true"
    ].join("");
    const encryptedParams = cryptoUtils.encrypt(params);
    ctaTracking(event, "Test Drive: Booking Confirmation");
    window.location.href = redirectUrl + "?" + encryptedParams;
  };

  const downloadScreenshot = () => downloadTicket();

  return (
    <div className="vida-test-ride-message-container">
      <div className="message">
        <div className="test-ride-asset">
          <img
            src={
              appUtils.getConfig("resourcePath") +
              "images/svg/confirm-image.svg"
            }
            alt="confirm-image"
          />
        </div>
        <p>
          {config?.confirmCard?.confirmMsg}
          <br />
          <span>{config?.confirmCard?.funRideMsg}</span>
        </p>
      </div>
      <div className="actions">
        <div className="test-ride__actions-icons">
          <RWebShare
            data={{
              url: ""
            }}
            onClick={() => console.log("shared successfully!")}
          >
            <div className="share-icon">
              <a
                href={config?.shareUrl}
                onClick={(e) =>
                  ctaTracking(e, "Test Drive: Booking Confirmation")
                }
                data-link-position={dataPosition || "testride"}
              >
                <img
                  src={`${appUtils.getConfig(
                    "resourcePath"
                  )}images/png/share-2.png`}
                  alt="share"
                />
              </a>
            </div>
          </RWebShare>
          <div
            className="download-icon"
            onClick={() => {
              downloadScreenshot();
            }}
          >
            <a
              href={config?.downloadUrl}
              onClick={(e) => ctaTrackingDownload(e)}
              data-link-position={dataPosition || "testride"}
            >
              <img
                src={`${appUtils.getConfig(
                  "resourcePath"
                )}images/png/solar_download-bold-duotone.png`}
                alt="download"
              />
            </a>
          </div>
        </div>
        <div className="test-ride-links">
          <a
            onClick={(e) => optForReschedule(e)}
            data-link-position={dataPosition || "testride"}
          >
            {config?.rescheduleLabel}
          </a>
          <a
            onClick={(e) => optForCancel(e)}
            data-link-position={dataPosition || "testride"}
          >
            {config?.cancelLabel}
          </a>
        </div>
      </div>
    </div>
  );
};

TestRideMsgCard.propTypes = {
  config: PropTypes.object,
  scheduledData: PropTypes.array,
  downloadTicket: PropTypes.func
};

export default TestRideMsgCard;
