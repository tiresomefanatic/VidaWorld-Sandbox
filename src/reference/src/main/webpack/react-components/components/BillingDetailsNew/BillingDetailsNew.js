import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Popup from "../Popup/Popup";
import GstDetails from "./GstDetails/GstDetails";
import CONSTANT from "../../../site/scripts/constant";
import BillingShippingDetails from "./BillingShippingDetails/BillingShippingDetails";
import { updateNameToDisplay } from "../../services/commonServices/commonServices";

const BillingDetailsNew = (props) => {
  const {
    billingConfig,
    fname,
    lname,
    email,
    code,
    number,
    aadhar,
    gst,
    gstConfig,
    billingShippingConfig,
    billingAddresses,
    shippingAddresses,
    setShowGstPopup,
    showGstPopup,
    CustomerType,
    originalGstValue
  } = props;
  const fields = billingConfig.fields;
  const formId = "billing-shipping-form";
  const queryString = location.href.split("?")[1];
  const fieldFullName = updateNameToDisplay(fname, lname);
  const billingInfo = [
    {
      label: fields.nameField.label,
      value: fieldFullName || "",
      fieldId: "name"
    },
    {
      label: fields.emailField.label,
      value: email || "",
      fieldId: "email"
    },
    {
      label: fields.phoneNumberField.label,
      value: `${code} ${number}`,
      fieldId: "phone"
    },
    ...(aadhar.aadharNumber && [
      {
        label: fields.aadharNumberField.label,
        value: aadhar.aadharNumber,
        fieldId: "aadhaar"
      }
    ]),
    ...(gst.gstNumber && [
      {
        label: fields.gstNumberField.label,
        value: gst.gstNumber,
        isEditable: true,
        fieldId: "gst"
      }
    ]),
    ...(gst.companyName && [
      {
        label: fields.companyNameField.label,
        value: gst.companyName,
        fieldId: "company"
      }
    ]),
    ...(gst.companyEmail && [
      {
        label: fields.companyEmailField.label,
        value: gst.companyEmail,
        fieldId: "companymail"
      }
    ])
  ];

  const [isAddressUpdated, setIsAddressUpdated] = useState(false);

  const addressInfo = [
    {
      label: fields.billingAddressField.label,
      individualValue: originalGstValue
        ? [
            billingAddresses.city,
            billingAddresses.state,
            billingAddresses.pincode
          ]
            .filter(Boolean)
            .join(", ")
        : "",
      value: [
        billingAddresses.addressLine1,
        billingAddresses.addressLine2,
        billingAddresses.addressLandmark,
        billingAddresses.city,
        billingAddresses.state,
        billingAddresses.pincode
      ]
        .filter(Boolean)
        .join(", ")
    },
    {
      label: fields.shippingAddressField.label,
      individualValue: [
        shippingAddresses.city,
        shippingAddresses.state,
        shippingAddresses.pincode
      ]
        .filter(Boolean)
        .join(", "),
      value: [
        shippingAddresses.addressLine1,
        shippingAddresses.addressLine2,
        shippingAddresses.addressLandmark,
        shippingAddresses.city,
        shippingAddresses.state,
        shippingAddresses.pincode
      ]
        .filter(Boolean)
        .join(", ")
    }
  ];

  const [showAddressPopup, setShowAddressPopup] = useState(false);
  const [showGSTError, setShowGSTError] = useState(false);

  const handleGSTError = (val) => {
    setShowGSTError(val);
  };
  const handlePopup = (popupId) => {
    switch (popupId) {
      case "gst":
        setShowGstPopup(true);
        break;
      case "address":
        setShowAddressPopup(true);
        break;
      default:
    }
  };

  const handleGstEntry = (event) => {
    event.preventDefault();
    setShowGstPopup(true);
  };

  return (
    <div className="vida-billing-new">
      <div className="vida-billing-new__heading">
        <h3>{billingConfig.title}</h3>
      </div>
      <div className="vida-billing-new__content">
        <div className="vida-billing-new__details">
          {billingInfo.map((field, index) => {
            return (
              <div className="vida-billing-new__info" key={index}>
                <label>
                  {field.label}
                  {field.isEditable ? (
                    <span
                      onClick={() => {
                        handlePopup(field.fieldId);
                      }}
                      className="icon-pencil-alt"
                    ></span>
                  ) : (
                    ""
                  )}
                </label>
                <span className="vida-billing-new__info-val">
                  {field.value}
                </span>
              </div>
            );
          })}

          {CustomerType === CONSTANT.CUSTOMER_TYPES.CORPORATE &&
            !gst.gstSelected && (
              <a
                className="vida-pricing-new__popup-link"
                href="#"
                rel="noreferrer noopener"
                onClick={(event) => handleGstEntry(event)}
              >
                {fields?.enterGst?.label}
              </a>
            )}
        </div>
        <div className="vida-billing-new__address">
          {addressInfo.map((item, index) => (
            <div className="vida-billing-new__billing" key={index}>
              <label className="vida-billing-new__billing-add">
                {item.label}
                <span
                  onClick={() => {
                    handlePopup("address");
                  }}
                  className="icon-pencil-alt"
                ></span>
              </label>
              {CustomerType === CONSTANT.CUSTOMER_TYPES.CORPORATE ? (
                <p>{item.value}</p>
              ) : !isAddressUpdated && index == 0 && originalGstValue ? (
                <p>{item.individualValue}</p>
              ) : (
                <p>{item.value}</p>
              )}
            </div>
          ))}
        </div>
      </div>
      {showGstPopup && (
        <Popup
          mode="full-screen"
          handlePopupClose={() => setShowGstPopup(false)}
        >
          <div className="vida-model__gst-modal">
            <h2>{gstConfig.title}</h2>
            <h4 className="vida-model__gst-desc">{gstConfig.description}</h4>
            <p className="vida-model__gst-info txt-color--orange">
              {gstConfig.info}
            </p>
            <h4 className="vida-model__gst-subhead">{gstConfig.subtitle}</h4>

            <GstDetails
              gstConfig={gstConfig}
              gstData={props.gst}
              showGSTError={showGSTError}
              handleGSTError={handleGSTError}
              setShowGstPopup={setShowGstPopup}
            ></GstDetails>
          </div>
        </Popup>
      )}
      {showAddressPopup && (
        <div className="vida-model__billing-details">
          <Popup
            mode="full-screen"
            handlePopupClose={() => setShowAddressPopup(false)}
          >
            <BillingShippingDetails
              queryString={queryString}
              billingDetails={billingShippingConfig}
              formId={formId}
              setShowAddressPopup={setShowAddressPopup}
              setIsAddressUpdated={setIsAddressUpdated}
            ></BillingShippingDetails>
          </Popup>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = ({ userProfileDataReducer, purchaseConfigReducer }) => {
  return {
    fname: userProfileDataReducer.fname,
    lname: userProfileDataReducer.lname,
    code: userProfileDataReducer.code,
    number: userProfileDataReducer.number,
    email: userProfileDataReducer.email,
    aadhar: purchaseConfigReducer.aadhar,
    gst: purchaseConfigReducer.gst,
    billingAddresses: purchaseConfigReducer.billingAddresses,
    shippingAddresses: purchaseConfigReducer.shippingAddresses
  };
};

BillingDetailsNew.propTypes = {
  billingConfig: PropTypes.shape({
    title: PropTypes.string,
    fields: PropTypes.object
  }),
  fname: PropTypes.string,
  lname: PropTypes.string,
  email: PropTypes.string,
  code: PropTypes.string,
  number: PropTypes.string,
  aadhar: PropTypes.object,
  gst: PropTypes.object,
  gstConfig: PropTypes.object,
  billingShippingConfig: PropTypes.object,
  billingAddresses: PropTypes.object,
  shippingAddresses: PropTypes.object,
  setShowGstPopup: PropTypes.func,
  showGstPopup: PropTypes.bool,
  CustomerType: PropTypes.string,
  originalGstValue: PropTypes.bool
};

export default connect(mapStateToProps)(BillingDetailsNew);
