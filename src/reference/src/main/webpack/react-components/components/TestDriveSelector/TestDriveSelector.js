import React, { useState } from "react";
import PropTypes from "prop-types";
import CONSTANT from "../../../site/scripts/constant";
import appUtils from "../../../site/scripts/utils/appUtils";
import analyticsUtils from "../../../site/scripts/utils/analyticsUtils";
import { cryptoUtils } from "../../../site/scripts/utils/encryptDecryptUtils";

const TestDriveSelector = (props) => {
  const testDriveUrl = appUtils.getPageUrl("testDriveUrl");
  const { testDriveSelector, backgroundImg } = props.config;
  const { title, options, serviceUnavailableMsg, changeLocationLabel } =
    testDriveSelector;
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const [isFreedoLimitCrossed, setIsFreedoLimitCrossed] = useState(false);

  const handleTestDriveSelection = async (id) => {
    const queryString = cryptoUtils.encrypt("testRideType=" + id);
    window.location.href = `${testDriveUrl}?${queryString}`;
  };

  return (
    <div className="vida-test-drive__container">
      <div className="vida-test-drive__asset">
        <img src={backgroundImg} alt="Vida Test Drive" />
      </div>
      <div className="vida-test-drive__content">
        <div className="vida-test-drive-selector__container">
          <div className="vida-test-drive-selector__title">{title}</div>
          <div className="vida-test-drive-selector__content">
            {options &&
              options.map((option, index) => {
                return (
                  <div
                    key={index}
                    className="vida-test-drive-selector__card-wrapper"
                  >
                    <div
                      className={`vida-test-drive-selector__card`}
                      tabIndex="0"
                      onClick={() => handleTestDriveSelection(option.id)}
                    >
                      <div className="vida-test-drive-selector__heading">
                        <span className="vida-test-drive-selector__label">
                          {option.title}
                        </span>
                        {option.icon ? (
                          <i className={"icon-" + option.icon}></i>
                        ) : (
                          ""
                        )}
                        {option.rate ? (
                          <span className="vida-test-drive-selector__rate">
                            {option.rate}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="vida-test-drive-selector__description">
                        {option.description}
                      </div>
                    </div>
                    {option.id === CONSTANT.TEST_RIDE_OPTIONS.LONG_TERM &&
                      isFreedoLimitCrossed && (
                        <span className="vida-test-drive-selector__card-info">
                          {serviceUnavailableMsg}
                        </span>
                      )}
                  </div>
                );
              })}
          </div>
          <div>
            {/* <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                changeLocation(e);
              }}
            >
              {changeLocationLabel}
            </a> */}
          </div>
        </div>
      </div>
    </div>
  );
};

TestDriveSelector.propTypes = {
  config: PropTypes.object,
  changeLocation: PropTypes.func,
  selectedLocation: PropTypes.object,
  isOTPVerified: PropTypes.bool
};

export default TestDriveSelector;
