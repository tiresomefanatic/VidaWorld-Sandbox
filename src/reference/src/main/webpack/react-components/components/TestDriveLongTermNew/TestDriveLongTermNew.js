import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { cryptoUtils } from "../../../site/scripts/utils/encryptDecryptUtils";
import { useBookLongTermTestDrive } from "../../hooks/testDrive/testDriveHooks";
import appUtils from "../../../site/scripts/utils/appUtils";
import analyticsUtils from "../../../site/scripts/utils/analyticsUtils";
import { useModelVariantList } from "../../hooks/testDrive/testDriveHooks";
import { setSpinnerActionDispatcher } from "../../store/spinner/spinnerActions";

const TestDriveLongTermNew = (props) => {
  const { config, cmpProps } = props;
  const { lttrAcknowledgement, backgroundImg } = config;
  const {
    LTTRMessage,
    title,
    btnText,
    info,
    LTTRMessageErr,
    btnTextErr,
    titleErr
  } = lttrAcknowledgement;
  const [lttrSuccess, setLttrSuccess] = useState(false);
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const queryString = location.href.split("?")[1];
  let decryptedParams;
  if (queryString) {
    decryptedParams = cryptoUtils.decrypt(queryString);
  }
  const params = new URLSearchParams("?" + decryptedParams);
  const bookLongTermTestDrive = useBookLongTermTestDrive();
  const getModelVariantList = useModelVariantList();
  const profileUrl = appUtils.getPageUrl("profileUrl");
  const testDriveSelectorUrl = appUtils.getPageUrl("testDriveSelectorUrl");

  const handleRedirection = (e, url) => {
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
          window.location.href = url;
        }
      );
    } else {
      window.location.href = url;
    }
  };

  const bookLTTR = async () => {
    const bookTestDriveResponse = await bookLongTermTestDrive({
      variables: {
        dmpl__PartnerAccountId__c: params.get("partnerAccountId"),
        dmpl__BranchId__c: params.get("branchId"),
        IsLttr: true,
        dmpl__City__c: params.get("city"),
        dmpl__State__c: params.get("state"),
        dmpl__ItemId__c: cmpProps.modelVariantList[0].sf_id,
        dmpl__DemoAddress__c: params.get("centreName"),
        dmpl__PostalCode__c: params.get("postalCode")
      }
    });

    if (
      bookTestDriveResponse &&
      bookTestDriveResponse.data &&
      bookTestDriveResponse.data.LttrBookTestDrive &&
      bookTestDriveResponse.data.LttrBookTestDrive.success
    ) {
      return bookTestDriveResponse;
    }
  };

  useEffect(() => {
    setSpinnerActionDispatcher(true);
    getModelVariantList({
      variables: {
        type_id: "configurable"
      }
    });
  }, []);

  useEffect(() => {
    if (cmpProps.modelVariantList.length) {
      const lttrResp = bookLTTR();
      lttrResp.then((res) => {
        if (
          res &&
          res.data &&
          res.data.LttrBookTestDrive &&
          res.data.LttrBookTestDrive.success
        ) {
          setLttrSuccess("success");
        } else {
          setLttrSuccess("failed");
        }
      });
    }
  }, [cmpProps.modelVariantList]);

  return (
    <div className="vida-test-drive__container">
      <div className="vida-test-drive__asset">
        <img src={backgroundImg} alt="Vida Test Drive" />
      </div>
      <div className="vida-test-drive__content">
        <div className="vida-success-page">
          <div className="vida-success-page__title">
            {lttrSuccess === "success"
              ? title
              : lttrSuccess === "failed"
              ? titleErr
              : ""}
          </div>
          <div className="vida-success-page__message">
            {lttrSuccess === "success"
              ? LTTRMessage
              : lttrSuccess === "failed"
              ? LTTRMessageErr
              : ""}
          </div>
          {lttrSuccess === "success" && (
            <div className="vida-success-page__appointment">
              <p>
                <i className="icon-location-marker"></i>
                <span>{params.get("centreName")}</span>
              </p>
            </div>
          )}
          <div className="vida-success-page__info">
            {lttrSuccess === "success" ? info : ""}
          </div>
          <button
            className="btn btn--primary btn--lg"
            onClick={(e) =>
              handleRedirection(
                e,
                lttrSuccess ? profileUrl : testDriveSelectorUrl
              )
            }
          >
            {lttrSuccess ? btnText : btnTextErr}
          </button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ testDriveReducer }) => {
  return {
    cmpProps: {
      modelVariantList: testDriveReducer.modelVariantList
    }
  };
};
TestDriveLongTermNew.propTypes = {
  config: PropTypes.object,
  changeLocation: PropTypes.func,
  selectedLocation: PropTypes.object,
  isOTPVerified: PropTypes.bool,
  cmpProps: PropTypes.object
};

export default connect(mapStateToProps)(TestDriveLongTermNew);
