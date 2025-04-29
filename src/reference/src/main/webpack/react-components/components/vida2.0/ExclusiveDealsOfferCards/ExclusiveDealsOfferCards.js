import React from "react";
import PropTypes from "prop-types";
import Love from "../Love/Love";
import ExclusiveDeals from "../ExclusiveDeals/ExclusiveDeals";
import breakpoints from "../../../../site/scripts/media-breakpoints";

const ExclusiveDealsOfferCards = ({ config }) => {
  const isTablet = window.matchMedia(
    breakpoints.mediaExpression.tablet
  ).matches;

  const {
    redirectionCardConfig,
    redirectionCardHeader,
    redirectionCardLabel,
    dealsCardsContent,
    primaryText,
    boldText,
    seeMoreText,
    seeLessText
  } = config;

  return (
    <div className="exclusive-deals-card-container">
      {!isTablet ? (
        <div className="exclusive-deals-card-container__mobile-component">
          <Love
            config={{
              redirectionCardConfig,
              redirectionCardHeader,
              redirectionCardLabel
            }}
          />
        </div>
      ) : (
        <div className="exclusive-deals-card-container__desktop-component">
          <ExclusiveDeals
            config={{
              dealsCardsContent,
              primaryText,
              boldText,
              seeMoreText,
              seeLessText
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ExclusiveDealsOfferCards;

ExclusiveDealsOfferCards.propTypes = {
  config: PropTypes.shape({
    redirectionCardLabel: PropTypes.string,
    redirectionCardHeader: PropTypes.string,
    redirectionCardConfig: PropTypes.string,
    dealsCardsContent: PropTypes.arrayOf(PropTypes.any),
    primaryText: PropTypes.string,
    boldText: PropTypes.string,
    seeMoreText: PropTypes.string,
    seeLessText: PropTypes.string
  })
};
