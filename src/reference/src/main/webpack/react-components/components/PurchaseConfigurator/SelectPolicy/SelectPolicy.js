import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Popup from "../../Popup/Popup";
import { tns } from "tiny-slider/src/tiny-slider";
import breakpoints from "../../../../site/scripts/media-breakpoints";
import ReactTooltip from "react-tooltip";
import RemoveCpa from "../RemoveCpa/RemoveCpa";
import { setCpaOptedDataDispatcher } from "../../../store/purchaseConfig/purchaseConfigActions";
import currencyUtils from "../../../../site/scripts/utils/currencyUtils";

const isDesktop = window.matchMedia(
  breakpoints.mediaExpression.desktop
).matches;

const AddOnList = ({ addOnOptions, handleAddOnSelect, checkboxRefArr }) => {
  const setCheckboxRef = (ref) => {
    checkboxRefArr.push(ref);
  };
  return (
    <div className="vida-select-policy__add-on-list">
      {addOnOptions.map((option) => {
        return (
          <div key={option.name}>
            <div className="vida-select-policy__add-on-list-item">
              <div className="form__group form__field-checkbox">
                <label className="form__field-label">
                  <span>
                    {option.name}
                    {option.tooltips && (
                      <i
                        className="icon-information-circle"
                        data-tip={option.tooltips}
                      ></i>
                    )}
                  </span>
                  <input
                    type="checkbox"
                    defaultChecked={option.selected}
                    ref={setCheckboxRef}
                    onClick={(e) => handleAddOnSelect(e, option.name)}
                  ></input>
                  <span className="form__field-checkbox-mark"></span>
                </label>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const AddOnListSm = ({
  addOnOptions,
  handleAddOnSmSelect,
  handleAddCover,
  addOnBtn,
  resetBtn,
  checkboxRefArr,
  isEnableReset,
  isEnableAdd
}) => {
  const setCheckboxRef = (ref) => {
    checkboxRefArr.push(ref);
  };
  return (
    <div className="vida-select-policy__add-on-list-sm">
      {addOnOptions.map((option) => {
        return (
          <div
            className="vida-select-policy__add-on-list-item"
            key={option.name}
          >
            <div className="form__group form__field-checkbox">
              <label className="form__field-label">
                <span>
                  {option.name}
                  {option.tooltips && (
                    <i
                      className="icon-information-circle"
                      data-tip={option.tooltips}
                    ></i>
                  )}
                </span>
                <input
                  type="checkbox"
                  defaultChecked={option.selected}
                  ref={setCheckboxRef}
                  onClick={(e) => handleAddOnSmSelect(e, option.name)}
                ></input>
                <span className="form__field-checkbox-mark"></span>
              </label>
            </div>
          </div>
        );
      })}
      <div className="vida-select-policy__add-on-list-action">
        <button
          className="btn btn--secondary"
          onClick={() => handleAddCover()}
          disabled={!isEnableAdd}
        >
          {addOnBtn.label}
        </button>
      </div>
      {isEnableReset && (
        <div className="vida-select-policy__add-on-list-action">
          <button
            className="btn btn--secondary"
            onClick={() => handleAddCover(true)}
          >
            {resetBtn.label}
          </button>
        </div>
      )}
    </div>
  );
};

const PolicyCard = ({ insuranceItem, handleSelectPolicy, config }) => {
  const { amountSubtext } = config;
  return (
    <div key={insuranceItem.insurancerId}>
      <div className="vida-select-policy__card">
        <div className="vida-select-policy__card-header">
          <picture className="vida-select-policy__card-logo">
            <img src={insuranceItem.logoPath} alt={insuranceItem.name} />
          </picture>
          <span className="vida-select-policy__card-title">
            {insuranceItem.name}
          </span>
        </div>
        <div className="vida-select-policy__premium">
          <span className="vida-select-policy__amount">
            {currencyUtils.getCurrencyFormatValue(insuranceItem.premium)}
          </span>
          <span className="vida-select-policy__label">{amountSubtext} </span>
        </div>
        <p className="vida-select-policy__card-description">
          {insuranceItem.description}
        </p>
        <div className="vida-select-policy__feature-list">
          {insuranceItem.covers.map((featureItem) => {
            return (
              <span
                className="vida-select-policy__feature-list-item"
                key={featureItem.name}
              >
                <i
                  className={
                    featureItem.eligible === "Yes" ? "icon-check" : "icon-x"
                  }
                ></i>
                <span>{featureItem.name}</span>
              </span>
            );
          })}
        </div>
        {insuranceItem.hasAddOns && (
          <div className="vida-select-policy__add-on-tags">
            <div className="vida-select-policy__add-on-tags-title">
              Added Cover (Add-ons)
            </div>

            {insuranceItem.validAddons.map((addOnItem) => {
              return addOnItem.selected ? (
                <p key={addOnItem.addonId}>
                  {addOnItem.name}{" "}
                  {currencyUtils.getCurrencyFormatValue(addOnItem.amount)}
                </p>
              ) : null;
            })}
          </div>
        )}
        <button
          className="btn btn--primary"
          onClick={() => {
            handleSelectPolicy(insuranceItem);
          }}
        >
          {config.addPolicyBtn.label}
        </button>
      </div>
    </div>
  );
};

const setSlider = () => {
  {
    isDesktop &&
      tns({
        container: ".vida-select-policy__add-on-list",
        items: 2,
        slideBy: "page",
        mouseDrag: true,
        controls: false,
        nav: false,
        loop: false
      });
  }
  const insuranceSlider = tns({
    container: ".vida-select-policy__card-list",
    items: 1,
    slideBy: "page",
    mouseDrag: true,
    controls: false,
    gutter: 16,
    fixedWidth: 284,
    nav: true,
    navPosition: "bottom",
    edgePadding: 16,
    center: true,
    loop: false,
    responsive: {
      576: {
        items: 2,
        center: false
      },
      1024: {
        items: 3,
        nav: false,
        fixedWidth: 328,
        edgePadding: 32,
        gutter: 32
      }
    }
  });

  return insuranceSlider;
};

const SelectPolicy = (props) => {
  const {
    addonsList,
    insurancePremiumList,
    isCpaOpted,
    handleShowSelectPolicyPopup,
    handleSelectPolicy
  } = props;
  const { title, description, logoURL, addOnLabel, addOnBtn, resetBtn } =
    props.config;
  const [numOfAddOnSelected, setNumOfAddOnSelected] = useState(0);

  const [showAddOnListSm, setShowAddOnListSm] = useState(false);

  const [showRemoveCpaPopup, setShowRemoveCpaPopup] = useState(false);
  const [isAddOnChanged, setIsAddOnChanged] = useState(false);

  const checkboxRefArr = [];

  const handleShowRemoveCpaPopup = (event) => {
    event.preventDefault();
    setShowRemoveCpaPopup(true);
  };

  const handleCloseRemoveCpaPopup = () => {
    setShowRemoveCpaPopup(false);
  };

  const handleShowAddOnListSm = () => {
    setShowAddOnListSm(!showAddOnListSm);
  };

  const handleAddOnSelect = (e, targetOption) => {
    let isAddOnChanged = false;
    addonsList.forEach((option) => {
      option.name === targetOption && (option.selected = e.target.checked);
      if (option.selected) {
        isAddOnChanged = true;
      }
    });
    isAddOnChanged ? setIsAddOnChanged(true) : setIsAddOnChanged(false);
  };

  const handleAddOnSmSelect = (e, targetOption) => {
    handleAddOnSelect(e, targetOption);
    setNumOfAddOnSelected(
      addonsList.filter((option) => option.selected).length
    );
    if (e.target.checked) {
      e.target
        .closest(".vida-select-policy__add-on-list-item")
        .classList.add("selected");
    } else {
      e.target
        .closest(".vida-select-policy__add-on-list-item")
        .classList.remove("selected");
    }
  };

  const handleAddCover = (isReset = false) => {
    if (isReset) {
      addonsList.forEach((option, index) => {
        checkboxRefArr[index].checked = false;
        option.selected = false;
      });
      setIsAddOnChanged(false);
    }
    if (!isAddOnChanged) {
      return;
    }
    const selectedAddons = addonsList.filter((option) => option.selected);
    handleShowAddOnListSm();
    handleShowSelectPolicyPopup(true, isCpaOpted, selectedAddons);
  };

  const [insuranceSliderRef, setInsuranceSliderRef] = useState(null);

  useEffect(() => {
    setNumOfAddOnSelected(
      addonsList.filter((option) => option.selected).length
    );
    if (!insuranceSliderRef) {
      setInsuranceSliderRef(
        addonsList.length > 0 && insurancePremiumList.length > 0 && setSlider()
      );
    }
  }, [addonsList, insurancePremiumList]);

  useEffect(() => {
    if (addonsList.some(({ selected }) => selected)) {
      setIsAddOnChanged(true);
    }
  }, [addonsList]);

  return (
    <Popup
      mode="full-screen"
      handlePopupClose={() => {
        handleShowSelectPolicyPopup(false);
      }}
    >
      <div className="vida-select-policy__container">
        <ReactTooltip place="bottom" type="dark" effect="solid" />

        <div className="vida-select-policy__header">
          <div>
            <span className="vida-select-policy__title">
              {insurancePremiumList.length || ""} {title}
            </span>
            <span className="vida-select-policy__description">
              {isCpaOpted ? (
                <>
                  {description.removeCPA.label}{" "}
                  <a
                    href="#"
                    onClick={(event) => handleShowRemoveCpaPopup(event)}
                  >
                    {description.removeCPA.action}
                  </a>
                </>
              ) : (
                <>
                  {description.addCPA.label}{" "}
                  <a
                    href="#"
                    onClick={() => {
                      setCpaOptedDataDispatcher({
                        cpaOpted: true,
                        cpaNotOptedReason: ""
                      });
                      handleShowSelectPolicyPopup(
                        true,
                        true,
                        addonsList.length > 0 &&
                          addonsList.filter((option) => option.selected)
                      );
                    }}
                  >
                    {description.addCPA.action}
                  </a>
                </>
              )}
            </span>
            {showRemoveCpaPopup && (
              <RemoveCpa
                config={props.config.removeCPAPopup}
                addonsList={addonsList}
                handleShowSelectPolicyPopup={handleShowSelectPolicyPopup}
                handleCloseRemoveCpaPopup={handleCloseRemoveCpaPopup}
              />
            )}
          </div>
          <picture className="vida-select-policy__logo-lg">
            <img src={logoURL} alt="logo" />
          </picture>
        </div>

        {addonsList.length > 0 && (
          <div className="vida-select-policy__add-on">
            <p
              className="vida-select-policy__add-on-title"
              onClick={() => !isDesktop && handleShowAddOnListSm()}
            >
              {(isDesktop || numOfAddOnSelected === 0) && (
                <span>{isCpaOpted ? addOnLabel : ""}</span>
              )}
              {!isDesktop && numOfAddOnSelected > 0 && (
                <span>{numOfAddOnSelected} selected</span>
              )}

              <i
                className={
                  showAddOnListSm
                    ? "icon-chevron show-add-on-list"
                    : "icon-chevron"
                }
              ></i>
            </p>
            <div className="vida-select-policy__add-on-wrapper">
              {!isDesktop && showAddOnListSm && (
                <AddOnListSm
                  addOnOptions={addonsList}
                  addOnBtn={addOnBtn}
                  numOfAddOnSelected={numOfAddOnSelected}
                  handleAddOnSmSelect={handleAddOnSmSelect}
                  handleAddCover={handleAddCover}
                  checkboxRefArr={checkboxRefArr}
                  resetBtn={resetBtn}
                  isEnableReset={isAddOnChanged}
                  isEnableAdd={isAddOnChanged}
                />
              )}
              {isDesktop && (
                <AddOnList
                  addOnOptions={addonsList}
                  handleAddOnSelect={handleAddOnSelect}
                  checkboxRefArr={checkboxRefArr}
                />
              )}
              <div className="vida-select-policy__background">
                <button
                  className="btn btn--secondary"
                  onClick={() => handleAddCover()}
                  disabled={!isAddOnChanged}
                >
                  {addOnBtn.label}
                </button>
                {isAddOnChanged && (
                  <button
                    className="btn btn--secondary vida-select-policy__reset-btn"
                    onClick={() => handleAddCover(true)}
                  >
                    {resetBtn.label}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {insurancePremiumList && insurancePremiumList.length > 0 && (
          <div className="vida-select-policy__card-list">
            {insurancePremiumList.map((insuranceItem) => {
              return (
                <PolicyCard
                  config={props.config}
                  insuranceItem={insuranceItem}
                  key={insuranceItem.insurancerId}
                  handleSelectPolicy={handleSelectPolicy}
                />
              );
            })}
          </div>
        )}

        <picture className="vida-select-policy__logo">
          <img src={logoURL} alt="Policy Logo" />
        </picture>
      </div>
    </Popup>
  );
};

export const EmptyPolicyPopup = ({ handleShowSelectPolicyPopup, config }) => {
  const { noResponseModel } = config;
  return (
    <Popup
      mode="medium"
      handlePopupClose={() => {
        handleShowSelectPolicyPopup(false);
      }}
    >
      <h3 className="vida-select-policy__empty-model-title">
        {noResponseModel.title}
      </h3>
      <p className="vida-select-policy__empty-model-description">
        {noResponseModel.description}
      </p>
      <div className="vida-select-policy__empty-model-btn-wrapper">
        <button
          className="btn btn--primary"
          onClick={() => handleShowSelectPolicyPopup(false)}
        >
          {noResponseModel.okBtn}
        </button>
      </div>
    </Popup>
  );
};

SelectPolicy.propTypes = {
  config: PropTypes.object,
  addonsList: PropTypes.array,
  isCpaOpted: PropTypes.bool,
  insurancePremiumList: PropTypes.array,
  handleShowSelectPolicyPopup: PropTypes.func,
  handleSelectPolicy: PropTypes.func
};

AddOnList.propTypes = {
  addOnOptions: PropTypes.array,
  handleAddOnSelect: PropTypes.func,
  checkboxRefArr: PropTypes.array
};

AddOnListSm.propTypes = {
  addOnOptions: PropTypes.array,
  handleAddOnSmSelect: PropTypes.func,
  handleAddCover: PropTypes.func,
  addOnBtn: PropTypes.object,
  resetBtn: PropTypes.object,
  numOfAddOnSelected: PropTypes.number,
  checkboxRefArr: PropTypes.array,
  isEnableReset: PropTypes.bool,
  isEnableAdd: PropTypes.bool
};

PolicyCard.propTypes = {
  config: PropTypes.any,
  insuranceItem: PropTypes.any,
  addOnList: PropTypes.array,
  handleSelectPolicy: PropTypes.func
};

EmptyPolicyPopup.propTypes = {
  config: PropTypes.any,
  handleShowSelectPolicyPopup: PropTypes.func
};

export default SelectPolicy;
