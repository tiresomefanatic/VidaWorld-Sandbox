import React from "react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import appUtils from "../../../../site/scripts/utils/appUtils";
import breakpoints from "../../../../site/scripts/media-breakpoints";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";

const Accordian = ({
  dataPosition,
  accordianData,
  defaultOpenIndex = -1,
  darkTheme,
  isFooter,
  subTitle,
  title,
  headerImageMobile,
  headerImageDesktop,
  altHeaderImageText,
  headerImageTitle,
  variantTwo
}) => {
  const [activeIndex, setActiveIndex] = useState(defaultOpenIndex);
  const [readMore, setReadMore] = useState(true);
  const [isOpenAccordian, setIsOpenAccordian] = useState(true);
  const [isShowExpandIcon, setIsShowExpandIcon] = useState(true);
  const expand = darkTheme
    ? "images/svg/add-icon-white.svg"
    : "images/svg/add-icon.svg";
  const close = darkTheme
    ? "images/svg/minus-icon-white.svg"
    : "images/svg/minus-icon.svg";
  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;

  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();

  useEffect(() => {
    setIsShowExpandIcon(accordianData.length > 1 ? false : true);
  });

  // To add click listener for accordian to open and close
  const handleClick = (index, accordianData) => {
    setActiveIndex(index === activeIndex ? -1 : index);
    if (accordianData.length > 1) {
      setIsOpenAccordian(index === activeIndex ? false : true);
    } else {
      setIsOpenAccordian(true);
    }
  };

  // To toggle read more content
  const readMoreLess = () => {
    setReadMore(!readMore);
  };

  const ctaTracking = (e) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        ctaText: e.target.innerText,
        ctaLocation: e.target.dataset.linkPosition
      };
      analyticsUtils.trackCTAClicksVida2(customLink, "ctaButtonClick");
    }
  };
  //checks based on the feedback/sheet shared by the HERO team.
  // Currently check was purely based on the requirement. need to refactor these
  const HeadingTag = isFooter
    ? "h2"
    : window.location.pathname.includes("products")
    ? darkTheme
      ? "h3"
      : "span"
    : window.location.pathname.includes("vida-v1")
    ? "h3"
    : "span";

  return (
    <div className="accordian-container">
      {variantTwo && (
        <div>
          <div className="accordian-container__title-container">
            <p className="pre-title">{subTitle}</p>
            <p className="title">{title}</p>
          </div>
          <div className="accordian-container__title-container__image">
            <img
              src={isDesktop ? headerImageDesktop : headerImageMobile}
              alt={altHeaderImageText}
              title={headerImageTitle}
              loading="lazy"
            ></img>
          </div>
        </div>
      )}
      {accordianData?.map((item, index) => (
        <div
          className={`accordian-container__wrapper ${
            index === activeIndex ? "active" : ""
          } ${item.videoContent && isDesktop ? "flex-layout" : ""}`}
          key={item.title + index}
        >
          <div className="accordian-container__header-wrapper">
            <button
              onClick={() => handleClick(index, accordianData)}
              className={`accordian-container__header ${
                isOpenAccordian && index !== activeIndex ? "" : ""
              }`}
            >
              <HeadingTag className={`accordian-container__header`}>
                {item.title}
              </HeadingTag>
              <div className="accordian-container__header-icon">
                {
                  <div>
                    {index === activeIndex ? (
                      <img
                        className={`${
                          !isShowExpandIcon
                            ? "accordian-container__close-icon-opacity"
                            : ""
                        }`}
                        src={appUtils.getConfig("resourcePath") + close}
                        alt="minus icon"
                      ></img>
                    ) : (
                      <img
                        src={appUtils.getConfig("resourcePath") + expand}
                        alt="add icon"
                      ></img>
                    )}
                  </div>
                }
              </div>
            </button>
          </div>
          {index === activeIndex && (
            <div>
              <div
                style={
                  variantTwo
                    ? isDesktop
                      ? { paddingTop: "24px" }
                      : { paddingTop: "16px" }
                    : {}
                }
                className={`accordian-container__content ${
                  index === activeIndex
                    ? "accordian-container__expand"
                    : "accordian-container__close"
                }`}
              >
                <div className="accordian-container__content__wrapper">
                  {item.contentItem?.map((contents, index) => (
                    <div key={index}>
                      {(contents.mobileImage || contents.desktopImage) && (
                        <div className="accordian-container__image">
                          <img
                            src={
                              isDesktop
                                ? contents.desktopImage
                                : contents.mobileImage
                            }
                            alt={contents?.imagealttext}
                            title={contents?.imageTitle}
                            loading="lazy"
                          ></img>
                        </div>
                      )}
                      {!contents.isyouTubeVideo && contents.video && (
                        <div className="accordian-container__video">
                          <video
                            muted
                            loop
                            autoPlay
                            playsInline
                            src={contents.video}
                          ></video>
                        </div>
                      )}
                      {contents.video && contents.isyouTubeVideo && (
                        <div className="accordian-container__ytvideo">
                          <iframe
                            src={contents.video}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            loading="lazy"
                          ></iframe>
                        </div>
                      )}
                      {contents.label && (
                        <a
                          key={index}
                          href={contents.navLink}
                          target={contents.newTab ? "_blank" : "_self"}
                          rel="noreferrer"
                          className="accordian-container__data"
                        >
                          {contents.label}
                        </a>
                      )}
                      {contents.knowMoreLink && (
                        <div className="accordian-container__knowmore-wrapper">
                          <a
                            className="accordian-container__knowmore-link"
                            href={contents.knowMoreLink}
                            data-link-position={dataPosition || "serviceCard"}
                            onClick={(e) => ctaTracking(e)}
                            target={contents.newTab ? "_blank" : "_self"}
                            rel="noreferrer"
                          >
                            {contents.knowMoreLabel}
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                  {item.questionContent?.map((contents, index) => (
                    <div key={index}>
                      {contents.questionAndAnswer && (
                        <div>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: contents.questionAndAnswer
                            }}
                          ></div>
                          {contents.isShowMore && !readMore && (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: contents.readMoreData
                              }}
                              className="accordian-container__readMore-content"
                            ></div>
                          )}
                          {contents.isShowMore && (
                            <div className="accordian-container__readMore-wrapper">
                              <a
                                onClick={() => readMoreLess()}
                                className="accordian-container__readMore-link"
                              >
                                {readMore ? "Read More" : "Read Less"}
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
export default Accordian;

Accordian.propTypes = {
  dataPosition: PropTypes.string,
  accordianData: PropTypes.arrayOf(PropTypes.any),
  defaultOpenIndex: PropTypes.number,
  darkTheme: PropTypes.bool,
  isFooter: PropTypes.bool,
  subTitle: PropTypes.string,
  title: PropTypes.string,
  headerImageMobile: PropTypes.string,
  headerImageDesktop: PropTypes.string,
  altHeaderImageText: PropTypes.string,
  headerImageTitle: PropTypes.string,
  variantTwo: PropTypes.bool
};

// Accordian.defaultProps = {
//   accordianData: {
//     accordianContent: [
//       {
//         title: "VIDA",
//         content: "About US"
//       }
//     ]
//   }
// };
