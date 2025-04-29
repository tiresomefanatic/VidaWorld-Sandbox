import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const BillingDetails = (props) => {
  const {
    billingConfig,
    fname,
    lname,
    email,
    code,
    number,
    aadhar,
    gst,
    billingAddresses,
    shippingAddresses
  } = props;
  const fields = billingConfig.fields;
  const billingInfo = [
    {
      label: fields.nameField.label,
      value: `${fname} ${lname}`
    },
    {
      label: fields.emailField.label,
      value: email || ""
    },
    {
      label: fields.phoneNumberField.label,
      value: `${code} ${number}`
    },
    ...(aadhar.aadharNumber && [
      {
        label: fields.aadharNumberField.label,
        value: aadhar.aadharNumber
      }
    ]),
    ...(gst.gstNumber && [
      {
        label: fields.gstNumberField.label,
        value: gst.gstNumber
      }
    ]),
    ...(gst.companyName && [
      {
        label: fields.companyNameField.label,
        value: gst.companyName
      }
    ]),
    ...(gst.companyEmail && [
      {
        label: fields.companyEmailField.label,
        value: gst.companyEmail
      }
    ])
  ];

  const addressInfo = [
    {
      label: fields.billingAddressField.label,
      value: `${billingAddresses.addressLine1} ${billingAddresses.addressLine2} 
      ${billingAddresses.addressLandmark} ${billingAddresses.city} ${billingAddresses.state} ${billingAddresses.pincode}`
    },
    {
      label: fields.shippingAddressField.label,
      value: `${shippingAddresses.addressLine1} ${shippingAddresses.addressLine2} 
      ${shippingAddresses.addressLandmark} ${shippingAddresses.city} ${shippingAddresses.state} ${shippingAddresses.pincode}`
    }
  ];

  return (
    <div className="vida-billing">
      <div className="vida-billing__heading">
        <h3>{billingConfig.title}</h3>
      </div>
      <div className="vida-billing__content">
        <div className="vida-billing__details">
          {billingInfo.map((field, index) => (
            <div className="vida-billing__info" key={index}>
              <label>{field.label}</label>
              <span className="vida-billing__info-val">{field.value}</span>
            </div>
          ))}
        </div>
        <div className="vida-billing__address">
          {addressInfo.map((item, index) => (
            <div className="vida-billing__billing" key={index}>
              <label className="vida-billing__billing-add">{item.label}</label>
              <p>{item.value}</p>
            </div>
          ))}
        </div>
      </div>
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

BillingDetails.propTypes = {
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
  billingAddresses: PropTypes.object,
  shippingAddresses: PropTypes.object
};

export default connect(mapStateToProps)(BillingDetails);
