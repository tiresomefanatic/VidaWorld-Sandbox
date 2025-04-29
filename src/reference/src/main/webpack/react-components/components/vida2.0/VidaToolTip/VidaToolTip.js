import React, { useEffect, useState } from "react";
import ReactTooltip from "react-tooltip";
import PropTypes from "prop-types";
import appUtils from "../../../../site/scripts/utils/appUtils";

const VidaToolTip = ({ index, componentName, extraClassName }) => {
  const [tooltipData, setTooltipData] = useState("");
  const [tooltipIcon, setTooltipIcon] = useState("");
  const fallbackTooltipData =
    "*Price is inclusive of portable charger, FAME II subsidy and state government subsidy (Wherever applicable).";

  useEffect(() => {
    const dataElement = document?.getElementById("tooltip-data");
    const tooltipDataAttribute = dataElement?.getAttribute("data-tooltip");
    const tooltipIconAttribute = dataElement?.getAttribute("data-tooltip-icon");
    setTooltipData(tooltipDataAttribute || "");
    setTooltipIcon(tooltipIconAttribute || "");
  }, []);

  return (
    <span className={`global-tooltip ${extraClassName || ""}`}>
      <img
        src={
          tooltipIcon ||
          appUtils.getConfig("resourcePath") + "images/svg/tooltip-icon.svg"
        }
        data-tip
        data-for={`${componentName || "tooltip"}-${index || 0}`}
        alt={`${componentName || "tooltip"}-${index || 0}`}
      ></img>
      <ReactTooltip
        id={`${componentName || "tooltip"}-${index || 0}`}
        place="top"
        effect="solid"
      >
        {tooltipData || fallbackTooltipData}
      </ReactTooltip>
    </span>
  );
};

export default VidaToolTip;

VidaToolTip.propTypes = {
  index: PropTypes.number,
  componentName: PropTypes.string,
  extraClassName: PropTypes.string
};
