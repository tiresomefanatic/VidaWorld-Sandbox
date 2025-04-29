import React from "react";
import PropTypes from "prop-types";
import Accordian from "../Accordian/Accordian";
import { useIntersectionObserver } from "../../../hooks/IntersectionObserver/IntersectionObserver";

const VidaService = (props) => {
  const {
    dataPosition,
    accordianData,
    infoContent,
    darkTheme,
    defaultOpenIndex,
    isHeader,
    subTitle,
    title,
    headerImageMobile,
    headerImageDesktop,
    altHeaderImageText,
    headerImageTitle,
    variantTwo
  } = props.config;

  // intersection observer
  const {
    ref: collapsableInfoDarkContainerRef,
    isVisible: collapsableInfoDarkContainerVisible
  } = useIntersectionObserver();

  const {
    ref: collapsableInfoLightContainerRef,
    isVisible: collapsableInfoLightContainerVisible
  } = useIntersectionObserver();

  const HeadingTag = window.location.pathname.includes("vida-v1")
    ? "h2"
    : window.location.pathname.includes("product")
    ? darkTheme
      ? "h3"
      : "span"
    : "span";

  return (
    <div
      className="vida-service-container"
      ref={
        darkTheme
          ? collapsableInfoDarkContainerRef
          : collapsableInfoLightContainerRef
      }
      style={{
        opacity: darkTheme
          ? collapsableInfoDarkContainerVisible
            ? 1
            : 0
          : collapsableInfoLightContainerVisible
          ? 1
          : 0
      }}
    >
      {isHeader && (
        <div className="vida-service vida-2-container">
          <>
            {infoContent.subheading && (
              <p className="vida-service-title">{infoContent.subheading}</p>
            )}
            {infoContent.title && (
              <HeadingTag className="vida-service-quote">
                {infoContent.title}
              </HeadingTag>
            )}
            {infoContent.helperText && (
              <p className="vida-service-helper-text">
                {infoContent.helperText}
              </p>
            )}
          </>
        </div>
      )}
      <div
        className={`vida-service-accordion ${
          darkTheme ? "dark-theme" : "light-theme"
        }`}
        style={{
          backgroundImage: `url(${
            infoContent.image ? infoContent.image : "none"
          })`
        }}
      >
        <div
          className={`vida-service-accordion-wrapper vida-2-container ${
            darkTheme ? "dark-theme" : "light-theme"
          }`}
        >
          <Accordian
            dataPosition={dataPosition}
            accordianData={accordianData?.accordianContent}
            defaultOpenIndex={defaultOpenIndex}
            darkTheme={darkTheme}
            subTitle={subTitle}
            title={title}
            headerImageMobile={headerImageMobile}
            headerImageDesktop={headerImageDesktop}
            altHeaderImageText={altHeaderImageText}
            headerImageTitle={headerImageTitle}
            variantTwo={variantTwo}
          />
        </div>
      </div>
    </div>
  );
};

export default VidaService;
VidaService.propTypes = {
  config: PropTypes.shape({
    dataPosition: PropTypes.string,
    accordianData: PropTypes.shape({
      accordianContent: PropTypes.arrayOf(PropTypes.any),
      expandIcon: PropTypes.string,
      closeIcon: PropTypes.string
    }),
    infoContent: PropTypes.shape({
      title: PropTypes.string,
      subheading: PropTypes.string,
      helperText: PropTypes.string,
      image: PropTypes.string
    }),
    darkTheme: PropTypes.bool,
    defaultOpenIndex: PropTypes.number,
    isHeader: PropTypes.bool,
    subTitle: PropTypes.string,
    title: PropTypes.string,
    headerImageMobile: PropTypes.string,
    headerImageDesktop: PropTypes.string,
    altHeaderImageText: PropTypes.string,
    headerImageTitle: PropTypes.string,
    variantTwo: PropTypes.bool
  })
};
