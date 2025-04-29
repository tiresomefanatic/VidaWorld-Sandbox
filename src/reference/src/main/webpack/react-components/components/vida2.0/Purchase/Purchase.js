import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import PurchaseSummary from "./PurchaseSummary/PurchaseSummary";
import FameSubsidyWrapper from "./FameSubsidyWrapper/FameSubsidyWrapper";
import Insurance from "./Insurance/Insurance";
import BillingShippingAddress from "./BillingShippingAddress/BillingShippingAddress";
import { connect } from "react-redux";
import {
  setGstDataAction,
  setOrderDataAction,
  setSelectedPolicyDataDispatcher,
  setResetSelectedPolicyDataDispatcher,
  setAadharDataDispatcher
} from "../../../store/purchaseConfig/purchaseConfigActions";
import { useOptimizedGetOrderData } from "../../../hooks/purchaseConfig/purchaseConfigHooks";
import { useGetMyScooterDetails } from "../../../hooks/myScooter/myScooterHooks";
import useScreen from "../../../hooks/utilities/useScreen";
import { cryptoUtils } from "../../../../site/scripts/utils/encryptDecryptUtils";
import appUtils from "../../../../site/scripts/utils/appUtils";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";
import { useUserData } from "../../../hooks/userProfile/userProfileHooks";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import { SCREENS } from "./Constants";
import { getVidaCentreByBranchID } from "../../../../services/location.service";
import { setPreBookingUserDataDispatcher } from "../../../store/preBooking/preBookingActions";
import { useGetAllProducts } from "../../../../react-components/hooks/preBooking/preBookingHooks";
import Logger from "../../../../services/logger.service";
import { getBikeDetailsByColor } from "../../../services/commonServices/commonServices";

