import React from "react";
import PropTypes from "prop-types";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
const AboutFame = (props) => {
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const { fameConfig } = props;
  const { title, intro, description, aboutFame } = fameConfig;

  const handleAboutFameUrl = (e) => {
    e.preventDefault();
    if (isAnalyticsEnabled) {
      const customLink = {
        name: e.target.innerText,
        position: "Bottom",
        type: "Link",
        clickType: "exit"
      };
      const additionalPageName = "";
      const additionalJourneyName = "";
      analyticsUtils.trackCtaClick(
        customLink,
        additionalPageName,
        additionalJourneyName,
        function () {
          window.location.href = e.target.href;
        }
      );
    }
    onShowPopup && onShowPopup(true);
  };

  return (
    <div className="vida-fame-details">
      <h1 className="vida-fame-details__title">{title}</h1>
      <p className="vida-fame-details__intro">{intro}</p>
      <p className="vida-fame-details__description">{description}</p>
      <div>
        <a
          className="vida-aadhar-details__learn-more"
          target="_blank"
          href={aboutFame.actionUrl}
          onClick={(e) => {
            handleAboutFameUrl(e);
          }}
          rel="noreferrer noopener"
        >
          {aboutFame.label}
        </a>
      </div>
    </div>
  );
};
AboutFame.propTypes = {
  fameConfig: PropTypes.shape({
    intro: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    aboutFame: PropTypes.shape({
      label: PropTypes.string,
      actionUrl: PropTypes.string
    })
  })
};

export default AboutFame;
