import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import breakpoints from "../../../../site/scripts/media-breakpoints";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";

const AboutHeroCard = ({ config }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const {
    preTitle,
    description,
    titleTag,
    title,
    imageAlt,
    URL,
    titleTag2,
    ctaText,
    videoUrl,
    heroIcon,
    playIconMob,
    playIconDesk,
    pauseIconMob,
    pauseIconDesk,
    altIconText,
    readMoreIcon
  } = config;
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();

  const ctaTracking = (e) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        ctaText: e.target.innerText,
        ctaLocation: e.target.dataset.linkPosition
      };
      analyticsUtils.trackCTAClicksVida2(customLink, "ctaButtonClick");
    }
  };

  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;

  const handlePlayToggle = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const playIcon = isDesktop ? playIconDesk : playIconMob;
  const pauseIcon = isDesktop ? pauseIconDesk : pauseIconMob;

  const CustomTitleTag = titleTag || "p";
  const CustomTitle2Tag = titleTag2 || "p";

  return (
    <div className="about-hero-card-parent-container vida-2-container">
      <div className="about-hero-card-parent-container__header-container">
        {preTitle !== " " && (
          <CustomTitle2Tag className="pre-title">{preTitle}</CustomTitle2Tag>
        )}

        <div className="hero-icon-header-wrapper">
          <CustomTitleTag className="title">{title}</CustomTitleTag>
          <div className="hero-icon-container">
            <img src={heroIcon} alt="hero-icon" aria-label="hero-icon" />
          </div>
        </div>
      </div>
      <div className="video-content-wrapper">
        {videoUrl && (
          <div className="video-content-wrapper__video">
            <video
              ref={videoRef}
              muted
              loop
              autoPlay={isPlaying}
              playsInline
              src={videoUrl}
            ></video>
            <div className="play-button-container">
              <img
                title={imageAlt}
                className="play-button"
                alt={altIconText}
                src={isPlaying ? pauseIcon : playIcon}
                onClick={handlePlayToggle}
              />
            </div>
          </div>
        )}
      </div>
      {description && (
        <div className="about-hero-description-container-left">
          <div
            dangerouslySetInnerHTML={{
              __html: description
            }}
          ></div>
        </div>
      )}
      <div className="read-icon-header-wrapper">
        {ctaText && (
          <a className="cta-link" href={URL} onClick={(e) => ctaTracking(e)}>
            <p className="cta-text">{ctaText}</p>
          </a>
        )}
        <div className="read-icon-container">
          <img src={readMoreIcon} alt="read-icon" title="read-icon"></img>
        </div>
      </div>
    </div>
  );
};

export default AboutHeroCard;

AboutHeroCard.propTypes = {
  config: PropTypes.shape({
    preTitle: PropTypes.string,
    description: PropTypes.string,
    titleTag: PropTypes.string,
    title: PropTypes.string,
    imageAlt: PropTypes.string,
    URL: PropTypes.string,
    titleTag2: PropTypes.string,
    ctaText: PropTypes.string,
    videoUrl: PropTypes.string,
    heroIcon: PropTypes.string,
    playIconMob: PropTypes.string,
    playIconDesk: PropTypes.string,
    pauseIconMob: PropTypes.string,
    pauseIconDesk: PropTypes.string,
    altIconText: PropTypes.string,
    readMoreIcon: PropTypes.string
  })
};
