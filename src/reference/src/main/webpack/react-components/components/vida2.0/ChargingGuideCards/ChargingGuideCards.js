import React from "react";
import PropTypes from "prop-types";
import breakpoints from "../../../../site/scripts/media-breakpoints";

const ChargingGuideCards = ({ chargingCardData }) => {
  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;

  return (
    <div className="charge-guide__container vida-2-container">
      {chargingCardData?.map((item, index) => (
        <div className="charge-guide__wrapper" key={item.title + index}>
          <div className="charge-guide__top-image">
            <img
              src={isDesktop ? item.desktopImg : item.mobileImg}
              alt={item?.imagealttext}
              title={item?.imageTitle}
              loading="lazy"
            ></img>
          </div>
          <div className="charge-guide__details-wrapper">
            <div className="charging-guide-details-primary-container">
              <div className="charge-guide__title">
                <p className="charge-guide__title-label">{item.title}</p>
              </div>
              <div className="charge-guide__desc">
                <p className="charge-guide__desc-label">{item.description}</p>
              </div>
            </div>
            <div className="charging-guide-details-secondary-container">
              <div className="charge-guide__offer">
                <p className="charge-guide__offer-label">{item.offerLabel}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChargingGuideCards;

ChargingGuideCards.propTypes = {
  chargingCardData: PropTypes.arrayOf(PropTypes.any),
  headerLabel: PropTypes.string
};
