import React from "react";
import PropTypes from "prop-types";
import { PURCHASE_STATE } from "./Constants";
import Button from "../Components/Button";
import RichTextComponent from "../Components/RichTextComponent";
import { BUTTON_TYPES } from "../BillingShippingAddress/Constants";
import useScreen from "../../../../hooks/utilities/useScreen";

const CustomBottomDrawer = ({
  viewState,
  isOpen,
  toggleDrawer,
  isShowCancelButton,
  cancelProps,
  reviewProps,
  initialProps,
  errorMessage,
  isInsuranceApplied
}) => {
  // states
  const { isDesktop } = useScreen();

  const getView = (view) => {
    switch (view) {
      case PURCHASE_STATE.REVIEW:
        return (
          <div className="bottom-drawer-intial-view">
            <div className="info-container">
              {/* <label className="termsAndConditionsLabel">
                <input
                  type="checkbox"
                  onChange={reviewProps?.handleTncChange}
                  name="termsAndConditions"
                  checked={reviewProps?.isTncChecked}
                  className="termsAndConditionsField"
                />
                <RichTextComponent
                  content={reviewProps?.termsAndConditionsLabel}
                />
              </label> */}
              <div className="payment-details">
                <p className="payment-label">{reviewProps?.paymentLabel}</p>
                <p className="payment-amount">
                  {"₹" + Number(reviewProps?.paymentAmount).toLocaleString()}
                </p>
              </div>
            </div>
            <div
              className="summary-buttons-container"
              style={{ flex: isShowCancelButton ? 1 : "initial" }}
            >
              {isDesktop && isShowCancelButton && (
                <Button
                  label={reviewProps?.cancelButton?.label || ""}
                  onClick={reviewProps?.cancelButton?.onClick}
                  secondaryLabel={
                    reviewProps?.cancelButton?.secondaryLabel || ""
                  }
                  variant={BUTTON_TYPES.SECONDARY}
                  disbaled={reviewProps?.cancelButton?.disbaled}
                  style={{ flex: 1 }}
                  {...reviewProps?.cancelButton}
                />
              )}
              <Button
                label={reviewProps?.confirmButton?.label || ""}
                onClick={reviewProps?.confirmButton?.onClick}
                secondaryLabel={
                  reviewProps?.confirmButton?.secondaryLabel || ""
                }
                variant={BUTTON_TYPES.PRIMARY}
                disbaled={reviewProps?.confirmButton?.disbaled}
                style={{ flex: 1 }}
                {...reviewProps?.confirmButton}
              />
            </div>
          </div>
        );
      case PURCHASE_STATE.CANCEL:
        return (
          <div className="purchase-booking-drawer-container">
            <div className="purchase-booking-drawer-title">
              <p>{cancelProps?.drawerTitle}</p>
            </div>
            <p className="purchase-booking-error show-only-mobile">{}</p>
            <div className="purchase-booking-drawer-btn-container">
              <a
                href={cancelProps?.cancelButton?.url || "#"}
                target={
                  cancelProps?.cancelButton?.openNewTab ? "_blank" : "_self"
                }
                className="purchase-booking-cancel-btn"
                rel="noreferrer"
                onClick={cancelProps?.cancelButton?.onClick}
                {...cancelProps?.cancelButton}
              >
                {cancelProps?.cancelButton?.label || ""}
              </a>
              <a
                href={cancelProps?.confirmButton?.url || "#"}
                target={
                  cancelProps?.confirmButton?.openNewTab ? "_blank" : "_self"
                }
                className="purchase-booking-confirm-btn"
                rel="noreferrer"
                onClick={cancelProps?.confirmButton?.onClick}
                {...cancelProps?.confirmButton}
              >
                {cancelProps?.confirmButton?.label || ""}
              </a>
            </div>
          </div>
        );
      default:
        return (
          <div className="bottom-drawer-intial-view">
            <div className="info-container">
              {/* <label className="termsAndConditionsLabel">
                <input
                  type="checkbox"
                  onChange={initialProps?.handleTncChange}
                  name="termsAndConditions"
                  checked={initialProps?.isTncChecked}
                  className="termsAndConditionsField"
                />
                <RichTextComponent
                  content={initialProps?.termsAndConditionsLabel}
                />
              </label> */}
              <div className="payment-details">
                <p className="payment-label">{initialProps?.paymentLabel}</p>
                <p className="payment-amount">
                  {"₹" + Number(initialProps?.paymentAmount).toLocaleString()}
                </p>
              </div>
            </div>
            {/* {!isDesktop && !isInsuranceApplied && (
              <div
                className="insurance-reminder"
                onClick={initialProps?.handleAddInsuranceClick}
              >
                <RichTextComponent
                  className={"content"}
                  content={initialProps?.addInsuranceLabel}
                />
              </div>
            )} */}
            <div
              className="summary-buttons-container"
              style={{ flex: isShowCancelButton ? 1 : "initial" }}
            >
              {isDesktop && isShowCancelButton && (
                <Button
                  label={initialProps?.cancelButton?.label || ""}
                  onClick={initialProps?.cancelButton?.onClick}
                  secondaryLabel={
                    initialProps?.cancelButton?.secondaryLabel || ""
                  }
                  variant={BUTTON_TYPES.SECONDARY}
                  disbaled={initialProps?.cancelButton?.disbaled}
                  style={{ flex: 1, color: "black" }}
                  {...initialProps?.cancelButton}
                />
              )}
              <Button
                label={initialProps?.confirmButton?.label || ""}
                onClick={initialProps?.confirmButton?.onClick}
                secondaryLabel={
                  initialProps?.confirmButton?.secondaryLabel || ""
                }
                variant={BUTTON_TYPES.PRIMARY}
                disbaled={initialProps?.confirmButton?.disbaled}
                style={{ flex: 1 }}
                {...initialProps?.confirmButton}
              />
            </div>
          </div>
        );
    }
  };
  return (
    <div
      className={
        !isDesktop && isOpen
          ? "purchase-booking-drawer-wrapper slide-down"
          : "purchase-booking-drawer-wrapper"
      }
    >
      <div className="vida-2-container">
        <div className="drawer-btn-container">
          <div className="drawer-btn" onClick={toggleDrawer}></div>
        </div>
        <p className="purchase-booking-error show-only-desktop">
          {errorMessage}
        </p>
        {getView(viewState)}
      </div>
    </div>
  );
};

