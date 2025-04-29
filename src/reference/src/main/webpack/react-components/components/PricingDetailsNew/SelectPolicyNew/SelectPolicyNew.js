import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import Popup from "../../Popup/Popup";
import { tns } from "tiny-slider/src/tiny-slider";
import breakpoints from "../../../../site/scripts/media-breakpoints";
import ReactTooltip from "react-tooltip";
import RemoveCpa from "../../PurchaseConfigurator/RemoveCpa/RemoveCpa";
import { setCpaOptedDataDispatcher } from "../../../store/purchaseConfig/purchaseConfigActions";
import currencyUtils from "../../../../site/scripts/utils/currencyUtils";

const isDesktop = window.matchMedia(
  breakpoints.mediaExpression.desktop
).matches;

const AddOnList = ({
  addOnOptions,
  insuranceAddonsList,
  handleAddOnSelect,
  checkboxRefArr
}) => {
  const setCheckboxRef = (ref) => {
    checkboxRefArr.push(ref);
  };
  return (
    <div className="vida-select-policy-new__add-on-list">
      {addOnOptions.map((option) => {
        return (
          <div key={option.name}>
            <div className="vida-select-policy-new__add-on-list-item">
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
  updateOnBtn,
  resetBtn,
  checkboxRefArr,
  insuranceAddonsList,
  isEnableReset
}) => {
  const setCheckboxRef = (ref) => {
    checkboxRefArr.push(ref);
  };
  return (
    <div className="vida-select-policy-new__add-on-list-sm">
      {addOnOptions.map((option) => {
        return (
          <div
            className="vida-select-policy-new__add-on-list-item"
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
      <div className="vida-select-policy-new__add-on-list-action">
        {insuranceAddonsList.length === 0 ? (
          <button
            className="btn btn--secondary"
            onClick={() => handleAddCover()}
          >
            {addOnBtn.label}
          </button>
        ) : (
          <button
            className="btn btn--secondary"
            onClick={() => handleAddCover(true)}
          >
            {updateOnBtn.label}
          </button>
        )}
      </div>
      {isEnableReset && (
        <div className="vida-select-policy-new__add-on-list-action">
          <button
            className="btn btn--secondary"
            onClick={() => handleAddCover(false, true)}
          >
            {resetBtn.label}
          </button>
        </div>
      )}
    </div>
  );
};

const PolicyCard = ({
  insuranceItem,
  selectedInsurerId,
  handleSelectPolicy,
  handleDeleteSelectedPolicy,
  config
}) => {
  const { amountSubtext } = config;
  return (
    <div key={insuranceItem.insurancerId}>
      <div className="vida-select-policy-new__card">
        <div className="vida-select-policy-new__card-header">
          <picture className="vida-select-policy-new__card-logo">
            <img src={insuranceItem.logoPath} alt={insuranceItem.name} />
          </picture>
          <span className="vida-select-policy-new__card-title">
            {insuranceItem.name}
          </span>
        </div>
        <div className="vida-select-policy-new__premium">
          <span className="vida-select-policy-new__amount">
            {currencyUtils.getCurrencyFormatValue(insuranceItem.premium)}
          </span>
          <span className="vida-select-policy-new__label">
            {amountSubtext}{" "}
          </span>
        </div>
        <p className="vida-select-policy-new__card-description">
          {insuranceItem.description}
        </p>
        <div className="vida-select-policy-new__feature-list">
          {insuranceItem.covers.map((featureItem) => {
            return (
              <span
                className="vida-select-policy-new__feature-list-item"
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
          <div className="vida-select-policy-new__add-on-tags">
            <div className="vida-select-policy-new__add-on-tags-title">
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
        {selectedInsurerId == insuranceItem.insurancerId ? (
          <button
            className="btn btn--secondary"
            onClick={() => {
              handleDeleteSelectedPolicy();
            }}
          >
            {config.removePolicyBtn.label}
            <i className="icon icon-trash"></i>
          </button>
        ) : (
          <button
            className="btn btn--primary"
            onClick={() => {
              handleSelectPolicy(insuranceItem);
            }}
          >
            {config.addPolicyBtn.label}
          </button>
        )}
      </div>
    </div>
  );
};

const setSlider = () => {
  {
    isDesktop &&
      tns({
        container: ".vida-select-policy-new__add-on-list",
        items: 2,
        slideBy: "page",
        mouseDrag: true,
        controls: false,
        nav: false,
        loop: false
      });
  }
  const insuranceSlider = tns({
    container: ".vida-select-policy-new__card-list",
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
        center: false,
        nav: true,
        navPosition: "bottom"
      },
      1024: {
        items: 3,
        nav: false,
        fixedWidth: 328,
        edgePadding: 32,
        gutter: 32,
        nav: true,
        navPosition: "bottom"
      }
    }
  });

  return insuranceSlider;
};

const SelectPolicyNew = (props) => {
  const {
    addonsList,
    insurancePremiumList,
    isCpaOpted,
    selectedInsurerId,
    handleShowSelectPolicyPopup,
    handleSelectPolicy,
    handleDeleteSelectedPolicy,
    insuranceAddonsList,
    setShowCoverCheckPopup,
    isAddonTriggered,
    isAddonUpdated,
    setIsUpdateAddon,
    setIsAddonTriggered,
    setIsAddPolicy
  } = props;
  const {
    title,
    description,
    logoURL,
    addOnLabel,
    addOnBtn,
    updateOnBtn,
    resetBtn
  } = props.config;
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
        .closest(".vida-select-policy-new__add-on-list-item")
        .classList.add("selected");
    } else {
      e.target
        .closest(".vida-select-policy-new__add-on-list-item")
        .classList.remove("selected");
    }
  };
  const handleAddCoverCheck = (isUpdate) => {
    const selectedAddons = addonsList.filter((option) => option.selected);
    if (selectedAddons.length === 0 && !isUpdate) {
      addonsList.forEach((option, index) => {
        checkboxRefArr[index].checked = false;
        option.selected = false;
      });
    }
    handleShowAddOnListSm();
    handleShowSelectPolicyPopup(true, isCpaOpted, selectedAddons);
  };
  const handleAddCover = (isUpdate = false, isReset = false) => {
    if (isReset) {
      addonsList.forEach((option, index) => {
        checkboxRefArr[index].checked = false;
        option.selected = false;
      });
      setIsAddOnChanged(false);
    } else {
      const selectedAddons = addonsList.filter((option) => option.selected);
      if (selectedAddons.length < addonsList.length) {
        setIsUpdateAddon(isUpdate);
        setIsAddPolicy(false);
        setShowCoverCheckPopup(true);
      } else {
        handleAddCoverCheck(isUpdate);
      }
    }
  };

  const [insuranceSliderRef, setInsuranceSliderRef] = useState(null);

  useEffect(() => {
    setNumOfAddOnSelected(
      addonsList.filter((option) => option.selected).length
    );
    if (selectedInsurerId.length > 0 && insurancePremiumList.length > 1) {
      insurancePremiumList.some((item, idx) => {
        item.insurancerId == selectedInsurerId &&
          insurancePremiumList.unshift(
            // remove the found item, in-place (by index with splice),
            // returns an array of a single item removed
            insurancePremiumList.splice(idx, 1)[0]
          );
      });
    }
    if (!insuranceSliderRef) {
      setInsuranceSliderRef(
        addonsList.length > 0 && insurancePremiumList.length > 0 && setSlider()
      );
    }
  }, [addonsList, insurancePremiumList, selectedInsurerId]);

  useEffect(() => {
    if (addonsList.some(({ selected }) => selected)) {
      setIsAddOnChanged(true);
    }
  }, [addonsList]);

  useEffect(() => {
    if (isAddonTriggered) {
      handleAddCoverCheck(isAddonUpdated);
      setIsAddonTriggered(false);
    }
  }, [isAddonTriggered]);
  return (
    <Popup
      mode="full-screen"
      handlePopupClose={() => {
        handleShowSelectPolicyPopup(false);
      }}
    >
      <div className="vida-select-policy-new__container">
        <ReactTooltip place="bottom" type="dark" effect="solid" />

        <div className="vida-select-policy-new__header">
          <div>
            <span className="vida-select-policy-new__title">
              {insurancePremiumList.length || ""} {title}
            </span>
            <span className="vida-select-policy-new__description">
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
          <picture className="vida-select-policy-new__logo-lg">
            <img src={logoURL} alt="logo" />
          </picture>
        </div>

        {addonsList.length > 0 && (
          <div className="vida-select-policy-new__add-on">
            {!isDesktop && showAddOnListSm && (
              <div className="vida-select-policy-new__add-on-container"></div> //for blured background -mobileview dropdown
            )}
            <p
              className="vida-select-policy-new__add-on-title"
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
            <div className="vida-select-policy-new__add-on-wrapper">
              {!isDesktop && showAddOnListSm && (
                <AddOnListSm
                  addOnOptions={addonsList}
                  addOnBtn={addOnBtn}
                  updateOnBtn={updateOnBtn}
                  numOfAddOnSelected={numOfAddOnSelected}
                  handleAddOnSmSelect={handleAddOnSmSelect}
                  handleAddCover={handleAddCover}
                  checkboxRefArr={checkboxRefArr}
                  resetBtn={resetBtn}
                  isEnableReset={isAddOnChanged}
                  insuranceAddonsList={insuranceAddonsList}
                />
              )}
              {isDesktop && (
                <AddOnList
                  addOnOptions={addonsList}
                  insuranceAddonsList={insuranceAddonsList}
                  handleAddOnSelect={handleAddOnSelect}
                  checkboxRefArr={checkboxRefArr}
                />
              )}
              <div className="vida-select-policy-new__background">
                {insuranceAddonsList.length === 0 ? (
                  <button
                    className="btn btn--secondary"
                    onClick={() => {
                      handleAddCover();
                    }}
                  >
                    {addOnBtn.label}
                  </button>
                ) : (
                  <button
                    className="btn btn--secondary"
                    onClick={() => {
                      handleAddCover();
                    }}
                  >
                    {updateOnBtn.label}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {insurancePremiumList && insurancePremiumList.length > 0 && (
          <div className="vida-select-policy-new__card-list">
            {insurancePremiumList.map((insuranceItem) => {
              return (
                <PolicyCard
                  config={props.config}
                  selectedInsurerId={selectedInsurerId}
                  insuranceItem={insuranceItem}
                  key={insuranceItem.insurancerId}
                  handleSelectPolicy={handleSelectPolicy}
                  handleDeleteSelectedPolicy={handleDeleteSelectedPolicy}
                />
              );
            })}
          </div>
        )}

        <picture className="vida-select-policy-new__logo">
          <img src={logoURL} alt="Policy Logo" />
        </picture>
      </div>
    </Popup>
  );
};

export const EmptyPolicyPopupNew = ({
  handleShowSelectPolicyPopup,
  config
}) => {
  const { noResponseModel } = config;
  return (
    <Popup
      mode="medium"
      handlePopupClose={() => {
        handleShowSelectPolicyPopup(false);
      }}
    >
      <h3 className="vida-select-policy-new__empty-model-title">
        {noResponseModel.title}
      </h3>
      <p className="vida-select-policy-new__empty-model-description">
        {noResponseModel.description}
      </p>
      <div className="vida-select-policy-new__empty-model-btn-wrapper">
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

SelectPolicyNew.propTypes = {
  config: PropTypes.object,
  addonsList: PropTypes.array,
  insuranceAddonsList: PropTypes.array,
  isCpaOpted: PropTypes.bool,
  selectedInsurerId: PropTypes.string,
  insurancePremiumList: PropTypes.array,
  handleShowSelectPolicyPopup: PropTypes.func,
  handleSelectPolicy: PropTypes.func,
  handleDeleteSelectedPolicy: PropTypes.func,
  setShowCoverCheckPopup: PropTypes.func,
  isAddonTriggered: PropTypes.bool,
  isAddonUpdated: PropTypes.bool,
  setIsUpdateAddon: PropTypes.func,
  setIsAddonTriggered: PropTypes.func,
  setIsAddPolicy: PropTypes.func
};

AddOnList.propTypes = {
  addOnOptions: PropTypes.array,
  insuranceAddonsList: PropTypes.array,
  handleAddOnSelect: PropTypes.func,
  checkboxRefArr: PropTypes.array
};

AddOnListSm.propTypes = {
  addOnOptions: PropTypes.array,
  handleAddOnSmSelect: PropTypes.func,
  handleAddCover: PropTypes.func,
  addOnBtn: PropTypes.object,
  updateOnBtn: PropTypes.object,
  resetBtn: PropTypes.object,
  numOfAddOnSelected: PropTypes.number,
  checkboxRefArr: PropTypes.array,
  isEnableReset: PropTypes.bool,
  insuranceAddonsList: PropTypes.array
};

PolicyCard.propTypes = {
  config: PropTypes.any,
  selectedInsurerId: PropTypes.string,
  insuranceItem: PropTypes.any,
  addOnList: PropTypes.array,
  handleSelectPolicy: PropTypes.func,
  handleDeleteSelectedPolicy: PropTypes.func
};

EmptyPolicyPopupNew.propTypes = {
  config: PropTypes.any,
  handleShowSelectPolicyPopup: PropTypes.func
};

export default SelectPolicyNew;
