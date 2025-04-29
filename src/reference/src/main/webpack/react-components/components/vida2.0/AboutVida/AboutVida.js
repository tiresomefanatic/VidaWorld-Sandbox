import React, { useState } from "react";
import PropTypes from "prop-types";
import AboutVidaCard from "../AboutVidaCard/AboutVidaCard";
import { useIntersectionObserver } from "../../../hooks/IntersectionObserver/IntersectionObserver";

const AboutVida = (props) => {
  const { config } = props;
  const [isActiveIndex, setIsActiveIndex] = useState(0);
  const handleTabSwitch = (index) => {
    setIsActiveIndex(index);
  };

  // intersection observer
  const { ref: aboutVidaContainerRef, isVisible: aboutVidaContainerVisible } =
    useIntersectionObserver(0.1);

  return (
    <div className="about-vida-wrapper vida-2-container">
      <div
        className="about-vida-container"
        ref={aboutVidaContainerRef}
        style={{ opacity: aboutVidaContainerVisible ? 1 : 0 }}
      >
        <p className="about-vida-text">{config.aboutVidaText}</p>
        <h3 className="about-vida-title">{config.aboutVidaTitle}</h3>
        <div className="about-vida-content-container">
          <div className="about-vida-tab-container">
            {config.aboutVidaTabContent?.map((item, index) => (
              <a
                className={
                  isActiveIndex === index
                    ? "about-vida-tab active-tab"
                    : "about-vida-tab"
                }
                key={index}
                onClick={() => handleTabSwitch(index)}
              >
                {item.tabTitle}
              </a>
            ))}
          </div>
          <div className="about-vida-tab-content-container">
            <div className="about-vida-tab-content-title">
              <h3>
                {config.aboutVidaTabContent[isActiveIndex]?.tabContentTitle}
              </h3>
            </div>
            <div className="about-vida-tab-content-description">
              <p
                dangerouslySetInnerHTML={{
                  __html:
                    config.aboutVidaTabContent[isActiveIndex]
                      ?.tabContentDescription
                }}
              ></p>
            </div>
            <div className="about-vida-tab-card-container">
              <AboutVidaCard
                dataPosition={config.dataPosition}
                aboutVidaCardContent={
                  config.aboutVidaTabContent[isActiveIndex]?.tabCardContent
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutVida;

AboutVida.propTypes = {
  config: PropTypes.shape({
    dataPosition: PropTypes.string,
    aboutVidaTabContent: PropTypes.arrayOf(PropTypes.any),
    aboutVidaText: PropTypes.string,
    aboutVidaTitle: PropTypes.string
  })
};
