import React from "react";
import ScooterInfo from "../ScooterInfo/ScooterInfo";
import { RWebShare } from "react-web-share";
import appUtils from "../../../../site/scripts/utils/appUtils";
import PropTypes from "prop-types";

// const fontSize = "72px";
// const fontSizeSubHeader = "48px";
const SCROLLABLE_OFFERS = [1, 2, 3, 4];
const ScooterInfoWrapper = ({
  bannerBackGroundImage,
  textColor,
  userName,
  bikeName,
  subText,
  bikeDetails,
  offerScrollingImg,
  bookScooterLabel,
  bookingPrice,
  bookingPriceSubText,
  variantActiveIndex,
  scooterData,
  compareTextLabel,
  pdfUrl,
  fontSize,
  fontSizeSubHeader,
  scooterInfoConfig,
  genericConfig,
  handleActiveScooter,
  isActiveScooterModel,
  defaultSelection,
  handleVariantCalled,
  setHandleVariantCalled,
  activeVariant,
  setActiveVariant,
  handleColorChange
}) => {
  // for downloading the spec detail PDF
  const isHandleDownloadPDF = (url) => {
    const downloadLink = document.createElement("a");
    const fileURL = url;
    downloadLink.href = fileURL;
    downloadLink.download = "Product-specification.pdf";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };
  return (
    <div className="buy-now-pre-booking-vida2__right-wrapper">
      <div
        className="buy-now-pre-booking-vida2__top-banner"
        style={{
          backgroundImage: `url(${bannerBackGroundImage})`
        }}
      >
        <div className="buy-now-pre-booking-vida2__user-details-wrapper">
          <div
            className="buy-now-pre-booking-vida2__user-details"
            style={{
              color: textColor
            }}
          >
            <p
              className="buy-now-pre-booking-vida2__user-name"
              style={{ fontSize: fontSize }}
            >
              {`${userName}'s`}
            </p>
            <p
              className="buy-now-pre-booking-vida2__bike-name"
              style={{ fontSize: fontSizeSubHeader }}
            >
              {bikeName}
            </p>
            <p className="buy-now-pre-booking-vida2__sub-text">{subText}</p>
          </div>
          <div className="buy-now-pre-booking-vida2__bike-image">
            <img
              src={bikeDetails?.bikeImage}
              alt={bikeDetails?.alt || "bike img"}
              title={bikeDetails?.title}
              loading="lazy"
            ></img>
          </div>
        </div>
      </div>
      {/* Removing Offers scroll as per Business comments */}
      {/* <div className="buy-now-pre-booking-vida2__offer-text-streaming">
        <div className="buy-now-pre-booking-vida2__offer-scroll-wrapper">
          <div className="buy-now-pre-booking-vida2__img-scroll">
            {SCROLLABLE_OFFERS.map((i) => (
              <img key={i} src={offerScrollingImg} alt="scrolling text"></img>
            ))}
          </div>
        </div>
      </div> */}
      <div className="buy-now-pre-booking-vida2__price-details">
        <div className="buy-now-pre-booking-vida2__price-list-wrapper">
          <div className="buy-now-pre-booking-vida2__price-lists">
            <div className="buy-now-pre-booking-vida2__price-label">
              <p className="buy-now-pre-booking-vida2__price-label-text">
                {bookScooterLabel}
              </p>
            </div>
            <div className="buy-now-pre-booking-vida2__price-wrapper">
              <p className="buy-now-pre-booking-vida2__price">
                ₹{bookingPrice}
              </p>
              <p className="buy-now-pre-booking-vida2__subtext">
                {bookingPriceSubText}
              </p>
            </div>
          </div>
          {scooterData?.products?.items
            .filter((item, index) => {
              return index == variantActiveIndex;
            })
            .map((product, index) => (
              <ScooterInfo
                scooterInfoConfig={scooterInfoConfig}
                genericConfig={genericConfig}
                isColorVariantLayout={false}
                isPriceVariant={true}
                isImgLeftLayout={true}
                productData={product}
                activeScooterHandler={handleActiveScooter}
                key={index}
                isActiveScooterModel={
                  isActiveScooterModel
                    ? product.sku == isActiveScooterModel
                      ? true
                      : false
                    : index == 0
                    ? true
                    : false
                }
                defaultSelection={defaultSelection}
                handleVariantCalled={handleVariantCalled}
                setHandleVariantCalled={setHandleVariantCalled}
                activeVariantParent={activeVariant}
                setActiveVariantParent={setActiveVariant}
                isOnStepThree={false}
                handleColorChange={handleColorChange}
              ></ScooterInfo>
            ))}
          <div className="buy-now-pre-booking-vida2__compare-wrapper">
            <p className="buy-now-pre-booking-vida2__compare-text">
              {compareTextLabel}
            </p>
          </div>
        </div>
        <div className="buy-now-pre-booking-vida2__specifications">
          {scooterData?.products?.items
            .filter((item, index) => {
              return index == variantActiveIndex;
            })
            .map((product, index) => (
              <ScooterInfo
                scooterInfoConfig={scooterInfoConfig}
                isSpecificationLayout={true}
                genericConfig={genericConfig}
                isImgLeftLayout={true}
                productData={product}
                activeScooterHandler={handleActiveScooter}
                key={index}
                isActiveScooterModel={
                  isActiveScooterModel
                    ? product.sku == isActiveScooterModel
                      ? true
                      : false
                    : index == 0
                    ? true
                    : false
                }
                defaultSelection={defaultSelection}
                handleVariantCalled={handleVariantCalled}
                setHandleVariantCalled={setHandleVariantCalled}
                activeVariantParent={activeVariant}
                setActiveVariantParent={setActiveVariant}
                isOnStepThree={false}
                handleColorChange={handleColorChange}
              ></ScooterInfo>
            ))}
        </div>
        <div className="buy-now-pre-booking-vida2__download-share-wrapper">
          <RWebShare
            data={{
              url: pdfUrl
            }}
            onClick={(e) => console.log("shared successfully!")}
          >
            <div className="buy-now-pre-booking-vida2__share">
              <a>
                <img
                  src={
                    appUtils.getConfig("resourcePath") + "images/svg/share.svg"
                  }
                  alt=""
                ></img>
              </a>
            </div>
          </RWebShare>
          <div
            className="buy-now-pre-booking-vida2__download"
            onClick={() => {
              isHandleDownloadPDF(pdfUrl);
            }}
          >
            <img
              src={
                appUtils.getConfig("resourcePath") + "images/svg/download.svg"
              }
              alt=""
            ></img>
          </div>
        </div>
      </div>
    </div>
  );
};

