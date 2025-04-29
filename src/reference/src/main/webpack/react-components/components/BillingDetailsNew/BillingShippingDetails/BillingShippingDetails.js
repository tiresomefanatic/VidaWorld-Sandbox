import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import InputField from "../../form/InputField/InputField";
import Location from "../../../../site/scripts/location";
import appUtils from "../../../../site/scripts/utils/appUtils";
import { connect } from "react-redux";
import Logger from "../../../../services/logger.service";
import { setAddressDataDispatcher } from "../../../store/purchaseConfig/purchaseConfigActions";
import { useUpdateAddressData } from "../../../hooks/purchaseConfig/purchaseConfigHooks";
import { setSpinnerActionDispatcher } from "../../../store/spinner/spinnerActions";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import NumberField from "../../form/NumberField/NumberField";
import CONSTANT from "../../../../site/scripts/constant";

const BillingShippingDetails = (props) => {
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const redirectionUrl = appUtils.getPageUrl("billingPricingUrl");
  const {
    billingDetails,
    cmpProps,
    formId,
    setShowAddressPopup,
    setIsAddressUpdated
  } = props;
  const {
    addressLine1Field,
    addressLine2Field,
    billingAddress,
    shippingAddress,
    landmarkField,
    pinCodeField,
    cityField,
    notificationBanner,
    title,
    stateField
  } = billingDetails;

  const {
    billingAddressDetail,
    shippingAddressDetail,
    serviceablePincodesList,
    saleOrderId,
    productData,
    productId,
    gstDetail
  } = cmpProps;
  const [sameAsBilling, setSameAsBilling] = useState(false);
  const disableField = true;

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    reset,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });

  //Serviceable pincode api call
  const getServiceablePincodeData = async () => {
    const locationObj = new Location();
    const selectedLocationData = {
      country: appUtils.getConfig("defaultCountry"),
      state: billingAddressDetail.state,
      city: billingAddressDetail.city
    };
    try {
      await locationObj.getServiceablePincodesList(selectedLocationData);
    } catch (error) {
      Logger.error(error.message);
    }
  };

  useEffect(() => {
    setSameAsBilling(shippingAddressDetail.sameAsBilling);
  }, [shippingAddressDetail.sameAsBilling]);

  useEffect(() => {
    billingAddressDetail.addressLine1 &&
      setValue("billingAddress1", billingAddressDetail.addressLine1);
    billingAddressDetail.addressLine2 &&
      setValue("billingAddress2", billingAddressDetail.addressLine2);
    billingAddressDetail.addressLandmark &&
      setValue("billingLandmark", billingAddressDetail.addressLandmark);
    billingAddressDetail.pincode &&
      setValue("billingPincode", billingAddressDetail.pincode);
    if (billingAddressDetail.state && billingAddressDetail.city) {
      getServiceablePincodeData();
    }
  }, [billingAddressDetail]);

  useEffect(() => {
    shippingAddressDetail.addressLine1 &&
      setValue("shippingAddress1", shippingAddressDetail.addressLine1);
    shippingAddressDetail.addressLine2 &&
      setValue("shippingAddress2", shippingAddressDetail.addressLine2);
    shippingAddressDetail.addressLandmark &&
      setValue("shippingLandmark", shippingAddressDetail.addressLandmark);
    shippingAddressDetail.pincode &&
      setValue("shippingPincode", shippingAddressDetail.pincode);
    if (shippingAddressDetail.state && shippingAddressDetail.city) {
      getServiceablePincodeData();
    }
  }, [shippingAddressDetail]);
  const updateAddressData = useUpdateAddressData();
  const handleFormSubmit = async (formData, event) => {
    // console.log("serviceablePincodesList", serviceablePincodesList);

    if (
      serviceablePincodesList &&
      serviceablePincodesList.serviceablePincodes &&
      serviceablePincodesList.serviceablePincodes.includes(
        parseInt(formData.shippingPincode.trim())
      )
    ) {
      //Update sales order API call
      setSpinnerActionDispatcher(true);

      if (saleOrderId.orderId) {
        const updateAddressRes = await updateAddressData({
          variables: {
            sale_order_id: saleOrderId.orderId,
            billing_address_line1: formData.billingAddress1 || "",
            billing_address_line2: formData.billingAddress2 || "",
            billing_address_landmark: formData.billingLandmark || "",
            billing_pincode: billingAddressDetail.pincode || "",
            billing_city: billingAddressDetail.city || "",
            billing_state: billingAddressDetail.state || "",
            billing_country: "",
            shipping_address_line1: formData.shippingAddress1 || "",
            shipping_address_line2: formData.shippingAddress2 || "",
            shipping_address_landmark: formData.shippingLandmark || "",
            shipping_pincode: formData.shippingPincode || "",
            shipping_city: shippingAddressDetail.city || "",
            shipping_state: shippingAddressDetail.state || "",
            shipping_country: "",
            same_as_billing: sameAsBilling ? "Y" : "N"
          }
        });
        if (updateAddressRes.data.UpdateSaleOrderAddress.status === "200") {
          if (isAnalyticsEnabled) {
            const customLink = {
              name: event.nativeEvent.submitter.innerText,
              position: "Bottom",
              type: "Button",
              clickType: "other"
            };
            const location = {
              pinCode: billingAddressDetail.pincode,
              city: billingAddressDetail.city,
              state: billingAddressDetail.state,
              country: ""
            };
            const productDetails = {
              modelVariant: productData.name,
              modelColor: productData.color,
              productID: productId
            };
            const additionalPageName = ":Billing & shipping details";
            const additionalJourneyName = "";
            analyticsUtils.trackCustomButtonClick(
              customLink,
              location,
              productDetails,
              additionalPageName,
              additionalJourneyName,
              function () {
                window.location.href = `${redirectionUrl}?${props.queryString}`;
              }
            );
          } else {
            window.location.href = `${redirectionUrl}?${props.queryString}`;
          }
        }
      } else {
        Logger.error("Order ID is missing");
      }
    } else if (
      serviceablePincodesList &&
      serviceablePincodesList.allPincodes &&
      serviceablePincodesList.allPincodes.includes(
        parseInt(formData.shippingPincode.trim())
      )
    ) {
      setError("shippingPincode", {
        type: "custom",
        message: pinCodeField.validationRules.customValidation.noServiceMsg
      });
    } else {
      setError("shippingPincode", {
        type: "custom",
        message: pinCodeField.validationRules.customValidation.noCityMatchMsg
      });
    }
  };

  const handleSameAddressClick = (e) => {
    const values = getValues();
    const AddressData = {
      addressLine1: gstDetail.gstSelected
        ? billingAddressDetail.addressLine1
        : values.billingAddress1,
      addressLine2: gstDetail.gstSelected
        ? billingAddressDetail.addressLine2
        : values.billingAddress2,
      addressLandmark: gstDetail.gstSelected
        ? billingAddressDetail.addressLandmark
        : values.billingLandmark,
      pincode: gstDetail.gstSelected
        ? billingAddressDetail.pincode
        : values.billingPincode || billingAddressDetail.pincode,
      city: gstDetail.gstSelected
        ? billingAddressDetail.city
        : values.billingCity,
      state: gstDetail.gstSelected
        ? billingAddressDetail.state
        : values.billingState
    };
    if (e.target.checked) {
      setSameAsBilling(true);
      setValue("billingAddress1", AddressData.addressLine1);
      setValue("billingAddress2", AddressData.addressLine2);
      setValue("billingLandmark", AddressData.addressLandmark);
      setValue("billingPincode", AddressData.pincode);
      clearErrors("billingAddress1");
      clearErrors("billingAddress2");
      clearErrors("billingLandmark");
      clearErrors("billingPincode");
      setValue("shippingAddress1", AddressData.addressLine1);
      setValue("shippingAddress2", AddressData.addressLine2);
      setValue("shippingLandmark", AddressData.addressLandmark);
      setValue("shippingPincode", AddressData.pincode);
      clearErrors("shippingAddress1");
      clearErrors("shippingAddress2");
      clearErrors("shippingLandmark");
      clearErrors("shippingPincode");
    } else {
      setSameAsBilling(false);
      console.log(getValues());

      setValue("shippingAddress1", "");
      setValue("shippingAddress2", "");
      setValue("shippingLandmark", "");
      setValue("shippingPincode", "");

      // billingAddressDetail.addressLine1 &&
      //   setValue("billingAddress1", billingAddressDetail.addressLine1);
      // billingAddressDetail.addressLine2 &&
      //   setValue("billingAddress2", billingAddressDetail.addressLine2);
      // billingAddressDetail.addressLandmark &&
      //   setValue("billingLandmark", billingAddressDetail.addressLandmark);
      // billingAddressDetail.pincode &&
      //   setValue("billingPincode", billingAddressDetail.pincode);
      console.log(getValues());
    }
  };

  const updateShippingField = (name, value) => {
    if (value.trim() !== "") {
      clearErrors(name);
    }
    if (sameAsBilling) {
      name === "billingAddress1" && setValue("shippingAddress1", value);
      name === "billingAddress2" && setValue("shippingAddress2", value);
      name === "billingLandmark" && setValue("shippingLandmark", value);
    }
  };

  const handleInputFieldChange = (name, value) => {
    if (value.trim() !== "") {
      clearErrors(name);
    }
  };
  const handleShippingDetailsSubmit = (data) => {
    const address = {
      billingAddresses: {
        addressLine1: data.billingAddress1,
        addressLine2: data.billingAddress2,
        addressLandmark: data.billingLandmark,
        pincode: data.billingPincode,
        city: billingAddressDetail.city,
        state: billingAddressDetail.state
      },
      shippingAddresses: {
        addressLine1: data.shippingAddress1,
        addressLine2: data.shippingAddress2,
        addressLandmark: data.shippingLandmark,
        pincode: data.shippingPincode,
        city: billingAddressDetail.city,
        state: billingAddressDetail.state,
        sameAsBilling: data.addressConfirmation
      }
    };
    setAddressDataDispatcher(address);
    setShowAddressPopup(false);
    setIsAddressUpdated(true);
  };
  return (
    billingAddressDetail.pincode && (
      <div className="vida-billing-shipping-details">
        <h1 className="vida-billing-shipping-details__title">{title}</h1>
        <div className="vida-billing-shipping-details__billing">
          <h3 className="vida-billing-shipping-details__title-text">
            {billingAddress.title}
          </h3>
          <p className="vida-billing-shipping-details__rto-text">
            {billingAddress.message}
          </p>
        </div>
        <form
          id={formId}
          className="form vida-billing-shipping-details__form"
          onSubmit={handleSubmit((formData, event) => {
            handleFormSubmit(formData, event);
          })}
        >
          <InputField
            name="billingAddress1"
            label={addressLine1Field.label}
            placeholder={addressLine1Field.placeholder}
            value={billingAddressDetail.addressLine1 || ""}
            validationRules={addressLine1Field.validationRules}
            onChangeHandler={updateShippingField}
            register={register}
            errors={errors}
            isDisabled={gstDetail.gstSelected}
            setValue={setValue}
          />
          <InputField
            name="billingAddress2"
            label={addressLine2Field.label}
            placeholder={addressLine2Field.placeholder}
            value={billingAddressDetail.addressLine2 || ""}
            validationRules={addressLine2Field.validationRules}
            onChangeHandler={updateShippingField}
            register={register}
            errors={errors}
            isDisabled={gstDetail.gstSelected}
            setValue={setValue}
          />
          <InputField
            name="billingLandmark"
            label={landmarkField.label}
            placeholder={landmarkField.placeholder}
            value={billingAddressDetail.addressLandmark || ""}
            onChangeHandler={updateShippingField}
            register={register}
            errors={errors}
            isDisabled={gstDetail.gstSelected}
            setValue={setValue}
          />
          <NumberField
            name="billingPincode"
            label={pinCodeField.label}
            placeholder={pinCodeField.placeholder}
            value={billingAddressDetail.pincode || ""}
            register={register}
            errors={errors}
            isDisabled={disableField}
            maxLength={CONSTANT.RESTRICT_PINCODE}
            setValue={setValue}
          />
          <InputField
            name="billingState"
            label={stateField.label}
            iconClass={`icon-location-marker`}
            value={billingAddressDetail.state || ""}
            register={register}
            errors={errors}
            isDisabled={disableField}
            setValue={setValue}
          />
          <InputField
            name="billingCity"
            label={cityField.label}
            placeholder={cityField.placeholder}
            iconClass={`icon-location-marker`}
            value={billingAddressDetail.city || ""}
            register={register}
            errors={errors}
            isDisabled={disableField}
            setValue={setValue}
          />
          <div className="vida-billing-shipping-details__shipping">
            <h3 className="vida-billing-shipping-details__title-text">
              {shippingAddress.title}
            </h3>
            <p className="vida-billing-shipping-details__rto-text">
              {shippingAddress.message}
            </p>
            <div className="form__group form__field-checkbox vida-billing-shipping-details__address-confirm">
              <label className="vida-user-access__label">
                {shippingAddress.confirmAddressField.label}
                <input
                  type="checkbox"
                  defaultChecked={shippingAddressDetail.sameAsBilling}
                  {...register("addressConfirmation")}
                  onChange={(e) => handleSameAddressClick(e)}
                  //disabled={gstDetail.gstSelected}
                ></input>
                <span className="form__field-checkbox-mark"></span>
              </label>
            </div>
          </div>

          <InputField
            name="shippingAddress1"
            label={addressLine1Field.label}
            placeholder={addressLine1Field.placeholder}
            value={shippingAddressDetail.addressLine1 || ""}
            validationRules={addressLine1Field.validationRules}
            register={register}
            errors={errors}
            isDisabled={sameAsBilling}
            setValue={setValue}
            onChangeHandler={handleInputFieldChange}
          />
          <InputField
            name="shippingAddress2"
            label={addressLine2Field.label}
            placeholder={addressLine2Field.placeholder}
            value={shippingAddressDetail.addressLine2 || ""}
            validationRules={addressLine2Field.validationRules}
            register={register}
            errors={errors}
            isDisabled={sameAsBilling}
            setValue={setValue}
            onChangeHandler={handleInputFieldChange}
          />
          <InputField
            name="shippingLandmark"
            label={landmarkField.label}
            placeholder={landmarkField.placeholder}
            value={shippingAddressDetail.addressLandmark || ""}
            register={register}
            errors={errors}
            isDisabled={sameAsBilling}
            setValue={setValue}
          />

          <NumberField
            name="shippingPincode"
            label={pinCodeField.label}
            placeholder={pinCodeField.placeholder}
            value={
              (gstDetail.gstSelected && billingAddressDetail.pincode) ||
              shippingAddressDetail.pincode ||
              ""
            }
            register={register}
            validationRules={pinCodeField.validationRules}
            errors={errors}
            isDisabled={sameAsBilling}
            maxLength={CONSTANT.RESTRICT_PINCODE}
            setValue={setValue}
            onChangeHandler={(value) =>
              handleInputFieldChange("shippingPincode", value)
            }
          />

          <InputField
            name="shippingState"
            label={stateField.label}
            iconClass={`icon-location-marker`}
            value={
              shippingAddressDetail.state || billingAddressDetail.state || ""
            }
            register={register}
            errors={errors}
            isDisabled={disableField}
            setValue={setValue}
          />
          <InputField
            name="shippingCity"
            label={cityField.label}
            iconClass={`icon-location-marker`}
            value={
              shippingAddressDetail.city || billingAddressDetail.city || ""
            }
            register={register}
            errors={errors}
            isDisabled={disableField}
            setValue={setValue}
          />
        </form>
        <div className="vida-gst-details__btn-container">
          <button
            className="btn btn--secondary"
            onClick={(event) => setShowAddressPopup(false)}
          >
            Back
          </button>
          <button
            form={formId}
            className="btn btn--primary"
            onClick={handleSubmit((formData) =>
              handleShippingDetailsSubmit(formData)
            )}
          >
            Confirm
          </button>
        </div>
        <section className="notification notification--info vida-billing-shipping-details__banner">
          <div className="notification__container">
            <div className="notification__title">
              <span className="notification__icon">
                <i className="icon-information-circle"></i>
              </span>
              <label className="notification__label">
                {notificationBanner.label}
              </label>
            </div>
            <p className="notification__description">
              {notificationBanner.info}
            </p>
          </div>
        </section>
      </div>
    )
  );
};

