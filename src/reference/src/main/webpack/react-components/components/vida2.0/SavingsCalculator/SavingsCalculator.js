import React, { useState } from "react";
import PropTypes from "prop-types";
import breakpoints from "../../../../site/scripts/media-breakpoints";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";

const SavingsCalculator = ({ config }) => {
  const {
    bgImageDesktop,
    bgImageMobile,
    bgImageTitle,
    bgImageAltText,
    title,
    questionText,
    totalSavingsText,
    savingsCardTextMonthly,
    savingsCardTextYearly,
    cardBgImgMobile,
    cardBgImgDesktop,
    cardBgImgAlt,
    cardBgImgTitle,
    impactTitle,
    impactBgImageMob,
    impactBgImageAlt,
    impactBgImageTitle,
    impactCardText1,
    impactCardText2,
    savingsComparisonText,
    evBenefitsText,
    fuelText,
    evText,
    carbonUnit,
    assumptionsContent,
    assumptionsTitle,
    arrowIconDesk,
    arrowIconMob,
    arrowIconAlt,
    arrowIconTitle,
    btnLabel,
    redirectUrl
  } = config;

  const [sliderValue, setSliderValue] = useState(10);
  const [accordianClicked, setAccordianClicked] = useState(false);

  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;

  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();

  const handleButtonClick = (event) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        ctaText: event?.target?.innerText,
        ctaLocation: "bottom"
      };
      const pageName = "Savings Calculator";
      analyticsUtils.trackCTAClicksVida2(
        customLink,
        "ctaButtonClick",
        "",
        pageName
      );
    }
    window.location.href = redirectUrl;
  };

  const handleSliderChange = (event) => {
    setSliderValue(event.target.value);
    const valueDisplay = document.getElementsByClassName("distance-value");
    const value =
      ((event.target.value - event.target.min) /
        (event.target.max - event.target.min)) *
      100;
    event.target.style.background =
      "linear-gradient(to right, #ff5310 0%, #ff5310 " +
      value +
      "%, #ccc " +
      value +
      "%, #ccc 100%)";
    valueDisplay.textContent = event.target.value;
    if (value > 94) {
      valueDisplay[0].style.left = "94%";
    } else if (value < 3) {
      valueDisplay[0].style.left = "3%";
    } else {
      valueDisplay[0].style.left = value + "%";
    }
  };

  const handleContainerClick = () => {
    setAccordianClicked(!accordianClicked);
  };

  return (
    <div className="savings-calculator-container">
      <div className="bg-img-container">
        <img
          src={isDesktop ? bgImageDesktop : bgImageMobile}
          alt={bgImageAltText}
          title={bgImageTitle}
        />
      </div>
      <div className="savings-calculator-wrapper">
        <div className="savings-calculator-container__title-container">
          <h1 className="title-text">{title}</h1>
        </div>
        <div className="savings-calculator-container__distance-range-container">
          <p className="question-text">{questionText}</p>
          <div className="slider-container">
            <p className="distance-value">{sliderValue} kms</p>
            <input
              type="range"
              min="1"
              max="100"
              className="slider"
              id="myRange"
              value={sliderValue}
              onChange={handleSliderChange}
            />
            <div className="slider-divisions">
              <span>0</span>
              <span>20</span>
              <span>40</span>
              <span>60</span>
              <span>80</span>
              <span>100</span>
            </div>
          </div>
        </div>
        <div className="savings-graph-container">
          <div className="savings-graph-container__total-savings-cards-container">
            <h2 className="yours-savings-text">{totalSavingsText}</h2>

            <div className="savings-card-container">
              <div className="bg-img-container">
                <img
                  src={isDesktop ? cardBgImgDesktop : cardBgImgMobile}
                  alt={cardBgImgAlt}
                  title={cardBgImgTitle}
                />
              </div>
              <div className="text-container">
                <h3>
                  {savingsCardTextMonthly}
                  <span>
                    {Math.round(2.5 * sliderValue * 30) -
                      Math.round(0.18 * sliderValue * 30)}
                    {" per month!"}
                  </span>
                </h3>
              </div>
            </div>
            <div className="savings-card-container">
              <div className="bg-img-container">
                <img
                  src={isDesktop ? cardBgImgDesktop : cardBgImgMobile}
                  alt={cardBgImgAlt}
                  title={cardBgImgTitle}
                />
              </div>
              <div className="text-container">
                <h3>
                  {savingsCardTextYearly}
                  <span>
                    {Math.round(2.5 * sliderValue * 30 * 12) -
                      Math.round(0.18 * sliderValue * 30 * 12)}
                    {" per year!"}
                  </span>
                </h3>
              </div>
            </div>
          </div>
          <div className="savings-calculator-container__vida-impact-container savings-calculator-container__vida-impact-container-mob">
            <div className="impact-title-container">
              <p>{impactTitle}</p>
            </div>

            <div className="impact-card-container">
              <div className="img-container">
                <img
                  src={impactBgImageMob}
                  alt={impactBgImageAlt}
                  title={impactBgImageTitle}
                />
              </div>
              <div className="text-container">
                <h3>
                  {impactCardText1}
                  <span>{Math.round(29 * sliderValue * 365) / 1000}</span>
                  {impactCardText2}
                </h3>
              </div>
            </div>
          </div>
          <div className="graph-wrapper">
            <div className="graph-header-container">
              <h2 className="header-text">{savingsComparisonText}</h2>
            </div>
            <div className="savings-graph-container__graph-container">
              <div className="ev-benefits-container">
                <h3 className="ev-benefits-text">
                  {evBenefitsText}
                  <span>{Math.round(29 * sliderValue * 365) / 1000}</span>
                </h3>
              </div>
              <div className="fuel-ev-graph-text-container">
                <div className="fuel-text-container">
                  <p className="fuel-text">{fuelText}</p>
                  <p className="value-and-unit">
                    {Math.round((53 * sliderValue * 365) / 1000)}
                    {carbonUnit}
                  </p>
                </div>
                <div className="fuel-ev-graph-wrapper">
                  <div className="fuel-graph"></div>
                  <div className="ev-graph"></div>
                </div>
                <div className="ev-text-container">
                  <p className="ev-text">{evText}</p>
                  <p className="value-and-unit">
                    {Math.round((29 * sliderValue * 365) / 1000)}
                    {carbonUnit}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="savings-calculator-container__assumptions-container">
          <div
            className="header-container"
            onClick={() => {
              handleContainerClick();
            }}
          >
            <div className="title-container">
              <h2>{assumptionsTitle}</h2>
            </div>
            <div className="arrow-img-container">
              <img
                className={`drop-down-icon ${accordianClicked ? "open" : ""}`}
                src={isDesktop ? arrowIconDesk : arrowIconMob}
                alt={arrowIconAlt}
                title={arrowIconTitle}
              />
            </div>
          </div>
          {accordianClicked && (
            <div className="assumption-content-container">
              <div className="content-container">
                <div
                  className="content-container__content"
                  dangerouslySetInnerHTML={{
                    __html: assumptionsContent
                  }}
                ></div>
              </div>
            </div>
          )}

          <div className="button-container">
            <button onClick={() => handleButtonClick(event)}>{btnLabel}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

SavingsCalculator.propTypes = {
  config: PropTypes.shape({
    bgImageDesktop: PropTypes.string,
    bgImageMobile: PropTypes.string,
    bgImageAltText: PropTypes.string,
    bgImageTitle: PropTypes.string,
    title: PropTypes.string,
    questionText: PropTypes.string,
    totalSavingsText: PropTypes.string,
    savingsCardTextMonthly: PropTypes.string,
    savingsCardTextYearly: PropTypes.string,
    cardBgImgMobile: PropTypes.string,
    cardBgImgDesktop: PropTypes.string,
    cardBgImgAlt: PropTypes.string,
    cardBgImgTitle: PropTypes.string,
    impactTitle: PropTypes.string,
    impactBgImageMob: PropTypes.string,
    impactBgImageAlt: PropTypes.string,
    impactBgImageTitle: PropTypes.string,
    impactCardText1: PropTypes.string,
    impactCardText2: PropTypes.string,
    savingsComparisonText: PropTypes.string,
    evBenefitsText: PropTypes.string,
    fuelText: PropTypes.string,
    evText: PropTypes.string,
    carbonUnit: PropTypes.string,
    assumptionsContent: PropTypes.string,
    assumptionsTitle: PropTypes.string,
    arrowIconDesk: PropTypes.string,
    arrowIconMob: PropTypes.string,
    arrowIconAlt: PropTypes.string,
    arrowIconTitle: PropTypes.string,
    btnLabel: PropTypes.string,
    redirectUrl: PropTypes.string
  })
};

export default SavingsCalculator;