ScooterInfoWrapper.propTypes = {
  bannerBackGroundImage: PropTypes.string,
  textColor: PropTypes.string,
  userName: PropTypes.string,
  bikeName: PropTypes.string,
  subText: PropTypes.string,
  bikeDetails: PropTypes.shape({
    bikeImage: PropTypes.string,
    alt: PropTypes.string,
    title: PropTypes.string
  }),
  offerScrollingImg: PropTypes.string,
  bookScooterLabel: PropTypes.string,
  bookingPrice: PropTypes.string,
  bookingPriceSubText: PropTypes.string,
  variantActiveIndex: PropTypes.number,
  scooterData: PropTypes.object,
  compareTextLabel: PropTypes.string,
  pdfUrl: PropTypes.string,
  fontSize: PropTypes.string,
  fontSizeSubHeader: PropTypes.string,
  scooterInfoConfig: PropTypes.object,
  genericConfig: PropTypes.object,
  handleActiveScooter: PropTypes.func,
  isActiveScooterModel: PropTypes.string,
  defaultSelection: PropTypes.number,
  handleVariantCalled: PropTypes.func,
  setHandleVariantCalled: PropTypes.func,
  activeVariant: PropTypes.number,
  setActiveVariant: PropTypes.func,
  handleColorChange: PropTypes.func
};

export default ScooterInfoWrapper;
