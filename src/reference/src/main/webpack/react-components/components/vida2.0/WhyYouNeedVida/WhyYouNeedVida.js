import React, { useState } from "react";
import PropTypes from "prop-types";
import { useIntersectionObserver } from "../../../hooks/IntersectionObserver/IntersectionObserver";

const WhyYouNeedVida = (props) => {
  const { config } = props;
  const [isActiveIndex, setIsActiveIndex] = useState(0);

  const handleTabSwitch = (index) => {
    setIsActiveIndex(index);
  };

  // intersection observer
  const {
    ref: whyYouNeedVidaContainerRef,
    isVisible: whyYouNeedVidaContainerVisible
  } = useIntersectionObserver();

  return (
    <div
      className="need-vida-wrapper vida-2-container"
      ref={whyYouNeedVidaContainerRef}
      style={{ opacity: whyYouNeedVidaContainerVisible ? 1 : 0 }}
    >
      <div className="need-vida-container">
        <div className="need-vida-title-container">
          <p className="need-vida-title">{config?.title}</p>
        </div>
        <div className="need-vida-content-container">
          <div className="need-vida-tab-pt-container">
            <div className="need-vida-tab-container">
              {config?.tabContent?.map((item, index) => (
                <div
                  className={
                    isActiveIndex === index
                      ? "need-vida-tab active-tab"
                      : "need-vida-tab"
                  }
                  key={index}
                  onClick={() => handleTabSwitch(index)}
                >
                  <p className="need-vida-tab-title">{item?.tabTitle}</p>
                </div>
              ))}
            </div>
            <div className="need-vida-tab-content-container">
              <div className="need-vida-tab-description">
                <p className="need-vida-tab-description-text">
                  {config?.tabContent[isActiveIndex]?.tabDescription}
                </p>
              </div>
              <div className="need-vida-tab-cta-link">
                <a
                  href={config?.tabContent[isActiveIndex]?.tabCtaNavLink}
                  target={
                    config?.tabContent[isActiveIndex]?.newTab
                      ? "_blank"
                      : "_self"
                  }
                  className="need-vida-tab-cta-link-text"
                  rel="noreferrer"
                >
                  {config?.tabContent[isActiveIndex]?.tabCtaLabel}
                </a>
              </div>
            </div>
          </div>
          <div className="need-vida-details-container">
            <div className="need-vida-details-list">
              {config?.tabContent?.map((item, index) => (
                <div className="need-vida-details-item" key={index}>
                  <div className="need-vida-details-title-container">
                    <div className="need-vida-details-title-icon">
                      <img src={item?.tabIcon} alt={item?.altText}></img>
                    </div>
                    <div className="need-vida-details-title">
                      <p className="need-vida-details-title-text">
                        {item?.tabTitle}
                      </p>
                    </div>
                  </div>
                  <div className="need-vida-details-content-container">
                    <div className="need-vida-details-description">
                      <p className="need-vida-details-description-text">
                        {item?.tabDescription}
                      </p>
                    </div>
                    <div className="need-vida-details-cta-link">
                      <a
                        href={item?.tabCtaNavLink}
                        target={item?.newTab ? "_blank" : "_self"}
                        className="need-vida-details-cta-link-text"
                        rel="noreferrer"
                      >
                        {item?.tabCtaLabel}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyYouNeedVida;

WhyYouNeedVida.propTypes = {
  config: PropTypes.shape({
    title: PropTypes.string,
    tabContent: PropTypes.arrayOf(PropTypes.any)
  })
};