CustomBottomDrawer.propTypes = {
  viewState: PropTypes.string,
  isOpen: PropTypes.bool,
  toggleDrawer: PropTypes.func,
  cancelProps: PropTypes.object,
  initialProps: PropTypes.shape({
    termsAndConditionsLabel: PropTypes.string,
    paymentLabel: PropTypes.string,
    paymentAmount: PropTypes.string,
    handleAddInsuranceClick: PropTypes.func,
    addInsuranceLabel: PropTypes.string,
    confirmButton: PropTypes.shape({
      label: PropTypes.string,
      onClick: PropTypes.func,
      secondaryLabel: PropTypes.string,
      disbaled: PropTypes.bool
    }),
    cancelButton: PropTypes.shape({
      label: PropTypes.string,
      onClick: PropTypes.func,
      secondaryLabel: PropTypes.string,
      disbaled: PropTypes.bool
    }),
    isTncChecked: PropTypes.bool,
    handleTncChange: PropTypes.func
  }),
  reviewProps: PropTypes.shape({
    termsAndConditionsLabel: PropTypes.string,
    paymentLabel: PropTypes.string,
    paymentAmount: PropTypes.string,
    handleAddInsuranceClick: PropTypes.func,
    addInsuranceLabel: PropTypes.string,
    confirmButton: PropTypes.shape({
      label: PropTypes.string,
      onClick: PropTypes.func,
      secondaryLabel: PropTypes.string,
      disbaled: PropTypes.bool
    }),
    cancelButton: PropTypes.shape({
      label: PropTypes.string,
      onClick: PropTypes.func,
      secondaryLabel: PropTypes.string,
      disbaled: PropTypes.bool
    }),
    isTncChecked: PropTypes.bool,
    handleTncChange: PropTypes.func
  }),
  errorMessage: PropTypes.string,
  isInsuranceApplied: PropTypes.bool,
  isShowCancelButton: PropTypes.bool
};

export default CustomBottomDrawer;
