import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import breakpoints from "../../../../site/scripts/media-breakpoints";
import { getUtmParams } from "../../../services/utmParams/utmParams";
import { connect } from "react-redux";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";
import { usePaymentInfo } from "../../../hooks/payment/paymentHooks";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import appUtils from "../../../../site/scripts/utils/appUtils";
import { getProductPricesData } from "../../../services/productDetails/productDetailsService";
import currencyUtils from "../../../../site/scripts/utils/currencyUtils";
import { useGetAllProducts } from "../../../hooks/preBooking/preBookingHooks";
import { onlyNumbers } from "../../../../site/scripts/helper";
import VidaToolTip from "../VidaToolTip/VidaToolTip";
import { getBikeDetailsByColor } from "../../../services/commonServices/commonServices";
import getFontSizes from "../../../../site/scripts/utils/fontUtils";

const PaymentStatus = ({
  config,
  isSuccess,
  variant,
  productID,
  modelColor,
  userDataForPayment
}) => {
  const {
    bgImg,
    topBanner,
    payment,
    proceedBanner,
    cancelBanner,
    retryButtonLabel,
    navTab,
    navLink,
    productDetails,
    bikeVariantDetails
  } = config;

  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;
  const paymentInfo = usePaymentInfo();
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const [imageSrc, setImageSrc] = useState(
    "../src/main/webpack/resources/images/png/payment-success-desktop.png"
  );
  const [responseText, setResponseText] = useState("");
  const [priceTextLabel, setPriceTextLabel] = useState("");
  const [apiRejectError, setApiRejectError] = useState(null);
  const [variantData, setVariantData] = useState([]);
  const [variantSpecs, setVariantSpec] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState();
  const getAllProductData = useGetAllProducts();
  // const [paymentScooterInfo, setPaymentScooterInfo] = useState();

  const handleRedirection = () => {
    window.location.href = navLink;
  };
  const getProductData = async () => {
    const response = await getAllProductData({
      variables: {
        category_id: 2
      }
    });
    const data = response?.data?.products?.items.find(
      (el) => el.name == variant && el.sf_id == productID
    );
    setVariantSpec(data);
  };

  const inputValue = userDataForPayment?.first_name;
  const { fontSize, fontSizeSubHeader } = getFontSizes(inputValue, isDesktop);

  const handleRetryPayment = async (e) => {
    let lastName = userDataForPayment?.fname || "last";
    lastName = lastName.trim().split(" ")[lastName.split(" ").length - 1];
    e.preventDefault();
    setSpinnerActionDispatcher(true);
    const params = getUtmParams();
    const paymentResult = await paymentInfo({
      variables: {
        sf_itemsku_id: userDataForPayment.sf_itemsku_id,
        sf_item_id: userDataForPayment.sf_item_id,
        first_name: userDataForPayment?.first_name
          ? userDataForPayment.first_name
          : "first_name",
        last_name: userDataForPayment?.last_name,
        email_id: userDataForPayment?.email_id,
        customer_city: userDataForPayment?.customer_city,
        pincode: userDataForPayment?.pincode,
        branchId: userDataForPayment?.branchId,
        partnerId: userDataForPayment?.partnerId,
        utm_params: params
      }
    });
    if (
      paymentResult.data &&
      paymentResult.data.createPayment &&
      paymentResult.data.createPayment.payment_url
    ) {
      if (isAnalyticsEnabled) {
        const location = {
          state: "",
          city: "",
          pinCode: "560102",
          country: ""
        };
        const customLink = {
          name: e.target.innerText,
          position: "Payment Status Component",
          type: "Button",
          clickType: "other"
        };
        const productDetails = {
          modelVariant: selectedScooterData.name,
          modelColor: selectedScooterData.selectedVariant.product.name,
          productID: selectedScooterData.sf_id
        };
        const configuratorDetails = {
          accessorizeName: myScooter.configuredAccessories
            .toString()
            .split(",")
            .join("|")
        };
        analyticsUtils.trackPreBookingPayment(
          customLink,
          location,
          productDetails,
          configuratorDetails
        );
      }
      window.location.href = paymentResult.data.createPayment.payment_url;
    } else {
      setSpinnerActionDispatcher(false);
      setApiRejectError(paymentResult?.errors?.message || "Error occured");
      // setShowOtpError(paymentResult?.errors?.message || "Error occured");
    }
  };

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

  const getPaymentStatus = () => {
    if (isSuccess) {
      setImageSrc(
        isDesktop ? payment?.successImg?.desktop : payment?.successImg?.mobile
      );
      setResponseText(payment?.successStatusText);
      setPriceTextLabel(payment?.successPriceText);
    } else {
      setImageSrc(
        isDesktop ? payment?.failureImg?.desktop : payment?.failureImg?.mobile
      );
      setResponseText(payment?.failureStatusText);
      setPriceTextLabel(payment?.failurePriceText);
    }
  };

  const checkModalColor = async () => {
    if (modelColor && variant) {
      const modalVariant = variant;
      const variantDetails = JSON.parse(bikeVariantDetails)?.bikeVariants;
      const matchingVariant = variantDetails?.find(
        (item) =>
          item?.variantName.replace(" ", "").toLowerCase() ===
          modalVariant.replace(" ", "").toLowerCase()
      );
      const selectedBikeVariant = await getBikeDetailsByColor(
        modelColor,
        matchingVariant?.variantDetails
      );
      setSelectedVariant(selectedBikeVariant);
    }
  };

  useEffect(() => {
    getPaymentStatus();
    checkModalColor();
  }, []);

  const getProductPrice = async () => {
    const selectedStateCity = window.sessionStorage.getItem("cityStateId");
    const result = await getProductPricesData();
    const defaultCityData = await result?.find(
      (e) =>
        e.item_name?.toLowerCase() == variant?.toLowerCase() &&
        e.item_sf_id == productID &&
        e.city_state_id?.toLowerCase() == selectedStateCity?.toLowerCase()
    );
    setVariantData(defaultCityData || result[0]);
  };
  useEffect(() => {
    getProductPrice();
    getProductData();
  }, []);

  return (
    <div className="payment-status-bg-img">
      <img
        src={isDesktop ? bgImg?.desktop : bgImg?.mobile}
        alt="payment-bg"
        className="vida-payment-bg-img"
      />
      <div className="vida-container payment-status__container-wrapper">
        <div>
          {responseText && (
            <div className="payment-status-wrapper">
              <div
                className={
                  isSuccess
                    ? "payment-status-container"
                    : "payment-status-container failure"
                }
              >
                {!isDesktop && (
                  <div className="payment-status-container__top-banner-container">
                    <img
                      className="top-banner-bg"
                      src={selectedVariant?.bgImg || topBanner?.leftBgImgMob}
                      alt="banner_bg"
                      loading="lazy"
                    ></img>
                    <div className="top-banner-content-container">
                      <div className="user-info-container">
                        <p
                          className="user-info-name"
                          style={{
                            fontSize: fontSize,
                            color: selectedVariant?.textColor || "white"
                          }}
                        >
                          {`${userDataForPayment?.first_name}'s`}
                        </p>
                        <p
                          className="user-info-bike"
                          style={{
                            fontSize: fontSizeSubHeader,
                            color: selectedVariant?.textColor || "white"
                          }}
                        >
                          {variant ||
                            userDataForPayment?.sf_item_name ||
                            topBanner?.textTwo}{" "}
                          <span
                            className="subtext"
                            style={{
                              color: selectedVariant?.textColor || "white"
                            }}
                          >
                            {topBanner?.textThree}
                          </span>
                        </p>
                      </div>
                      <div className="user-info-bike-img">
                        <img
                          src={
                            selectedVariant?.bikeImg ||
                            topBanner?.topBannerBgImg
                          }
                          alt="user_info_bike_img"
                          loading="lazy"
                        ></img>
                      </div>
                    </div>
                  </div>
                )}

                <div className="payment-status-container">
                  <div className="symbol-container">
                    <img
                      src={imageSrc}
                      alt="success-failure-img"
                      loading="lazy"
                    />
                  </div>
                  <div className="status-text-container">
                    <div>
                      <h2
                        className="payment-status"
                        dangerouslySetInnerHTML={{
                          __html: responseText
                        }}
                      ></h2>
                    </div>

                    <div className="amount-text-container">
                      <p className="payment-amount-text">{priceTextLabel}</p>
                    </div>
                  </div>
                </div>

                <div className="bottom-container__highlight-container">
                  <div className="bottom-container-wrapper">
                    <a
                      className="proceed-banner-nav-link"
                      href={
                        isSuccess
                          ? proceedBanner?.paymentUrl
                          : "javascript:void(0)"
                      }
                      target={
                        proceedBanner?.proceedBannerNewTab ? "_blank" : "_self"
                      }
                      rel="noreferrer"
                    >
                      <div className="highlight-text-container">
                        <div className="scooty-img-container">
                          <img
                            src={proceedBanner?.scootyIcon}
                            alt="scooty-img"
                            loading="lazy"
                          />
                        </div>

                        <div className="highlight-wrapper">
                          <div className="proceed-to-buy-container">
                            <p className="proceed-text">
                              {proceedBanner?.header}{" "}
                              {`${variant || userDataForPayment?.sf_item_name}`}
                            </p>
                            {/* <p className="price-text">
                              {proceedBanner?.showroomPrice}₹
                              {
                                paymentScooterInfo?.selectedVariant?.product
                                  ?.price
                              }
                            </p> */}
                          </div>
                          <div className="choose-payment">
                            <p>{proceedBanner?.paymentMethod}</p>
                          </div>
                        </div>
                      </div>
                    </a>

                    <a
                      className="cancel-banner-nav-link"
                      href={
                        isSuccess
                          ? cancelBanner?.cancelUrl
                          : "javascript:void(0)"
                      }
                      target={
                        cancelBanner?.cancelBannerNewTab ? "_blank" : "_self"
                      }
                      rel="noreferrer"
                    >
                      <div className="top-container">
                        <div className="top-container__text-container">
                          <div className="cancel-text-container">
                            <p className="cancel-text">
                              {cancelBanner?.header}
                            </p>
                          </div>

                          <div className="convey-container">
                            <p className="inner-text">
                              {cancelBanner?.cancelText}
                            </p>
                          </div>
                        </div>
                      </div>
                    </a>

                    {!isSuccess && (
                      <div className="payment-status__retry-button">
                        <button
                          className="desktop-button"
                          onClick={
                            navLink ? handleRedirection : handleRetryPayment
                          }
                        >
                          {retryButtonLabel}
                        </button>
                      </div>
                    )}
                    {apiRejectError && (
                      <p className="wrapper__api-error-msg">{apiRejectError}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {isDesktop && (
          <div className="payment-status__right-wrapper">
            <div
              className="payment-status__top-banner"
              style={{
                backgroundImage: `url(${
                  selectedVariant?.bgImg ||
                  topBanner.topBannerDesktopbackgroundImage
                })`
              }}
            >
              <div className="payment-status__user-details-wrapper">
                <div className="payment-status__user-details">
                  <p
                    className="payment-status__user-name"
                    style={{
                      fontSize: fontSize,
                      color: selectedVariant?.textColor || "white"
                    }}
                  >
                    {`${userDataForPayment?.first_name}'s`}
                    {/* {`${
                      isUserLoggedIn
                        ? userProfileData?.fname
                        : isUserName?.randomNameContent
                    }'s`} */}
                  </p>
                  <p
                    className="payment-status__bike-name"
                    style={{
                      fontSize: fontSizeSubHeader,
                      color: selectedVariant?.textColor || "white"
                    }}
                  >
                    {variant ||
                      userDataForPayment?.sf_item_name ||
                      topBanner?.textTwo}{" "}
                  </p>
                  <p
                    className="payment-status__sub-text"
                    style={{
                      color: selectedVariant?.textColor || "white"
                    }}
                  >
                    {topBanner?.textThree}
                  </p>
                </div>
                <div className="payment-status__bike-image">
                  <img
                    src={selectedVariant?.bikeImg || topBanner?.topBannerBgImg}
                    alt="bike img"
                    loading="lazy"
                  ></img>
                </div>
              </div>
            </div>
            {/* Commenting out as per Business Feedback */}
            {/* <div className="payment-status__offer-text-streaming">
              <div className="payment-status__offer-scroll-wrapper">
                <div className="payment-status__img-scroll">
                  <img
                    src={topBanner?.offerScrollingImg}
                    alt="scrolling text"
                    loading="lazy"
                  ></img>
                  <img
                    src={topBanner?.offerScrollingImg}
                    alt="scrolling text"
                    loading="lazy"
                  ></img>
                  <img
                    src={topBanner?.offerScrollingImg}
                    alt="scrolling text"
                    loading="lazy"
                  ></img>
                  <img
                    src={topBanner?.offerScrollingImg}
                    alt="scrolling text"
                    loading="lazy"
                  ></img>
                </div>
              </div>
            </div> */}
            <div className="payment-status__price-details">
              <div className="payment-status__price-list-wrapper">
                <div className="payment-status__price-lists">
                  <div className="payment-status__price-label">
                    <p className="payment-status__price-label-text">
                      {topBanner?.buyAnyLabel}
                    </p>
                  </div>
                  <div className="payment-status__price-wrapper">
                    <p className="payment-status__price">
                      ₹{topBanner?.buyAnyPrice}
                    </p>
                    <p className="payment-status__showroom-text">
                      Fully Refundable
                    </p>
                  </div>
                </div>
                <div className="payment-status__price-lists">
                  <div className="payment-status__price-label">
                    <p className="payment-status__price-label-text">
                      {`BUY ${variant || userDataForPayment?.sf_item_name}`}
                      &nbsp;
                      {topBanner?.buyLabel2}
                    </p>
                  </div>
                  <div className="payment-status__price-wrapper">
                    <p className="payment-status__price">
                      <span>
                        {currencyUtils.getCurrencyFormatValue(
                          variantData?.exShowRoomPrice,
                          0
                        )}

                        <VidaToolTip componentName="paymentStatus" />
                      </span>
                    </p>
                    <p className="payment-status__showroom-text">
                      {topBanner?.priceType}
                    </p>
                  </div>
                </div>
                <div className="payment-status__compare-wrapper">
                  <p className="payment-status__compare-text">
                    {topBanner?.compareVariantsText}
                  </p>
                </div>
              </div>
              <div className="payment-status__specifications">
                <div className="payment-status__product-specification">
                  <div className="payment-status__specifications-container">
                    <div className="payment-status__specifications-wrapper">
                      <div className="payment-status__specification-icon">
                        <img
                          src={productDetails?.inClineCapacityIcon}
                          alt="specification Value"
                        ></img>
                      </div>
                      <div className="payment-status__specification-detail-wrapper">
                        <p className="payment-status__specification-text">
                          {productDetails?.inClineCapacity}
                        </p>
                        <div className="payment-status__specification-value-wrapper">
                          <p className="payment-status__specification-value">
                            {variantSpecs && variantSpecs?.incline_capacity}
                          </p>
                          <p className="payment-status__specification-unit">
                            {productDetails?.inClineCapacityValue
                              ?.split(" ")
                              ?.slice(1, 2)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="payment-status__specifications-wrapper">
                      <div className="payment-status__specification-icon">
                        <img
                          src={productDetails?.rangeIcon}
                          alt="specification Value"
                        ></img>
                      </div>
                      <div className="payment-status__specification-detail-wrapper">
                        <p className="payment-status__specification-text">
                          {productDetails?.range}
                        </p>
                        <div className="payment-status__specification-value-wrapper">
                          <p className="payment-status__specification-value">
                            {variantSpecs &&
                              onlyNumbers(
                                variantSpecs?.variants[0]?.product?.rangewmtc_c
                              )}
                          </p>
                          <p className="payment-status__specification-unit">
                            {productDetails?.rangeValue
                              ?.split(" ")
                              ?.slice(1, 2) + "*"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="payment-status__specifications-container">
                    <div className="payment-status__specifications-wrapper">
                      <div className="payment-status__specification-icon">
                        <img
                          src={productDetails?.topSpeedIcon}
                          alt="specification Value"
                        ></img>
                      </div>
                      <div className="payment-status__specification-detail-wrapper">
                        <p className="payment-status__specification-text">
                          {productDetails?.topSpeed}
                        </p>
                        <div className="payment-status__specification-value-wrapper">
                          <p className="payment-status__specification-value">
                            {variantSpecs &&
                              onlyNumbers(
                                variantSpecs?.variants[0]?.product?.top_speed
                              )}
                          </p>
                          <p className="payment-status__specification-unit">
                            {productDetails?.topSpeedValue
                              ?.split(" ")
                              ?.slice(1, 2)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="payment-status__specifications-wrapper">
                      <div className="payment-status__specification-icon">
                        <img
                          src={productDetails?.removableBatteriesIcon}
                          alt="specification Value"
                        ></img>
                      </div>
                      <div className="payment-status__specification-detail-wrapper">
                        {variantSpecs?.variants[0]?.product?.name.includes(
                          "V2 LITE"
                        ) ? (
                          <p className="payment-status__specification-text">
                            {productDetails?.removableBatteries}
                          </p>
                        ) : (
                          <p className="payment-status__specification-text">
                            {productDetails?.removableBattery}
                          </p>
                        )}
                        <div className="payment-status__specification-value-wrapper">
                          <p className="payment-status__specification-value">
                            {variantSpecs &&
                              onlyNumbers(
                                variantSpecs?.variants[0]?.product
                                  ?.battery_capacity
                              )}
                          </p>
                          <p className="payment-status__specification-unit">
                            {productDetails?.removableBatteriesValue
                              ?.split(" ")
                              ?.slice(1, 2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="payment-status__download-share-wrapper">
                <div
                  className="payment-status__download"
                  onClick={(event) => {
                    isHandleDownloadPDF(topBanner?.productSpecificationPdfUrl);
                  }}
                >
                  <img
                    src={
                      appUtils.getConfig("resourcePath") +
                      "images/svg/download.svg"
                    }
                    alt="download icon"
                  ></img>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
const mapStateToProps = ({
  userAccessReducer,
  scooterInfoReducer,
  preBookingReducer,
  userProfileDataReducer
}) => {
  return {
    userDataForPayment: {
      sf_itemsku_id: scooterInfoReducer?.selectedVariant?.product?.sf_id,
      sf_item_id: scooterInfoReducer.sf_id,
      sf_item_product_info: scooterInfoReducer?.selectedVariant.product,
      sf_item_name: scooterInfoReducer?.name,
      first_name: userProfileDataReducer?.fname
        ? userProfileDataReducer.fname
        : "first_name",
      last_name: userAccessReducer.lname,
      email_id: userProfileDataReducer.email,
      customer_city: userProfileDataReducer?.city,
      pincode: preBookingReducer.pincode,
      branchId: preBookingReducer.branchId,
      partnerId: preBookingReducer.partnerId
    }
  };
};

PaymentStatus.propTypes = {
  config: PropTypes.shape({
    bgImg: PropTypes.any,
    isSuccess: PropTypes.bool,
    topBanner: PropTypes.any,
    payment: PropTypes.any,
    proceedBanner: PropTypes.any,
    cancelBanner: PropTypes.any,
    retryButtonLabel: PropTypes.string,
    navTab: PropTypes.bool,
    navLink: PropTypes.string,
    productDetails: PropTypes.object,
    bikeVariantDetails: PropTypes.object
  }),
  variant: PropTypes.string,
  productID: PropTypes.string,
  isSuccess: PropTypes.bool,
  userDataForPayment: PropTypes.object,
  modelColor: PropTypes.string
};

export default connect(mapStateToProps)(PaymentStatus);
