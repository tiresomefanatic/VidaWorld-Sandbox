import React, { useEffect, useState } from "react";
import SummaryDetails from "../SummaryDetails/SummaryDetails";
import PropTypes from "prop-types";
import CustomBottomDrawer from "./CustomBottomDrawer";
import { PURCHASE_STATE } from "./Constants";
import useScreen from "../../../../hooks/utilities/useScreen";
import { useCancelOrder } from "../../../../hooks/userProfile/userProfileHooks";
import Button from "../Components/Button";
import { BUTTON_TYPES } from "../BillingShippingAddress/Constants";
import { SCREENS } from "../Constants";
import appUtils from "../../../../../site/scripts/utils/appUtils";
import analyticsUtils from "../../../../../site/scripts/utils/analyticsUtils";
import { showNotificationDispatcher } from "../../../../store/notification/notificationActions";
import { connect } from "react-redux";
import { setSpinnerActionDispatcher } from "../../../../store/spinner/spinnerActions";
import breakpoints from "../../../../../site/scripts/media-breakpoints";
import dateUtils from "../../../../../site/scripts/utils/dateUtils";
import {
  useGetAllProducts,
  useChangeVariant
} from "../../../../hooks/preBooking/preBookingHooks";
import Logger from "../../../../../services/logger.service";
import CONSTANT from "../../../../../site/scripts/constant";
import {
  useGetDiscountData,
  useUpdateDiscountData
} from "../../../../hooks/purchaseConfig/purchaseConfigHooks";
import { setOfferDataDispatcher } from "../../../../store/purchaseConfig/purchaseConfigActions";
import Banner from "../Components/Banner";
import getFontSizes from "../../../../../site/scripts/utils/fontUtils";

