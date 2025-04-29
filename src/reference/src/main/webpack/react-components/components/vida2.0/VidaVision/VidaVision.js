import React from "react";
import PropTypes from "prop-types";
import breakpoints from "../../../../site/scripts/media-breakpoints";

const VidaVision = ({ config }) => {
  const {
    heading,
    subHeading,
    backgroundImage,
    infoContent,
    description,
    title,
    bgColor
  } = config;
  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;

  return (
    <div
      className="vida-vision vida-2-container"
      style={{
        backgroundImage: `url(${!isDesktop ? backgroundImage : ""})`,
        backgroundColor: `${bgColor ? bgColor : "white"}`
      }}
    >
      <div className="text-container">
        <div className="title">{heading}</div>
        <p
          className="sub-title"
          dangerouslySetInnerHTML={{
            __html: subHeading
          }}
        ></p>
      </div>
      <div className="detail-specification-container">
        <div className="vision-container">
          <div className="description-container"></div>
          <div className="gallery-container">
            <img
              className="img img__one"
              src={infoContent[0].image}
              alt={infoContent[0].helperText}
              title={infoContent[0].title}
            ></img>
            <img
              className="img img__three"
              src={infoContent[2].image}
              alt={infoContent[2].helperText}
              title={infoContent[2].title}
            ></img>
            <img
              className="img img__two"
              src={infoContent[1].image}
              alt={infoContent[1].helperText}
              title={infoContent[1].title}
            ></img>
          </div>
        </div>
        <div className="description-wrapper">
          <div className="header">{title}</div>
          <div
            className="details"
            dangerouslySetInnerHTML={{
              __html: description
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default VidaVision;

VidaVision.propTypes = {
  config: PropTypes.shape({
    bgColor: PropTypes.string,
    title: PropTypes.string,
    heading: PropTypes.string,
    subHeading: PropTypes.string,
    backgroundImage: PropTypes.string,
    description: PropTypes.string,
    infoContent: PropTypes.shape([
      {
        title: PropTypes.string,
        helperText: PropTypes.string,
        image: PropTypes.string
      }
    ])
  })
};