const mapStateToProps = ({ purchaseConfigReducer, testDriveReducer }) => {
  return {
    cmpProps: {
      productId: purchaseConfigReducer.productId,
      productData: purchaseConfigReducer.productData,
      billingAddressDetail: purchaseConfigReducer.billingAddresses,
      shippingAddressDetail: purchaseConfigReducer.shippingAddresses,
      saleOrderId: purchaseConfigReducer.order,
      gstDetail: purchaseConfigReducer.gst,
      serviceablePincodesList: testDriveReducer.serviceablePincodesList
    }
  };
};

BillingShippingDetails.propTypes = {
  setIsAddressUpdated: PropTypes.func,
  queryString: PropTypes.string,
  billingDetails: PropTypes.shape({
    addressLine1Field: PropTypes.shape({
      label: PropTypes.string,
      placeholder: PropTypes.string,
      validationRules: PropTypes.object
    }),
    addressLine2Field: PropTypes.shape({
      label: PropTypes.string,
      placeholder: PropTypes.string,
      validationRules: PropTypes.object
    }),
    billingAddress: PropTypes.shape({
      title: PropTypes.string,
      message: PropTypes.string
    }),
    shippingAddress: PropTypes.shape({
      title: PropTypes.string,
      message: PropTypes.string,
      confirmAddressField: PropTypes.shape({
        label: PropTypes.string
      })
    }),
    landmarkField: PropTypes.shape({
      label: PropTypes.string,
      placeholder: PropTypes.string,
      validationRules: PropTypes.object
    }),
    pinCodeField: PropTypes.shape({
      label: PropTypes.string,
      placeholder: PropTypes.string,
      validationRules: PropTypes.object
    }),
    cityField: PropTypes.shape({
      label: PropTypes.string,
      placeholder: PropTypes.string,
      validationRules: PropTypes.object
    }),
    notificationBanner: PropTypes.shape({
      label: PropTypes.string,
      info: PropTypes.string
    }),
    stateField: PropTypes.shape({
      label: PropTypes.string,
      placeholder: PropTypes.string,
      validationRules: PropTypes.object
    }),
    title: PropTypes.string
  }),
  cmpProps: PropTypes.shape({
    productId: PropTypes.string,
    productData: PropTypes.object,
    billingAddressDetail: PropTypes.object,
    shippingAddressDetail: PropTypes.object,
    saleOrderId: PropTypes.object,
    serviceablePincodesList: PropTypes.object,
    gstDetail: PropTypes.object
  }),
  setShowAddressPopup: PropTypes.func,
  formId: PropTypes.string
};

BillingShippingDetails.defaultProps = {
  billingDetails: {},
  cmpProps: {}
};
export default connect(mapStateToProps)(BillingShippingDetails);
