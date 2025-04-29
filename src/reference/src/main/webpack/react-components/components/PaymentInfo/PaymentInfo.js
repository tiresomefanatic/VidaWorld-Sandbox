import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import Popup from "../Popup/Popup";
import {
  getProductBranchesData,
  getProductPricesData
} from "../../services/productDetails/productDetailsService";
import animation from "../../../site/scripts/animation";
import appUtils from "../../../site/scripts/utils/appUtils";
import analyticsUtils from "../../../site/scripts/utils/analyticsUtils";
import CONSTANT from "../../../site/scripts/constant";
import Dropdown from "../form/Dropdown/Dropdown";
import { useForm } from "react-hook-form";
import currencyUtils from "../../../site/scripts/utils/currencyUtils";
import SubsctiptionPlanInfo from "../SubsctiptionPlanInfo/SubsctiptionPlanInfo";

const PaymentInfo = (props) => {
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const animationWrapper = useRef(0);
  const { config } = props;
  const {
    heading,
    subHeading,
    fullPaymentLabel,
    loanPurchaseLabel,
    leasePurchaseLabel,
    startingPriceLabel,
    startingEmiLabel,
    selectedCityId,
    selectedVariantSku,
    knowMoreLabel,
    subsctiptionPlanConfig,
    fullPayment
  } = config;

  const preBookingUrl = appUtils.getPageUrl("preBookingUrl");
  const [branchList, setBranchList] = useState([]);
  const [priceList, setPriceList] = useState([]);

  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  //const [trackPopup, setTrackPopup] = useState("");
  const [isFullPayPopupOpen, setIsFullPayPopupOpen] = useState(false);
  const [isLoanPopupOpen, setIsLoanPopupOpen] = useState(false);
  const [stepper, setStepper] = useState(fullPayment.paymentStepsConfig);

  const { register, setValue } = useForm({
    mode: "onSubmit"
  });
  const updatePrice = (cityStateId) => {
    const selectedSkuPrice = priceList.filter(
      (item) =>
        item.city_state_id === cityStateId &&
        item.variant_sku === selectedVariantSku
    )[0];
    setSelectedCity(cityStateId);
    setSelectedPrice(selectedSkuPrice || priceList[0]);
  };

  const getProductBranch = async () => {
    const result = await getProductBranchesData();
    setBranchList(result);
    const cityStateList = result.map((item) => {
      return item["id"];
    });
    if (cityStateList.indexOf(selectedCityId) > 0) {
      setSelectedCity(selectedCityId);
    } else {
      setSelectedCity(cityStateList[0]);
    }
  };

  const getProductPrice = async () => {
    const result = await getProductPricesData();
    setPriceList(result);
  };

  useEffect(() => {
    /* Load Rest API Data */
    getProductBranch();
    getProductPrice();
  }, []);

  useEffect(() => {
    if (branchList.length > 0 && priceList.length > 0 && selectedCity) {
      updatePrice(selectedCity);
    }
  }, [branchList, priceList]);

  useEffect(() => {
    if (selectedPrice && selectedCity) {
      animation.animate(animationWrapper.current);
    }
  }, [selectedPrice, selectedCity]);

  const handlePopupClose = () => {
    document.querySelector("html").classList.remove("overflow-hidden");
    setIsFullPayPopupOpen(false);
    setIsLoanPopupOpen(false);
  };

  const handleOpenPopUp = (e, paymentMethod) => {
    e.preventDefault();
    document.querySelector("html").classList.add("overflow-hidden");
    if (paymentMethod === "fullPayment") {
      setIsFullPayPopupOpen(true);
    } else if (paymentMethod === "loan") {
      setIsLoanPopupOpen(true);
    }
    if (isAnalyticsEnabled) {
      const customLink = {
        name: e.target.innerText + ":Purchase on " + paymentMethod,
        position: "Bottom",
        type: "Link",
        clickType: "other"
      };
      const cityStateValue = branchList.find(
        (item) => item.id === selectedCity
      );
      const location = {
        state: cityStateValue.cityName.trim(),
        city: cityStateValue.stateName.trim(),
        pinCode: "",
        country: cityStateValue.countryName.trim()
      };
      const productDetails = {
        modelVariant: "",
        modelColor: "",
        productID: "",
        startingPrice:
          paymentMethod === CONSTANT.PAYMENT_METHOD.LOAN
            ? selectedPrice["minLoanEMI"]
            : selectedPrice["minLeaseEMI"]
      };
      analyticsUtils.trackCustomButtonClick(
        customLink,
        location,
        productDetails
      );
    }
  };
  return (
    <>
      {selectedPrice && selectedCity && (
        <section className="vida-payment-info bg-color--smoke-white">
          <div className="vida-payment-info__wrapper">
            <div
              className="vida-payment-info__container vida-container"
              ref={animationWrapper}
            >
              <div
                className="vida-payment-info__heading"
                data-animate="true"
                data-animation-name="zoom-out-txt"
              >
                <p
                  className="vida-product-detail__heading"
                  dangerouslySetInnerHTML={{
                    __html: heading
                  }}
                ></p>
              </div>
              <div
                className="vida-payment-info__description txt-color--solid-grey"
                data-animate="true"
                data-animation-name="fade-in"
                data-animation-delay="0.2"
              >
                <p
                  dangerouslySetInnerHTML={{
                    __html: subHeading
                  }}
                ></p>
              </div>
              <div className="vida-payment-info__location">
                <Dropdown
                  name="price"
                  label=""
                  iconClass={`icon-location-marker`}
                  options={branchList}
                  value={selectedCity}
                  setValue={setValue}
                  onChangeHandler={(name, value) => updatePrice(value)}
                  register={register}
                  isSortAsc={true}
                />
              </div>
              <div className="vida-payment-info__methods">
                <div className="vida-payment-info__box">
                  <div className="vida-payment-info__box__icon clearfix bshadow0 pbs">
                    <span className="icon-wallet"></span>
                  </div>
                  <div>
                    <div className="vida-payment-info__box__name">
                      {fullPaymentLabel}
                    </div>
                    <div className="vida-payment-info__box__desc">
                      {startingPriceLabel}
                    </div>
                    <div className="vida-payment-info__box__price">
                      {currencyUtils.getCurrencyFormatValue(
                        selectedPrice.onRoadPrice.split(",").join("")
                      )}
                    </div>
                    <div className="vida-payment-info__box__link">
                      <a
                        href="#"
                        onClick={(e) => {
                          handleOpenPopUp(
                            e,
                            CONSTANT.PAYMENT_METHOD.FULL_PAYMENT
                          );
                        }}
                      >
                        {knowMoreLabel}
                      </a>
                    </div>
                    {isFullPayPopupOpen && (
                      <Popup handlePopupClose={handlePopupClose}>
                        <div className="vida-full-payment">
                          <div className="vida-full-payment_title">
                            <h2>{fullPayment.title}</h2>
                          </div>
                          <div className="vida-full-payment_headline">
                            <h4>{fullPayment.headline}</h4>
                          </div>
                          <div className="vida-full-payment_description">
                            <p>{fullPayment.description}</p>
                          </div>
                          <nav className="vida-full-payment__stepper">
                            {stepper &&
                              stepper.map((item) => (
                                <ul
                                  key={item.id}
                                  className="vida-full-payment__list"
                                >
                                  <li>
                                    <div className="vida-full-payment__steps">
                                      <div className="vida-full-payment__iconDiv">
                                        <i
                                          className={`icon-${item.icon} vida-full-payment__status-icons`}
                                        ></i>
                                      </div>
                                      <div
                                        className={`vida-full-payment__info`}
                                      >
                                        <h4 className="vida-full-payment__info-title">
                                          {item.label}
                                        </h4>
                                        <p className="vida-full-payment__info-desc">
                                          {item.message}
                                        </p>
                                      </div>
                                    </div>
                                  </li>
                                </ul>
                              ))}
                          </nav>
                          <div className="vida-full-payment__ctabtn">
                            <a
                              href={preBookingUrl}
                              className="btn btn--primary btn--full-width"
                            >
                              {fullPayment.reserveBtnLabel}
                            </a>
                          </div>
                        </div>
                      </Popup>
                    )}
                  </div>
                </div>
                <div className="vida-payment-info__box">
                  <div className="vida-payment-info__box__icon clearfix bshadow0 pbs">
                    <span className="icon-library"></span>
                  </div>
                  <div>
                    <div className="vida-payment-info__box__name">
                      {loanPurchaseLabel}
                    </div>
                    <div className="vida-payment-info__box__desc">
                      {startingEmiLabel}
                    </div>
                    <div className="vida-payment-info__box__price">
                      {currencyUtils.getCurrencyFormatValue(
                        selectedPrice.minLoanEMI.split(",").join("")
                      )}
                    </div>
                    <div className="vida-payment-info__box__link">
                      <a
                        href="#"
                        onClick={(e) => {
                          handleOpenPopUp(e, CONSTANT.PAYMENT_METHOD.LOAN);
                        }}
                      >
                        {knowMoreLabel}
                      </a>
                    </div>
                    {isLoanPopupOpen && (
                      <Popup handlePopupClose={handlePopupClose}>
                        <iframe
                          width="100%"
                          height="100%"
                          frameBorder="0"
                          src={selectedPrice["loanOfferURL"]}
                        />
                      </Popup>
                    )}
                  </div>
                </div>
                <div className="vida-payment-info__box">
                  <div className="vida-payment-info__box__icon clearfix bshadow0 pbs">
                    <span className="icon-document-text"></span>
                  </div>
                  <div>
                    <div className="vida-payment-info__box__name">
                      {leasePurchaseLabel}
                    </div>
                    <div className="vida-payment-info__box__desc">
                      {startingEmiLabel}
                    </div>
                    <div className="vida-payment-info__box__price">
                      {currencyUtils.getCurrencyFormatValue(
                        selectedPrice.minLeaseEMI.split(",").join("")
                      )}
                    </div>
                    <div className="vida-payment-info__box__link">
                      {knowMoreLabel}
                    </div>
                  </div>
                </div>
              </div>

              <SubsctiptionPlanInfo config={subsctiptionPlanConfig} />
            </div>
          </div>
        </section>
      )}
    </>
  );
};

PaymentInfo.propTypes = {
  config: PropTypes.shape({
    heading: PropTypes.string,
    subHeading: PropTypes.string,
    fullPaymentLabel: PropTypes.string,
    loanPurchaseLabel: PropTypes.string,
    leasePurchaseLabel: PropTypes.string,
    startingPriceLabel: PropTypes.string,
    startingEmiLabel: PropTypes.string,
    selectedCityId: PropTypes.string,
    selectedVariantSku: PropTypes.string,
    knowMoreLabel: PropTypes.string,
    subsctiptionPlanConfig: PropTypes.object,
    fullPayment: PropTypes.shape({
      title: PropTypes.string,
      headline: PropTypes.string,
      description: PropTypes.string,
      reserveBtnLabel: PropTypes.string,
      paymentStepsConfig: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number,
          message: PropTypes.string,
          label: PropTypes.string
        })
      )
    })
  })
};

export default PaymentInfo;