const PurchaseSummary = (props) => {
  // component states
  const {
    config,
    changeScreen,
    amountData,
    proceed,
    paymentDetails,
    totalAmount,
    totalGSTAmount,
    priceBreakUp,
    dealerName,
    productData,
    orderDetails,
    userProfileProps,
    updateFame,
    fameApplied,
    productId,
    optedBikeVariant,
    offers,
    handleOffers,
    backFromAddress
  } = props;
  const {
    bottomDrawer: { cancelState, reviewState, initialState }
  } = config;
  const [isOpened, setIsOpened] = useState(false);
  const [viewState, setViewState] = useState(
    backFromAddress ? PURCHASE_STATE.REVIEW : PURCHASE_STATE.INITIAL
  );
  const [isTnCAccepted, setTnCAccepted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCancelBooking, setIsCancelBoooking] = useState(false);
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const [openSelectVariantPopup, setOpenVariantPopup] = useState(false);
  const [variant, setVariant] = useState("V1 PRO");
  const [variantActiveIndex, setVariantActiveIndex] = useState();
  const [activeVariant, setActiveVariant] = useState(null);
  const [activeScooterModel, setActiveScooterModel] = useState("");
  const [scooterData, setScooterData] = useState(null);
  const [variantList, setVariantList] = useState([]);
  const [activeVariantSfid, setActiveVariantSfid] = useState();
  const [productSfId, setProductSfid] = useState();
  const [showOfferPopup, setShowOffersPopup] = useState(false);

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;

  const cancelUserOrder = useCancelOrder();
  const profileUrl = appUtils.getPageUrl("profileUrl");
  const [purchaseDate, setPurchaseDate] = useState("");
  const getAllProductData = useGetAllProducts();
  const changeScooterVariant = useChangeVariant();
  const getProductColor = appUtils.getConfig("vidaVariantColorCodes");
  const getDiscountOffers = useGetDiscountData();
  const [discountData, setDiscountData] = useState([]);
  const [selectedDiscount, setSelectedDiscount] = useState("None");
  const [selectedOfferPrice, setSelectedOfferPrice] = useState(0);
  const updateDiscountOffers = useUpdateDiscountData();

  useEffect(() => {
    const selectedItemIndex = scooterData?.products?.items?.findIndex(
      (item) => item.sku === productData.sku
    );
    setActiveScooterModel(scooterData?.products?.items[selectedItemIndex]);
    setActiveVariant(
      scooterData?.products?.items[selectedItemIndex]?.variants.findIndex(
        (data) => data.product.sku === productData.variantSku
      )
    );
    const defaultVariantSfId = scooterData?.products?.items[
      selectedItemIndex
    ]?.variants.filter(
      (data) => data.product.sku === productData.variantSku
    )[0];
    setActiveVariantSfid(defaultVariantSfId?.product.sf_id);
  }, [scooterData, productData]);

  const getAllProductsData = async () => {
    try {
      setSpinnerActionDispatcher(true);
      const allProductsData = await getAllProductData({
        variables: {
          category_id: 2
        }
      });

      if (allProductsData) {
        allProductsData.data.products.items =
          allProductsData.data.products.items.filter(function (item) {
            return item.variants.length > 0;
          });
      }

      setScooterData(allProductsData.data);

      const selectedItemIndex = scooterData?.products?.items?.findIndex(
        (item) => item.sku === productData.sku
      );
      setActiveScooterModel(
        allProductsData.data.products.items[selectedItemIndex]
      );
      setSpinnerActionDispatcher(false);
    } catch (error) {
      Logger.error(error.message);
    }
  };

  const ctaTracking = (e, eventName, ctaLocation) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        ctaText: e.target.innerText,
        ctaLocation: e.target.dataset.linkPosition || ctaLocation
      };
      analyticsUtils.trackCTAClicksVida2(customLink, eventName);
    }
  };

  const handleToggleDrawer = () => {
    setIsOpened(!isOpened);
  };

  const handleCancelOrder = () => {
    setViewState(PURCHASE_STATE.CANCEL);
    setIsCancelBoooking(true);
  };

  const handleConfirmCancel = async () => {
    try {
      setSpinnerActionDispatcher(true);
      const cancelUserOrderData = await cancelUserOrder({
        variables: {
          sf_order_id: orderDetails?.orderId,
          cancellationReason: "cancel booking"
        }
      });
      if (
        cancelUserOrderData &&
        cancelUserOrderData.data &&
        cancelUserOrderData.data.cancelSaleOrder
      ) {
        window.location.href = profileUrl;
      } else {
        showNotificationDispatcher({
          title: cancelUserOrderData.data.cancelSaleOrder.message,
          type: CONSTANT.NOTIFICATION_TYPES.ERROR,
          isVisible: true
        });
        setSpinnerActionDispatcher(false);
      }
    } catch (error) {
      Logger.error(error.message);
    }
  };

  const handleTncChange = (e) => {
    setTnCAccepted(e.target.checked);
  };

  const proceedToReview = (e) => {
    if (amountData?.insurance?.applied) {
      setViewState(PURCHASE_STATE.REVIEW);
      const event = { ...e };
      event.target.innerText = event.target.innerText.split("\n")[0];
      ctaTracking(event, "ctaButtonClick", "Payment Summary");
    } else {
      setErrorMessage("Please add insurance first");
    }
  };

  const handleKeepOrdering = () => {
    setViewState(PURCHASE_STATE.INITIAL);
    setIsCancelBoooking(false);
  };

  const handleAddInsuranceClick = () => {
    changeScreen(SCREENS.INSURANCE);
  };

  const inputValue = userProfileProps?.fname;
  const { fontSize, fontSizeSubHeader } = getFontSizes(inputValue, isDesktop);

  useEffect(() => {
    setPurchaseDate(dateUtils.calcDeliveryDate());
  }, []);

  useEffect(() => {
    if (productId) {
      setProductSfid(productId);
    }
  }, [productId]);

  useEffect(() => {
    if (variantActiveIndex) {
      const filterVariantList = scooterData?.products?.items?.filter(
        (variant) =>
          variant?.name?.toLowerCase() === variantActiveIndex?.toLowerCase()
      );
      if (filterVariantList) {
        setVariantList(filterVariantList[0]?.variants);
      }
    }
  }, [variantActiveIndex]);

  const changeVariantHandler = () => {
    setOpenVariantPopup(!openSelectVariantPopup);
    getAllProductsData();
  };

  useEffect(() => {
    if (scooterData?.products?.items.length) {
      setVariantActiveIndex(productData.name);
    }
  }, [scooterData]);

  const handleVariantClick = (product, index) => {
    setVariant(product?.name);
    setVariantActiveIndex(product?.name);
    setProductSfid(product?.sf_id);
    setActiveVariant(0);
    setActiveVariantSfid(product?.variants[0]?.product?.sf_id);
  };

  const handleVariant = (e, variantData, index) => {
    e.stopPropagation();
    setActiveVariant(index);
    setActiveVariantSfid(variantData?.product?.sf_id);
  };

  const cancelChangeVariant = (e) => {
    ctaTracking(e, "ctaButtonClick", "Cancel - Product Variant Change");
    setOpenVariantPopup(false);
  };

  const confirmChangeVariant = async (e) => {
    const updatedScooter = {
      sf_order_id: orderDetails?.orderId,
      sf_item_id: productSfId,
      sf_itemsku_id: activeVariantSfid
    };
    setSpinnerActionDispatcher(true);
    const changeVariantResult = await changeScooterVariant({
      variables: updatedScooter
    });

    if (
      changeVariantResult.data &&
      changeVariantResult.data.changeProductVariant &&
      changeVariantResult.data.changeProductVariant.status === "200"
    ) {
      showNotificationDispatcher({
        title: changeVariantResult.data.changeProductVariant.message,
        type: CONSTANT.NOTIFICATION_TYPES.SUCCESS,
        isVisible: true
      });
      setOpenVariantPopup(false);
      ctaTracking(e, "confirmCTAClick", "Confirm - Product Variant Change");

      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  const variantChange = (e, variant, variantIndex) => {
    `${handleVariant(e, variant, variantIndex)}`;
  };

  const getDiscountValues = async () => {
    const variables = {
      order_id: orderDetails?.orderId
    };
    const getDiscountData = await getDiscountOffers({ variables });
    if (getDiscountData.data?.orderDiscount?.items) {
      const defaultNoSelectionObj = {
        discount_amount: 0,
        discount_description: null,
        discountgroup_id: "",
        item_id: "",
        discount_grouprule_id: "",
        sf_order_id: "",
        sf_orderline_id: "",
        sku_id: "",
        discount_appliedinso: true,
        discount_name: "None",
        dateEffectiveTill__c: "",
        dateEffectiveFrom__c: "",
        gst_discounted_amount: 0,
        is_default_discount: false,
        __typename: "OrderDiscountData",
        net_benefit_tocustomer: 0
      };
      const updatedDiscountArray = [
        ...getDiscountData.data?.orderDiscount?.items,
        defaultNoSelectionObj
      ];
      setDiscountData(updatedDiscountArray);
    } else {
      showNotificationDispatcher({
        title: getDiscountData?.error?.message,
        type: CONSTANT.NOTIFICATION_TYPES.ERROR,
        isVisible: true
      });
    }
  };

  const handleDiscountOffersPopup = async () => {
    setSpinnerActionDispatcher(true);
    if (!discountData?.length > 0) {
      await getDiscountValues();
    }
    setTimeout(() => {
      const preFilledDiscounts = document.getElementsByClassName(
        "discount-input-checkbox"
      );
      [...preFilledDiscounts].forEach((domElement) => {
        if (selectedDiscount === domElement.value) {
          domElement.checked = true;
        }
      });
      setSpinnerActionDispatcher(false);
    }, 500);
  };

  const handleCheckboxSelect = (e) => {
    if (e.target.checked) {
      setSelectedDiscount(e.target.value);
    }
    // else {
    //   if (selectedDiscount.includes(e.target.value)) {
    //     const removeFromDiscountArray = [...selectedDiscount];
    //     const removalIndex = removeFromDiscountArray.indexOf(e.target.value);
    //     removeFromDiscountArray.splice(removalIndex, 1);
    //     setSelectedDiscount(removeFromDiscountArray);
    //   }
    // }
  };

  useEffect(() => {
    if (showOfferPopup) {
      handleDiscountOffersPopup();
    }
  }, [showOfferPopup]);

  useEffect(() => {
    const updateOffers = async (tempObj) => {
      const updateDiscountResult = await updateDiscountOffers({
        variables: tempObj
      });

      if (
        updateDiscountResult.data &&
        updateDiscountResult.data.updateOrderDiscount &&
        updateDiscountResult.data.updateOrderDiscount.status === "200"
      ) {
        showNotificationDispatcher({
          title: "Offer Expired, Please choose a different one",
          type: CONSTANT.NOTIFICATION_TYPES.SUCCESS,
          isVisible: true
        });
      }
    };
    if (offers?.offersName?.length > 0) {
      setSelectedDiscount(offers?.offersName);

      if (offers.offerExpiryDate != "") {
        const expiryDate = new Date(offers.offerExpiryDate);

        if (expiryDate < currentDate) {
          let tempObj = {};
          let offerStoreData = {};

          offerStoreData = {
            offersName: "None",
            offerPrice: 0,
            offersGST: 0,
            offerTotal: 0,
            offerExpiryDate: ""
          };
          tempObj = {
            items: [],
            order_id: orderDetails?.orderId
          };
          updateOffers(tempObj);
        }
      }
    }
  }, [offers?.offersName]);

  const handleCancelOffer = (e) => {
    ctaTracking(e, "ctaButtonClick", "Cancel - Offers Popup");
    if (discountData?.length > 0) {
      setSelectedDiscount(offers?.offersName);
    }
    setShowOffersPopup(false);
  };

  const handleConfirmOffer = async (e) => {
    setSpinnerActionDispatcher(true);
    let tempObj = {};
    let appliedDiscountPrice = 0;
    let appliedDiscountGST = 0;
    let appliedTotalDiscount = 0;
    let appliedDiscountExpiryDate = "";
    let offerStoreData = {};
    if (selectedDiscount !== "None") {
      const appliedDiscountArray = discountData?.filter((item) => {
        return selectedDiscount === item.discount_name;
      });
      appliedDiscountArray?.map((element) => {
        appliedDiscountPrice += element.discount_amount;
        appliedDiscountGST += element.gst_discounted_amount;
        appliedTotalDiscount += element.net_benefit_tocustomer;
        appliedDiscountExpiryDate = element.dateEffectiveTill__c;
      });
      // setOfferDataDispatcher(appliedDiscountArray);
      offerStoreData = {
        offersName: selectedDiscount,
        offerPrice: appliedDiscountPrice,
        offersGST: appliedDiscountGST,
        offerTotal: appliedTotalDiscount,
        offerExpiryDate: appliedDiscountExpiryDate
      };
      const updateDiscountInput = appliedDiscountArray.map((item) => {
        const newObj = { ...item };
        delete newObj["__typename"];
        return newObj;
      });
      tempObj = {
        items: updateDiscountInput,
        order_id: orderDetails?.orderId
      };
    } else {
      offerStoreData = {
        offersName: "None",
        offerPrice: appliedDiscountPrice,
        offersGST: appliedDiscountGST,
        offerTotal: appliedTotalDiscount,
        offerExpiryDate: appliedDiscountExpiryDate
      };
      tempObj = {
        items: [],
        order_id: orderDetails?.orderId
      };
    }

    setSelectedOfferPrice(appliedDiscountPrice);

    const variables = tempObj;
    const updateDiscountResult = await updateDiscountOffers({
      variables: variables
    });
    if (
      updateDiscountResult.data &&
      updateDiscountResult.data.updateOrderDiscount &&
      updateDiscountResult.data.updateOrderDiscount.status === "200"
    ) {
      handleOffers(offers, offerStoreData);
      setOfferDataDispatcher(offerStoreData);
      ctaTracking(e, "confirmCTAClick", `Confirm - ${selectedDiscount}`);
      showNotificationDispatcher({
        title: updateDiscountResult.data.updateOrderDiscount.message,
        type: CONSTANT.NOTIFICATION_TYPES.SUCCESS,
        isVisible: true
      });
      setSpinnerActionDispatcher(false);
    }
    setSpinnerActionDispatcher(false);
    setShowOffersPopup(false);
  };

  useEffect(() => {
    if (openSelectVariantPopup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [openSelectVariantPopup]);

  const handleReviewBack = () => {
    setViewState(PURCHASE_STATE.INITIAL);
  };

  const ctaTrackingBack = (e, eventName, screenName, pageName) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        ctaText: e?.target?.innerText + " - " + screenName,
        ctaLocation:
          pageName || e?.target?.dataset?.linkPosition || e?.linkPosition
      };
      analyticsUtils.trackCTAClicksVida2(customLink, eventName, "", pageName);
    }
  };

  return (
    <>
      <div className="vida-purchase-summary vida-2-container">
        <div className="vida-purchase-summary__left-container">
          <div className="purchase-summary-success-booking">
            {viewState.toLowerCase() === "review" && (
              <button
                type="button"
                className="back-button"
                onClick={(e) => {
                  handleReviewBack();
                  ctaTrackingBack(
                    e,
                    "backButtonClick",
                    "Review Screen",
                    "Buy: Review Screen"
                  );
                }}
              >
                {config?.backButtonLabel}
              </button>
            )}
            {!isCancelBooking && (
              <div className="purchase-summary-subtitle">
                <p>
                  {viewState.toLowerCase() === "review"
                    ? config.reviewBookingSubTitle
                    : config.purchaseBookingSubTitle}
                </p>
              </div>
            )}
            <div className="purchase-summary-title">
              <h2>
                {isCancelBooking
                  ? config.cancelOrderTitle
                  : viewState.toLowerCase() === "review"
                  ? config.reviewBookingTitle
                  : config.purchaseBookingTitle}
              </h2>
            </div>
            {viewState.toLowerCase() !== "review" && (
              <Banner
                bannerBgImg={
                  optedBikeVariant?.bgImg || config.purchaseBookingBannerImg
                }
                bikeName={productData?.name}
                onItsWayText={config?.bikeInfoSubText}
                userName={userProfileProps?.fname}
                bannerBikeImg={
                  optedBikeVariant?.bikeImg || config?.genericConfig?.bikeImg
                }
                optedBikeVariant={optedBikeVariant}
              />
            )}
            {viewState.toLowerCase() === "review" && (
              <div className="change-variant-container">
                <p className="change-variant-text">
                  {config?.changeModalVariantText}
                </p>
                <div className="change-variant-edit-icon">
                  <img
                    src={`${appUtils.getConfig(
                      "resourcePath"
                    )}images/svg/edit-black-icon.svg`}
                    alt="edit-icon"
                    onClick={changeVariantHandler}
                  />
                </div>
              </div>
            )}
            {viewState.toLowerCase() === "review" && (
              <div className="disclaimer-text-container">
                <div className="disclaimer-header-text">
                  <div className="disclaimer-image-wrapper">
                    <img
                      src={`${appUtils.getConfig(
                        "resourcePath"
                      )}images/svg/disclaimer-icon.svg`}
                      alt="edit-icon"
                    />
                  </div>
                  <p>{config?.disclaimerHelperHeader}</p>
                </div>
                <p className="disclaimer-content-text">
                  {config?.disclaimerHelperText}
                </p>
              </div>
            )}

            {!isCancelBooking && (
              <div className="delivery-info-card">
                <p>
                  {config.purchaseBookingDeliveryDateText + " "}
                  <span className="delivery-date">{purchaseDate}</span>
                </p>
              </div>
            )}
            {!isCancelBooking && (
              <>
                {!amountData?.insurance?.applied && (
                  // <div
                  //   className="insurance-info-card"
                  //   onClick={handleAddInsuranceClick}
                  // >
                  //   <p>
                  //     Please add <a>Insurance</a> in order to continue{" "}
                  //   </p>
                  // </div>
                  <div className="disclaimer-text-container">
                    <div className="disclaimer-header-text">
                      <div className="disclaimer-image-wrapper">
                        <img
                          src={`${appUtils.getConfig(
                            "resourcePath"
                          )}images/svg/disclaimer-icon.svg`}
                          alt="edit-icon"
                        />
                      </div>
                      <p>{config?.disclaimerHelperHeader}</p>
                    </div>
                    <p className="disclaimer-content-text">
                      {config?.insuranceDisclaimerText}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <div className="vida-purchase-summary__right-container">
          <SummaryDetails
            config={config}
            changeScreen={changeScreen}
            amountData={amountData}
            paymentDetails={paymentDetails}
            totalAmount={totalAmount}
            totalGSTAmount={totalGSTAmount}
            viewState={viewState}
            priceBreakUp={priceBreakUp}
            dealerName={dealerName}
            productData={productData}
            updateFame={updateFame}
            fameApplied={fameApplied}
            showOfferPopup={setShowOffersPopup}
          ></SummaryDetails>
        </div>
        {!isDesktop &&
          orderDetails?.orderType?.toLowerCase() !== "quick purchase" && (
            <div className="vida-purchase-cancel-button">
              <Button
                className={"purchase-booking-cancel-btn"}
                variant={BUTTON_TYPES.SECONDARY}
                label={
                  viewState === PURCHASE_STATE.REVIEW
                    ? reviewState?.cancelButton?.label
                    : initialState?.cancelButton?.label
                }
                onClick={handleCancelOrder}
              />
            </div>
          )}
      </div>
      {viewState.toLowerCase() !== "review" && (
        <CustomBottomDrawer
          viewState={viewState}
          isOpen={isOpened}
          isShowCancelButton={
            orderDetails?.orderType?.toLowerCase() === "quick purchase"
              ? false
              : true
          }
          toggleDrawer={handleToggleDrawer}
          cancelProps={{
            drawerTitle: cancelState.drawerTitle,
            cancelButton: {
              openInNewTab: cancelState?.cancelButton?.cancelNewTab,
              label: cancelState?.cancelButton?.label,
              url: cancelState?.cancelButton?.url,
              onClick: handleKeepOrdering
            },
            confirmButton: {
              openInNewTab: cancelState?.confirmButton?.cancelNewTab,
              label: cancelState?.confirmButton?.label,
              url: cancelState?.confirmButton?.url,
              onClick: handleConfirmCancel
            }
          }}
          reviewProps={{
            termsAndConditionsLabel: "",
            confirmButton: {
              label: "",
              secondaryLabel: "",
              disabled: "",
              onClick: (e) => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                proceed(e);
              }
            },
            cancelButton: {
              label: "",
              onClick: handleCancelOrder
            },
            handleAddInsuranceClick: handleAddInsuranceClick,
            addInsuranceLabel: "",
            paymentLabel: "",
            paymentAmount: "",
            isTncChecked: "",
            handleTncChange: handleTncChange
          }}
          initialProps={{
            termsAndConditionsLabel: initialState?.termsAndConditionsLabel,
            confirmButton: {
              label: initialState?.confirmButton?.label,
              secondaryLabel: initialState?.confirmButton?.secondaryLabel,
              disabled: !amountData?.insurance?.applied,
              onClick: (e) => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                proceedToReview(e);
              }
            },
            cancelButton: {
              label: initialState?.cancelButton?.label,
              onClick: handleCancelOrder
            },
            handleAddInsuranceClick: handleAddInsuranceClick,
            addInsuranceLabel: initialState?.addInsuranceLabel,
            paymentLabel: initialState?.paymentLabel,
            paymentAmount: totalAmount,
            isTncChecked: isTnCAccepted,
            handleTncChange: handleTncChange
          }}
          errorMessage={errorMessage}
          isInsuranceApplied={amountData?.insurance?.applied ? true : false}
        />
      )}
      {viewState.toLowerCase() === "review" && (
        <CustomBottomDrawer
          viewState={viewState}
          isOpen={isOpened}
          isShowCancelButton={
            orderDetails?.orderType?.toLowerCase() === "quick purchase"
              ? false
              : true
          }
          toggleDrawer={handleToggleDrawer}
          cancelProps={{
            drawerTitle: cancelState.drawerTitle,
            cancelButton: {
              openInNewTab: cancelState?.cancelButton?.cancelNewTab,
              label: cancelState?.cancelButton?.label,
              url: cancelState?.cancelButton?.url,
              onClick: handleKeepOrdering
            },
            confirmButton: {
              openInNewTab: cancelState?.confirmButton?.cancelNewTab,
              label: cancelState?.confirmButton?.label,
              url: cancelState?.confirmButton?.url,
              onClick: handleConfirmCancel
            }
          }}
          reviewProps={{
            termsAndConditionsLabel: reviewState?.termsAndConditionsLabel,
            confirmButton: {
              label: reviewState?.confirmButton?.label,
              secondaryLabel: reviewState?.confirmButton?.secondaryLabel,
              disabled: !amountData?.insurance?.applied,
              onClick: (e) => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                proceed(e);
              }
            },
            cancelButton: {
              label: reviewState?.cancelButton?.label,
              onClick: handleCancelOrder
            },
            handleAddInsuranceClick: handleAddInsuranceClick,
            addInsuranceLabel: reviewState?.addInsuranceLabel,
            paymentLabel: reviewState?.paymentLabel,
            paymentAmount: totalAmount,
            isTncChecked: isTnCAccepted,
            handleTncChange: handleTncChange
          }}
          initialProps={{
            termsAndConditionsLabel: initialState?.termsAndConditionsLabel,
            confirmButton: {
              label: initialState?.confirmButton?.label,
              secondaryLabel: initialState?.confirmButton?.secondaryLabel,
              disabled: !amountData?.insurance?.applied,
              onClick: (e) => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                proceedToReview(e);
              }
            },
            cancelButton: {
              label: initialState?.cancelButton?.label,
              onClick: handleCancelOrder
            },
            handleAddInsuranceClick: handleAddInsuranceClick,
            addInsuranceLabel: initialState?.addInsuranceLabel,
            paymentLabel: initialState?.paymentLabel,
            paymentAmount: totalAmount,
            isTncChecked: isTnCAccepted,
            handleTncChange: handleTncChange
          }}
          errorMessage={errorMessage}
          isInsuranceApplied={amountData?.insurance?.applied ? true : false}
        />
      )}
      {openSelectVariantPopup && (
        <div className="select-variant-popup">
          <div className="select-variant-popup-content">
            <div className="select-variant-container">
              <div className="scooter__info">
                <p className="scooter__header">
                  {config?.scooterInfo?.variantHeaderLabel}
                </p>
                <div className="variant-disclaimer-text-container">
                  <div className="disclaimer-header-text">
                    <div className="disclaimer-image-wrapper">
                      <img
                        src={`${appUtils.getConfig(
                          "resourcePath"
                        )}images/svg/disclaimer-icon.svg`}
                        alt="edit-icon"
                      />
                    </div>
                    <p>{config?.disclaimerHelperHeader}</p>
                  </div>
                  <p className="disclaimer-content-text">
                    {config?.variantDisclaimerText}
                  </p>
                </div>

                <p className="scooter__sub-header">
                  {config?.scooterInfo?.selectVidaLabel}
                </p>
                <div className="scooter__variant-buttons">
                  {scooterData?.products?.items.map((product, index) => (
                    <button
                      className={`scooter__type-text ${
                        product?.name?.toLowerCase() ===
                        variantActiveIndex?.toLowerCase()
                          ? "scooter__selected"
                          : "scooter__not-selected"
                      }`}
                      key={index}
                      onClick={(e) => {
                        handleVariantClick(product, index);
                      }}
                    >
                      {product.name}
                    </button>
                  ))}
                </div>
                <p className="scooter__color-label">
                  {config?.scooterInfo?.chooseColorLabel}
                </p>
                <div className="scooter__color-container">
                  {variantList?.map((item, index) => (
                    <div
                      key={index}
                      className={`${
                        activeVariant === index ? "scooter__colors-outline" : ""
                      }`}
                      style={{
                        borderColor:
                          item?.attributes[0]?.label === "White"
                            ? "black"
                            : getProductColor[item?.attributes[0]?.label]
                      }}
                    >
                      <button
                        className={`scooter__colors ${
                          activeVariant === index
                            ? "scooter__colors-selected"
                            : ""
                        } ${
                          item?.attributes[0]?.label == "White" &&
                          activeVariant !== index
                            ? "scooter__black-border"
                            : "none"
                        }`}
                        key={index}
                        style={{
                          background: `${
                            getProductColor[item?.attributes[0]?.label]
                          }`
                        }}
                        onClick={(e) => {
                          variantChange(e, item, index);
                        }}
                        onKeyPress={(e) => {
                          if (e.which === 13) {
                            variantChange(e, item, index);
                          }
                        }}
                      ></button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="variant-color-selection-actions">
                <button
                  className="variant-selection__cancel"
                  onClick={(e) => cancelChangeVariant(e)}
                >
                  {config?.cancelButtonText}
                </button>
                <button
                  className="variant-selection__confirm"
                  onClick={(e) => confirmChangeVariant(e)}
                >
                  {config?.confirmButtonText}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showOfferPopup && (
        <div className="offer-details-popup">
          <div className="offer-details-popup-content">
            <p className="offers-details-header">
              {config?.discountOffersHeader}
            </p>
            <div className="offer-discount-item-container">
              {discountData?.map((item, index) => {
                const dateEffectiveTill = item.dateEffectiveTill__c
                  ? new Date(item.dateEffectiveTill__c).setHours(0, 0, 0, 0)
                  : null;
                return item.discount_name !== "None" ? (
                  dateEffectiveTill && dateEffectiveTill >= currentDate ? (
                    <div className="offer-discount-item" key={index}>
                      <div className="discount-details">
                        <p className="discount-offer-name">
                          {item.discount_name === "None"
                            ? "No Offers will be applied"
                            : config?.discountDescription +
                              " " +
                              item.net_benefit_tocustomer}
                        </p>
                        <p className="discount-offer-subtitle">
                          {item.discount_name === "None"
                            ? "None"
                            : item.discount_name}
                        </p>
                      </div>
                      <div className="discount-input">
                        <input
                          type="radio"
                          name="discount-input"
                          className="discount-input-checkbox"
                          value={item.discount_name}
                          onClick={(e) => handleCheckboxSelect(e)}
                          checked={item.discount_name === selectedDiscount}
                        />
                      </div>
                    </div>
                  ) : null
                ) : (
                  <div className="offer-discount-item" key={index}>
                    <div className="discount-details">
                      <p className="discount-offer-name">
                        {item.discount_name === "None"
                          ? "No Offers will be applied"
                          : config?.discountDescription +
                            " " +
                            item.net_benefit_tocustomer}
                      </p>
                      <p className="discount-offer-subtitle">
                        {item.discount_name === "None"
                          ? "None"
                          : item.discount_name}
                      </p>
                    </div>
                    <div className="discount-input">
                      <input
                        type="radio"
                        name="discount-input"
                        className="discount-input-checkbox"
                        value={item.discount_name}
                        onClick={(e) => handleCheckboxSelect(e)}
                        checked={item.discount_name === selectedDiscount}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="variant-disclaimer-text-container">
              <p className="disclaimer-content-text">
                {`* ${config?.offerGSTInclusiveText}`}
              </p>
            </div>
            <div className="offer-details-action-container">
              <button
                className="offer-details__cancel"
                onClick={(e) => handleCancelOffer(e)}
              >
                {config?.cancelButtonText}
              </button>
              <button
                className="offer-details__confirm"
                onClick={(e) => handleConfirmOffer(e)}
              >
                {config?.confirmButtonText}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const mapStateToProps = ({ userProfileDataReducer, purchaseConfigReducer }) => {
  return {
    userProfileProps: {
      fname: userProfileDataReducer.fname,
      lname: userProfileDataReducer.lname
    },
    offers: purchaseConfigReducer.offers
  };
};

PurchaseSummary.propTypes = {
  config: PropTypes.object,
  changeScreen: PropTypes.func,
  productData: PropTypes.object,
  orderDetails: PropTypes.object,
  amountData: PropTypes.object,
  proceed: PropTypes.func,
  paymentDetails: PropTypes.object,
  totalAmount: PropTypes.number,
  totalGSTAmount: PropTypes.number,
  priceBreakUp: PropTypes.arrayOf(PropTypes.object),
  dealerName: PropTypes.string,
  userProfileProps: PropTypes.object,
  updateFame: PropTypes.func,
  fameApplied: PropTypes.bool,
  productId: PropTypes.string,
  optedBikeVariant: PropTypes.object,
  offers: PropTypes.object,
  handleOffers: PropTypes.func,
  backFromAddress: PropTypes.bool
};

export default connect(mapStateToProps)(PurchaseSummary);
