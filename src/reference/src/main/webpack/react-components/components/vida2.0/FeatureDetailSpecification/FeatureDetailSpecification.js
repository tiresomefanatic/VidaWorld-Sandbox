import React from "react";
import PropTypes from "prop-types";
import breakpoints from "../../../../site/scripts/media-breakpoints";

const FeatureDetailSpecification = ({ config }) => {
  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;
  const isTablet = window.matchMedia(
    breakpoints.mediaExpression.tablet
  ).matches;
  const { preTitle, title, description, imageStore, specificationContent } =
    config;

  return (
    <div className="feature-details-specification-container vida-2-container">
      <div className="feature-details-specification-container__header-container">
        <p className="pre-title">{preTitle}</p>
        <p className="title">{title}</p>
      </div>
      <div className="image-detail-specification-container">
        <div className="image-detail-specification-container__image-layout">
          {imageStore.map((image, index) => (
            <div className="img-container" key={index}>
              <img
                className={`img-${index + 1}`}
                src={isTablet ? image.imgDesktop : image?.imgMobile}
                alt={image?.altName}
                title={image?.imgTitle}
                aria-label={image?.altName}
                loading="lazy"
              />
            </div>
          ))}
        </div>
        <div className="description-specification-wrapper">
          <div
            className="description-specification-wrapper__details-container"
            dangerouslySetInnerHTML={{
              __html: description
            }}
          ></div>
          {specificationContent.map((content, index) => (
            <div
              className="description-specification-wrapper__specifications-container"
              key={index}
            >
              <div className="icon-container">
                <img
                  src={
                    isDesktop ? content?.iconImgDesktop : content?.iconImgMobile
                  }
                  loading="lazy"
                  alt={content?.altName}
                  title={content?.imgTitle}
                  aria-label={content?.altName}
                />
              </div>
              <div className="content-container">
                <p className="title">{content?.title}</p>
                <p
                  className="description"
                  dangerouslySetInnerHTML={{
                    __html: content?.description
                  }}
                ></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureDetailSpecification;

FeatureDetailSpecification.propTypes = {
  config: PropTypes.shape({
    preTitle: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    imageStore: PropTypes.arrayOf(
      PropTypes.shape({
        imgMobile: PropTypes.string,
        imgDesktop: PropTypes.string,
        altName: PropTypes.string
      })
    ),
    specificationContent: PropTypes.arrayOf(
      PropTypes.shape({
        iconImgMobile: PropTypes.string,
        iconImgDesktop: PropTypes.string,
        altName: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string
      })
    )
  })
};
