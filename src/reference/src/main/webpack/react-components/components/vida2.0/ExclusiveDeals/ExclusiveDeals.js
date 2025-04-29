import React from "react";
import PropTypes from "prop-types";
import DealsCards from "../DealsCards/DealsCards";

const ExclusiveDeals = (props) => {
  const { config } = props;
  const pagePath = window.location.pathname;

  return (
    <div className="exclusive-deals-wrapper vida-2-container">
      <div className="exclusive-deals-container">
        <div className="exclusive-deals-title-container">
          <p className="exclusive-deals-primary-text">{config?.primaryText}</p>
          {config?.boldText &&
            (pagePath.includes("offer") ? (
              <h2 className="exclusive-deals-bold-text">{config?.boldText}</h2>
            ) : (
              <p className="exclusive-deals-bold-text">{config?.boldText}</p>
            ))}
        </div>
        <div className="exclusive-deals-cards-container">
          <DealsCards
            dealsCardsContent={config?.dealsCardsContent}
            seeMoreText={config?.seeMoreText}
            seeLessText={config?.seeLessText}
          />
        </div>
      </div>
    </div>
  );
};

export default ExclusiveDeals;

ExclusiveDeals.propTypes = {
  config: PropTypes.shape({
    dealsCardsContent: PropTypes.arrayOf(PropTypes.any),
    primaryText: PropTypes.string,
    boldText: PropTypes.string,
    seeMoreText: PropTypes.string,
    seeLessText: PropTypes.string
  })
};
