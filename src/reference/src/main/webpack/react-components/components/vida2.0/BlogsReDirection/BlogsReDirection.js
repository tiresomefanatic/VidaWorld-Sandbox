import React from "react";
import PropTypes from "prop-types";
import breakpoints from "../../../../site/scripts/media-breakpoints";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import { useIntersectionObserver } from "../../../hooks/IntersectionObserver/IntersectionObserver";

const BlogsReDirection = (props) => {
  const { config } = props;
  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;

  // intersection observer
  const {
    ref: blogsReDirectionContainerRef,
    isVisible: blogsReDirectionContainerVisible
  } = useIntersectionObserver();

  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();

  const ctaTracking = (e, text) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        ctaText: text || e?.target?.alt || e?.target?.innerText,
        ctaLocation:
          e?.target?.dataset?.linkPosition ||
          e?.target?.closest("a")?.dataset?.linkPosition
      };
      analyticsUtils.trackCTAClicksVida2(customLink, "ctaButtonClick");
    }
  };
  const HeadingTag =
    window.location.pathname == "/products.html" ? "h3" : "span";

  return (
    <div className="blog-re-direction-wrapper">
      <div
        className="blog-re-direction-container vida-2-container"
        ref={blogsReDirectionContainerRef}
        style={{ opacity: blogsReDirectionContainerVisible ? 1 : 0 }}
      >
        <div className="blog-title-container">
          <HeadingTag className="blog-title">{config.blogTitle}</HeadingTag>
          <div className="blog-re-direction-icon">
            <a
              data-link-position={config.dataPosition || "blogsRedirection"}
              href={config.reDirectNavLink}
              onClick={(e) => ctaTracking(e)}
              target={config.reDirectNewTab ? "_blank" : "_self"}
              rel="noreferrer"
            >
              <img src={config.reDirectionIcon} alt="re_direction_icon"></img>
            </a>
          </div>
        </div>
        <div className="blog-card-wrapper">
          {config.blogCardContent?.map((item, index) => (
            <a
              className="blog-card-container"
              data-link-position={config.dataPosition || "blogsRedirection"}
              href={item.cardNavLink}
              onClick={(e) => ctaTracking(e, item.blogCardDescription)}
              target={item.newTab ? "_blank" : "_self"}
              rel="noreferrer"
              key={index}
            >
              <div
                className={
                  item.isVideo
                    ? "blog-card-media-container img-none"
                    : "blog-card-media-container video-none"
                }
              >
                <img
                  className="blog-card-image"
                  src={
                    isDesktop ? item.blogCardDesktopImg : item.blogCardMobileImg
                  }
                  alt={item?.imageAlt || "blog_card_img"}
                  title={item?.imageTitle}
                  loading="lazy"
                ></img>
                <video
                  className="blog-card-video"
                  src={item.blogCardVideo}
                  autoPlay
                  playsInline
                  muted
                  loop
                ></video>
              </div>
              <div className="blog-card-content-container">
                <div className="blog-card-date">
                  <p>{item.blogCardDate}</p>
                </div>
                <div className="blog-card-description">
                  <p>{item.blogCardDescription}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogsReDirection;

BlogsReDirection.propTypes = {
  config: PropTypes.shape({
    dataPosition: PropTypes.string,
    blogCardContent: PropTypes.arrayOf(PropTypes.any),
    blogTitle: PropTypes.string,
    reDirectionIcon: PropTypes.string,
    reDirectNavLink: PropTypes.string,
    reDirectNewTab: PropTypes.bool
  })
};