const Purchase = ({
  config,
  address,
  updateGSTData,
  gst,
  aadhar,
  setOrderDetails,
  productData,
  orderData,
  payment,
  myScooter,
  userLocation,
  productId,
  insurance,
  subscriptionPlan,
  dealerName,
  offers
}) => {
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();

  // hooks
  const opSalesOrderDetails = useOptimizedGetOrderData();
  const getUserData = useUserData();
  const getScooterData = useGetMyScooterDetails();
  const { isDesktop } = useScreen();
  const [totalAmount, setTotalAmount] = useState();
  const [totalGSTAmount, setTotalGSTAmount] = useState();
  const getAllProductData = useGetAllProducts();
  const [activeBikeVariant, setactiveBikeVariant] = useState({});
  const [allProductsData, setAllProductData] = useState();

  // state
  const [amountData, setAmountData] = useState({
    subsidy: {
      applied: false,
      value: 0,
      description: "",
      eligibleAmount: 0
    },
    insurance: {
      applied: false,
      value: 0,
      description: "",
      insuranceGst: 0
    },
    accessories: {
      applied: false,
      value: 0,
      description: ""
    },
    subscriptions: {
      applied: false,
      value: 0,
      description: ""
    },
    gst: {
      applied: false,
      value: 0,
      description: ""
    },
    configuration: {
      applied: false,
      value: 0,
      description: ""
    },
    otherCharge: {
      applied: false,
      value: 0,
      description: ""
    },
    addOns: {
      applied: false,
      value: 0,
      description: ""
    },
    preBooking: {
      applied: false,
      value: 0,
      description: ""
    },
    exchange: {
      applied: false,
      value: 0,
      description: ""
    },
    offer: {
      applied: false,
      value: 0,
      description: ""
    }
  });
  const [showScreen, setScreen] = useState(SCREENS.PURCHASE_SUMMARY);
  const [priceBreakUp, setPriceBreakUp] = useState([]);
  const [discountData, setDiscountData] = useState([]);
  //we need this
  // const [optedOwnInsurance, setOptedOwnInsurance] = useState();
  const [showBillingPage, setShowBillingPage] = useState(false);
  const [fameApplied, setFameApplied] = useState();

  const queryString = window?.location?.href?.split("?")[1];
  const decryptedParams = queryString && cryptoUtils.decrypt(queryString);
  const params = new URLSearchParams("?" + decryptedParams);
  const profileUrl = appUtils.getPageUrl("profileUrl");
  const documentUploadUrl = appUtils.getPageUrl("vidaDocumentUploadUrl");
  const [isBackFromAddress, setBackFromAddress] = useState(false);

  const containerBottomSpace = window.innerHeight > 1000 ? "10rem" : "20rem";
  const [previousOfferPrice, setPreviousOfferPrice] = useState(
    parseFloat(offers?.offerPrice)
  );
  const changeScreen = (screenName) => {
    if (screenName === "INSURANCE") {
      window.scrollTo(0, 0);
    }
    setScreen(screenName);
  };
  const handleColorChange = async (color, optedVariant = variant) => {
    const globalVarName = optedVariant.replace(" ", "").toLowerCase();
    // const bikeVariantDetail = JSON.parse(config?.bikeVariantDetails || "{}");
    const bikeVariantDetail =
      typeof config?.bikeVariantDetails == "string"
        ? JSON.parse(config?.bikeVariantDetails || "{}")
        : config?.bikeVariantDetails;
    // const bikeVariantDetail = config.bikeVariantDetails || "{}";
    const bikeVariants = bikeVariantDetail?.bikeVariants;

    // Find the variant object with matching variantName
    const matchingVariant = bikeVariants.find(
      (variant) =>
        variant.variantName.replace(" ", "").toLowerCase() === globalVarName
    );

    const bikeVariant = matchingVariant.variantDetails
      ? matchingVariant.variantDetails
      : [];
    const selectedBikeVariant = await getBikeDetailsByColor(color, bikeVariant);
    //will be removed later
    console.log(
      "Adding for logs - selected scooter color",
      selectedBikeVariant
    );
    setactiveBikeVariant(selectedBikeVariant);
    setSpinnerActionDispatcher(false);
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

  // fame subsisdy data handler
  const handleSubmitGstDetails = (data) => {
    updateGSTData(data);
  };

  const proceedToAddress = (e) => {
    const event = { ...e };
    event.target.innerText = event.target.innerText.split("\n")[0];
    ctaTracking(event, "confirmCTAClick", "Review Screen");
    setShowBillingPage(true);
  };
  const getScooterColor = async () => {
    const selectedSku = allProductsData?.data?.products?.items?.filter(
      (item) => item?.sf_id === productId
    );
    if (selectedSku?.length > 0) {
      const variant = selectedSku[0]?.name;
      const variantsku = selectedSku[0]?.variants?.filter(
        (sku) => sku?.product?.sku == productData?.variantSku
      );
      const color = variantsku[0].product.vaahan_color;
      handleColorChange(color, variant);
    }
  };
  const getAllProductsData = async () => {
    try {
      setSpinnerActionDispatcher(true);
      const allProductsData = await getAllProductData({
        variables: {
          category_id: 2
        }
      });
      if (allProductsData) {
        // setSpinnerActionDispatcher(true);
        setAllProductData(allProductsData);
        // getScooterColor();
      }
    } catch (error) {
      Logger.error(error.message);
    }
  };

  useEffect(() => {
    getAllProductsData();
  }, []);

  useEffect(() => {
    setSpinnerActionDispatcher(true);
    setTimeout(() => {
      if (allProductsData) {
        getScooterColor();
      }
    }, 2000);
  }, [productData, allProductsData]);

  const getBranchDetails = async (dealerId) => {
    const selectedDealer = await getVidaCentreByBranchID(dealerId);
    if (selectedDealer[0].branchId !== "") {
      const dealerData = {
        pincode: selectedDealer[0]?.postalCode,
        branchId: selectedDealer[0]?.branchId,
        partnerId: selectedDealer[0]?.accountpartnerId,
        state: selectedDealer[0]?.state,
        city: selectedDealer[0]?.city,
        dealerName: selectedDealer[0]?.experienceCenterName,
        dealerPhoneNumber: selectedDealer[0]?.phonenumber,
        dealerAddress: selectedDealer[0]?.address,
        type: selectedDealer[0]?.type,
        latitude: selectedDealer[0]?.latitude,
        longitude: selectedDealer[0]?.longitude
      };
      setPreBookingUserDataDispatcher(dealerData);
    }
    setSpinnerActionDispatcher(false);
  };

  // getting order details in the start
  useEffect(() => {
    if (queryString) {
      if (params && params.get("orderId") && params.get("opportunityId")) {
        setSpinnerActionDispatcher(true);
        opSalesOrderDetails({
          variables: {
            order_id: params.get("orderId"),
            opportunity_id: params.get("opportunityId")
          }
        }).then((res) => {
          setSpinnerActionDispatcher(true);
          if (!res.data.OpGetSaleOrderDetails.allowEdit) {
            window.location.href = profileUrl;
          } else {
            setSpinnerActionDispatcher(false);
          }
          setPriceBreakUp(res.data.OpGetSaleOrderDetails.sale_order_line);
          setDiscountData(res.data.OpGetSaleOrderDetails.discount_data);
          setOrderDetails(res.data.OpGetSaleOrderDetails);
          setSpinnerActionDispatcher(true);
          getBranchDetails(res.data.OpGetSaleOrderDetails.branch_id);
        });
        getScooterData();
      } else {
        window.location.href = profileUrl;
      }
    } else {
      window.location.href = profileUrl;
    }
    getUserData();
  }, []);

  //Added the Purchase start event on Click of Purchase in Orders page. so removing it here

  // component did update
  // useEffect(() => {
  //   if (isAnalyticsEnabled) {
  //     const productDetails = {
  //       modelVariant: productData.name,
  //       modelColor: productData.color,
  //       productID: productId
  //     };
  //     const configuratorDetails = {
  //       accessorizeName: ""
  //     };
  //     if (productData.name) {
  //       configuratorDetails.accessorizeName = myScooter.configuredAccessories
  //         .length
  //         ? myScooter.configuredAccessories.toString().split(",").join("|")
  //         : "";
  //       analyticsUtils.trackBookingStart(
  //         productDetails,
  //         userLocation,
  //         configuratorDetails
  //       );
  //     }
  //   }
  // }, [payment.basePrice]);

  useEffect(() => {
    const apiData = {
      subsidy: {
        applied: aadhar.govtSubsidyAmount > 0 ? true : false,
        value: aadhar.govtSubsidyAmount === 0 ? 0 : aadhar.govtSubsidyAmount,
        description:
          aadhar.govtSubsidyAmount > 0
            ? "Subsidy applied"
            : "Apply for Subsidy",
        eligibleAmount: aadhar.govtSubsidyEligibleAmount
      },
      insurance: {
        applied: insurance?.insuranceAmount > 0 ? true : false,
        value:
          insurance?.insuranceBasePrice > 0 ? insurance?.insuranceBasePrice : 0,
        description:
          insurance?.insuranceAmount > 0 ? insurance.insurerName : "",
        insuranceGst:
          insurance?.insuranceGstAmount > 0 ? insurance?.insuranceGstAmount : 0
      },
      accessories: {
        applied: false,
        value: 0,
        description: ""
      },
      subscriptions: {
        applied: subscriptionPlan?.package_id ? true : false,
        value: subscriptionPlan?.package_id
          ? parseFloat(subscriptionPlan?.price)
          : 0,
        description: subscriptionPlan?.package_id ? subscriptionPlan?.name : ""
      },
      gst: {
        applied: gst?.gstSelected ? true : false,
        value: gst?.gstSelected ? payment.gstAmount : 0,
        description: ""
      },
      configuration: {
        applied: payment?.configurePrice > 0 ? true : false,
        value: payment?.configurePrice,
        description: ""
      },
      otherCharge: {
        applied: payment.otherCharges > 0 ? true : false,
        value: payment.otherCharges,
        description: ""
      },
      addOns: {
        applied: payment?.addonsPrice ? true : false,
        value: payment?.addonsPrice,
        description: ""
      },
      preBooking: {
        applied: true,
        value: -1 * payment?.prebookingPricePaid,
        description: ""
      },
      exchange: {
        applied: false,
        value: 0,
        description: ""
      },
      offers: {
        applied: offers?.offerPrice > 0 ? true : false,
        value: offers?.offerPrice === 0 ? 0 : offers?.offerPrice,
        description: ""
      }
    };
    setAmountData(apiData);
  }, [payment, gst, subscriptionPlan, offers]);

  useEffect(() => {
    setTotalAmount(payment?.updatedOrderGrandTotal);
  }, [payment?.updatedOrderGrandTotal]);

  useEffect(() => {
    if (payment.updatedOrderTax > 0) {
      setTotalGSTAmount(payment.updatedOrderTax);
    } else {
      setTotalGSTAmount(payment.gstAmount);
    }
  }, [payment.updatedOrderTax, payment.gstAmount]);

  const getTotalPrice = (amountData, paymentDetails) => {
    return paymentDetails?.updatedOrderGrandTotal;
  };
  //handle fame
  useEffect(() => {
    const data = { ...amountData };
    if (fameApplied) {
      data.subsidy = {
        applied: true,
        value: amountData.subsidy.eligibleAmount,
        description: "Subsidy Applied",
        eligibleAmount: amountData.subsidy.eligibleAmount
      };

      const aadharData = {
        aadharSelected: true, // getting "0" in GetSalesOrderDetails response
        aadharNumber: "",
        aadharUsedForRegister: false,
        fameSubsidyEligibleAmount: 0,
        fameSubsidyAmount: 0,
        empsSubsidyEligibleAmount: 0,
        empsSubsidyAmount: 0,
        govtSubsidyEligibleAmount: amountData.subsidy.eligibleAmount,
        govtSubsidyAmount: amountData.subsidy.eligibleAmount
      };
      const discountedPrice =
        totalAmount - parseFloat(amountData.subsidy.eligibleAmount);
      setTotalAmount(discountedPrice);
      setAadharDataDispatcher(aadharData);
    } else if (fameApplied === false) {
      data.subsidy = {
        applied: false,
        value: 0,
        description: "Apply for Subsidy",
        eligibleAmount: amountData.subsidy.eligibleAmount
      };
      const aadharData = {
        aadharSelected: false, // getting "0" in GetSalesOrderDetails response
        aadharNumber: "",
        aadharUsedForRegister: false,
        fameSubsidyEligibleAmount: 0,
        fameSubsidyAmount: 0,
        empsSubsidyEligibleAmount: 0,
        empsSubsidyAmount: 0,
        govtSubsidyAmount: 0,
        govtSubsidyEligibleAmount: amountData.subsidy.eligibleAmount
      };
      if (totalAmount && aadhar.govtSubsidyAmount !== 0) {
        const discountedPrice =
          totalAmount + parseFloat(amountData.subsidy.eligibleAmount);
        setTotalAmount(discountedPrice);
      }
      setAadharDataDispatcher(aadharData);
    }
    setAmountData({ ...data });
  }, [fameApplied]);

  // handle selection for own insurance
  const handleSubmitOwnInsurance = (e) => {
    ctaTracking(e, "confirmCTAClick", "Submit Own Insurance");
    const data = { ...amountData };
    // setOptedOwnInsurance(true);
    data.insurance = {
      applied: true,
      value: 0,
      description: "Opted for own insurance",
      insuranceGst: 0
    };
    setAmountData({ ...data });
    if (insurance.insuranceAmount) {
      setTotalAmount(totalAmount - insurance.insuranceAmount);
      setTotalGSTAmount(totalGSTAmount - insurance.insuranceGstAmount);
    }
    setResetSelectedPolicyDataDispatcher();
    setScreen(SCREENS.PURCHASE_SUMMARY);
  };

  // handle buying insurance
  const handleSubmitBuyInsurance = (
    insuranceData,
    insuranceAddons,
    insuranceTotalAmount,
    e
  ) => {
    ctaTracking(e, "confirmCTAClick", "Buy Insurance");
    const data = { ...amountData };
    data.insurance = {
      applied: true,
      value:
        parseFloat(insuranceTotalAmount) -
        parseFloat(insuranceData?.gst_cal_amount),
      insuranceGst: parseFloat(insuranceData?.gst_cal_amount),
      description: insuranceData?.name || ""
    };
    insuranceData.premium = `${
      parseFloat(insuranceTotalAmount) -
      parseFloat(insuranceData?.gst_cal_amount)
    }`;
    setAmountData({ ...data });
    const validAddons = insuranceAddons.map((item) => ({
      ...item,
      selected: true
    }));

    const selectedInsuranceData = { ...insuranceData, validAddons };
    setSelectedPolicyDataDispatcher(selectedInsuranceData);
    const addedInsuranceAmount = insurance.insuranceAmount;
    setTotalAmount(totalAmount - addedInsuranceAmount + insuranceTotalAmount);
    setTotalGSTAmount(
      totalGSTAmount -
        insurance.insuranceGstAmount +
        parseFloat(insuranceData?.gst_cal_amount)
    );
    setScreen(SCREENS.PURCHASE_SUMMARY);
  };

  const handleOffersPrice = (previousOffer, newOffer) => {
    let appliedValue = 0;
    discountData?.map((item) => (appliedValue += item.discount_amount));
    const data = { ...amountData };
    // setOptedOwnInsurance(true);
    data.offer = {
      applied: newOffer.offerPrice > 0 ? true : false,
      value: newOffer.offerPrice,
      description: ""
    };
    setAmountData({ ...data });
    let orderTotal = totalAmount + parseInt(previousOffer.offerTotal);
    orderTotal -= newOffer.offerTotal;
    let gstDiscount = totalGSTAmount + parseInt(previousOffer.offersGST);
    gstDiscount -= newOffer.offersGST;
    setPreviousOfferPrice(newOffer.offerPrice);
    setTotalAmount(orderTotal);
    setTotalGSTAmount(gstDiscount);
  };

  // encrypting document-upload params
  const documentUploadparams = [
    "orderId=",
    orderData?.orderId,
    "&opportunityId=",
    orderData?.opportunityId
  ].join("");
  const encryptedParams = cryptoUtils.encrypt(documentUploadparams);

  //redirect to document-upload page
  const handleDocumentUploadRedirection = () => {
    if (documentUploadUrl && encryptedParams) {
      window.location.href = documentUploadUrl + "?" + encryptedParams;
    }
  };

  useEffect(() => {
    if (aadhar.aadharSelected && aadhar.aadharSelected !== fameApplied) {
      setFameApplied(aadhar.aadharSelected);
    }
  }, [aadhar.aadharSelected]);

  const handleBackAddress = () => {
    setShowBillingPage(false);
    setBackFromAddress(true);
  };

  return (
    <div className="vida-purchase-container">
      <img
        className="purchase-booking-bg-img"
        src={
          isDesktop
            ? config.purchaseBookingBgDesktop
            : config.purchaseBookingBgMobile
        }
        alt="cancel_booking_bg"
      ></img>
      <div
        className="vida-purchase"
        style={{ marginBottom: containerBottomSpace }}
      >
        {!showBillingPage && showScreen === SCREENS.PURCHASE_SUMMARY && (
          <PurchaseSummary
            config={config}
            changeScreen={changeScreen}
            amountData={amountData}
            proceed={proceedToAddress}
            paymentDetails={payment}
            totalAmount={totalAmount}
            totalGSTAmount={totalGSTAmount}
            priceBreakUp={priceBreakUp}
            dealerName={dealerName}
            productData={productData}
            orderDetails={orderData}
            updateFame={setFameApplied}
            fameApplied={fameApplied}
            productId={productId}
            optedBikeVariant={activeBikeVariant}
            handleOffers={handleOffersPrice}
            backFromAddress={isBackFromAddress}
          />
        )}
        {!showBillingPage && showScreen === SCREENS.SUBSIDY && (
          <FameSubsidyWrapper
            config={config}
            submitFameSubsidyDetails={handleSubmitGstDetails}
            subsidyDetails={{
              ...aadhar,
              ...address.billingAddresses,
              orderId: params.get("orderId")
            }}
            backToSummaryPage={(isSubsidyApplied, value) => {
              setScreen(SCREENS.PURCHASE_SUMMARY);
              setAmountData({
                ...amountData,
                subsidy: { applied: isSubsidyApplied, value: -1 * value }
              });
            }}
          />
        )}
        {!showBillingPage && showScreen === SCREENS.INSURANCE && (
          <Insurance
            config={config?.insurance}
            opportunityId={params.get("opportunityId")}
            orderId={params.get("orderId")}
            sku={productData?.sku || ""}
            variantSku={productData?.variantSku || ""}
            handleSubmitOwnInsurance={handleSubmitOwnInsurance}
            handleSubmitBuyInsurance={handleSubmitBuyInsurance}
            optedBikeVariant={activeBikeVariant}
          />
        )}
        {showBillingPage && (
          <BillingShippingAddress
            config={config?.billingAndShipping}
            paymentDetailsConfig={config?.paymentDetailsConfig}
            orderDetails={orderData}
            optedBikeVariant={activeBikeVariant}
            handleBackAddress={handleBackAddress}
          />
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const {
    purchaseConfigReducer,
    myScooterReducer,
    userProfileDataReducer,
    preBookingReducer
  } = state;
  return {
    address: {
      billingAddresses: purchaseConfigReducer?.billingAddresses,
      shippingAddresses: purchaseConfigReducer?.shippingAddresses
    },
    gst: purchaseConfigReducer?.gst,
    aadhar: purchaseConfigReducer?.aadhar,
    offers: purchaseConfigReducer?.offers,
    productData: purchaseConfigReducer.productData,
    orderData: purchaseConfigReducer.order,
    productId: purchaseConfigReducer.productId,
    payment: purchaseConfigReducer.payment,
    insurance: purchaseConfigReducer.insurance,
    subscriptionPlan: purchaseConfigReducer.subscriptionPlan,
    myScooter: {
      configuredAccessories: myScooterReducer.configuredAccessories
    },
    userLocation: {
      pincode: userProfileDataReducer.pincode,
      city: userProfileDataReducer.city,
      state: userProfileDataReducer.state,
      country: userProfileDataReducer.country
    },
    dealerName: preBookingReducer.dealerName
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateGSTData: (data) => {
      dispatch(setGstDataAction(data));
    },
    setOrderDetails: (data) => {
      dispatch(setOrderDataAction(data));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Purchase);

Purchase.propTypes = {
  config: PropTypes.object,
  address: PropTypes.object,
  gst: PropTypes.object,
  aadhar: PropTypes.object,
  updateGSTData: PropTypes.func,
  setOrderDetails: PropTypes.func,
  productData: PropTypes.object,
  orderData: PropTypes.object,
  payment: PropTypes.object,
  myScooter: PropTypes.object,
  userLocation: PropTypes.object,
  tradeIn: PropTypes.object,
  productId: PropTypes.string,
  insurance: PropTypes.object,
  subscriptionPlan: PropTypes.object,
  dealerName: PropTypes.string,
  offers: PropTypes.object
};
