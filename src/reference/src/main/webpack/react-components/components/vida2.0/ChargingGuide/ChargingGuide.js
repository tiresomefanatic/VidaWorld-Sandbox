import React from "react";
import PropTypes from "prop-types";
import HorizontalScroll from "../HorizontalScroll/HorizontalScroll";
import ChargingGuideCards from "../ChargingGuideCards/ChargingGuideCards";
import { useIntersectionObserver } from "../../../hooks/IntersectionObserver/IntersectionObserver";
const ChargingGuide = (props) => {
  const { config } = props;

  // intersection observer
  const {
    ref: chargingGuideContainerRef,
    isVisible: chargingGuideContainerVisible
  } = useIntersectionObserver();

  return (
    <div
      className="charging-guide"
      ref={chargingGuideContainerRef}
      style={{ opacity: chargingGuideContainerVisible ? 1 : 0 }}
    >
      <h3 className="charging-guide__header vida-2-container">
        {config.header}
      </h3>
      <HorizontalScroll>
        <ChargingGuideCards
          chargingCardData={config.ChargingGuideCardContent}
        />
      </HorizontalScroll>
    </div>
  );
};
export default ChargingGuide;
ChargingGuide.propTypes = {
  config: PropTypes.shape({
    ChargingGuideCardContent: PropTypes.arrayOf(PropTypes.any),
    header: PropTypes.string
  })
};
