import React from "react";
import PropTypes from "prop-types";
import FameSubsidy from "../FameSubsidy/FameSubsidy";
import Drawer from "../../Drawer/Drawer";
import ScooterInfoWrapper from "../../ScooterInfoWrapper/ScooterInfoWrapper";

const FameSubsidyWrapper = (props) => {
  const {
    config,
    submitFameSubsidyDetails,
    subsidyDetails,
    backToSummaryPage
  } = props;
  return (
    <div className="vida-fame-subsidy-container vida-2-container">
      <Drawer>
        <FameSubsidy
          config={config.fameSubsidyConfig}
          submitFameSubsidyDetails={submitFameSubsidyDetails}
          subsidyDetails={subsidyDetails}
          backToSummaryPage={backToSummaryPage}
        />
      </Drawer>
      <div className="subsidy-right-wrapper" style={{ width: 492 }}>
        {/* <ScooterInfoWrapper
          optedBikeVariant={optedBikeVariant}
          bannerBackGroundImage={
            optedBikeVariant?.bgImg ||
            config?.genericConfig?.bannerBackgroundImg
          }
          textColor={
            optedBikeVariant?.textColor || config?.genericConfig?.textColor
          }
          userName={
            isUserLoggedIn
              ? updateNameToDisplay(userProfileData?.fname)
              : isUserName?.randomNameContent
          }
          bikeName={variant || config?.genericConfig?.subHeader}
          subText={optedBikeVariant?.color || config?.genericConfig?.subText}
          bikeDetails={{
            bikeImage:
              optedBikeVariant?.bikeImg || config?.genericConfig?.bannerBikeImg,
            alt: config?.genericConfig?.bannerBikeImgAlt,
            title: config?.genericConfig?.bannerBikeImgTitle
          }}
          bookingPrice={config?.genericConfig?.buyAnyPrice}
          bookScooterLabel={config?.genericConfig?.buyAnyLabel}
          bookingPriceSubText={config?.genericConfig?.fullyRefundableText}
          offerScrollingImg={config?.genericConfig?.offerScrollingImg}
          scooterData={scooterData || []}
          compareTextLabel={config?.genericConfig?.compareVariantsText}
          pdfUrl={config?.genericConfig?.productSpecificationPdfUrl}
          fontSize={fontSize}
          fontSizeSubHeader={fontSizeSubHeader}
          variantActiveIndex={variantActiveIndex}
          scooterInfoConfig={config.scooterInfo}
          genericConfig={config.genericConfig}
          handleActiveScooter={handleActiveScooter}
          isActiveScooterModel={isActiveScooterModel}
          defaultSelection={defaultSelection}
          handleVariantCalled={handleVariantCalled}
          setHandleVariantCalled={setHandleVariantCalled}
          activeVariant={activeVariant}
          setActiveVariant={setActiveVariant}
          handleColorChange={handleColorChange}
        /> */}
      </div>
    </div>
  );
};

export default FameSubsidyWrapper;

FameSubsidyWrapper.propTypes = {
  config: PropTypes.object,
  submitFameSubsidyDetails: PropTypes.func,
  subsidyDetails: PropTypes.object,
  backToSummaryPage: PropTypes.func
};
