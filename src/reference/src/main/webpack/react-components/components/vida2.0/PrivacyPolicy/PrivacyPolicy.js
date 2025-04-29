import React from "react";
import PropTypes, { any } from "prop-types";
import breakpoints from "../../../../site/scripts/media-breakpoints";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";

const PrivacyPolicy = ({ config }) => {
  const {
    sectionOne,
    sectionTwo,
    sectionThree,
    isTermsAndConditions,
    dataPosition
  } = config;
  const isDesktop = window.matchMedia(
    breakpoints.mediaExpression.desktop
  ).matches;

  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();
  const CustomTitleTag = sectionOne.titleTag || "p";

  const ctaTracking = (e) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        ctaText: e?.target?.innerText,
        ctaLocation:
          e?.target?.dataset?.linkPosition ||
          e?.target?.closest("a")?.dataset?.linkPosition,
        ctaLink:
          e?.target?.href || e?.target?.closest("a")?.getAttribute("href")
      };
      analyticsUtils.trackCTAClicksVida2(customLink, "ctaButtonClick");
    }
  };

  return (
    <div className="privacy-policy-parent-container">
      <div
        style={{
          backgroundImage: `url(${
            isDesktop ? sectionOne?.bgImgDesktop : sectionOne?.bgImgMobile
          })`
        }}
        className="section-one-container"
      >
        <div className="section-one-container__header-container">
          <CustomTitleTag className="title">
            {sectionOne?.privacyPolicyTitle}
          </CustomTitleTag>
          {sectionOne?.privacyPolicyLastUpdatedDate && (
            <p className="date">{sectionOne?.privacyPolicyLastUpdatedDate}</p>
          )}
        </div>
        {sectionOne?.privacyPolicies?.map((content, index) => (
          <div key={index} className="section-one-container__content-container">
            {content?.contentTitle && (
              <p
                className="content-heading"
                dangerouslySetInnerHTML={{
                  __html: content?.contentTitle
                }}
              ></p>
            )}
            <p
              className="content-info"
              dangerouslySetInnerHTML={{
                __html: content?.contentDescription
              }}
            ></p>
          </div>
        ))}
      </div>
      <div className="two-three-container-wrapper">
        <div
          className={
            isTermsAndConditions
              ? "section-two-container bottom-none"
              : "section-two-container"
          }
        >
          {sectionTwo?.privacyPolicies?.map((content, index) => (
            <div
              key={index}
              className="section-two-container__content-container"
            >
              <div className="wrapper">
                {content?.contentTitle && (
                  <div className="question-number-container">
                    <p className="question-number-text">{index + 1}</p>
                  </div>
                )}
                <div className="qna-container">
                  {content?.contentTitle && (
                    <p
                      className="title-text"
                      dangerouslySetInnerHTML={{
                        __html: content?.contentTitle
                      }}
                    ></p>
                  )}
                  <p
                    className="description-text"
                    dangerouslySetInnerHTML={{
                      __html: content?.contentDescription
                    }}
                  ></p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {sectionThree?.title &&
          sectionThree?.description &&
          sectionThree?.contactInfo && (
            <div className="section-three-container">
              <div className="section-three-container__header-container">
                <p className="title-text">{sectionThree?.title}</p>
                <p className="description-text">{sectionThree?.description}</p>
              </div>

              <div className="contact-wrapper">
                {sectionThree?.contactInfo?.map((content, index) => (
                  <div
                    key={index}
                    className="section-three-container__content-container"
                  >
                    <div className="content-wrapper">
                      <div className="icon-container">
                        <img src={content?.icon} alt="icon-img" />
                      </div>
                      <div>
                        <a
                          href={
                            content?.text?.includes("@")
                              ? `mailto:${content?.text}`
                              : `tel:${content?.text}`
                          }
                          data-link-position={dataPosition || "PrivacyPolicy"}
                          onClick={(e) => ctaTracking(e)}
                        >
                          <p className="contact-txt">{content?.text}</p>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default PrivacyPolicy;

PrivacyPolicy.propTypes = {
  config: PropTypes.shape({
    dataPosition: PropTypes.string,
    isTermsAndConditions: PropTypes.bool,
    sectionOne: PropTypes.shape({
      bgImgMobile: PropTypes.string,
      bgImgDesktop: PropTypes.string,
      privacyPolicyTitle: PropTypes.string,
      titleTag: PropTypes.string,
      privacyPolicyLastUpdatedDate: PropTypes.string,
      privacyPolicies: PropTypes.arrayOf(
        PropTypes.shape({
          contentTitle: PropTypes.string,
          contentDescription: PropTypes.string
        })
      )
    }),
    sectionTwo: PropTypes.shape({
      privacyPolicies: PropTypes.arrayOf(
        PropTypes.shape({
          contentTitle: PropTypes.string,
          contentDescription: PropTypes.string
        })
      )
    }),
    sectionThree: PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      contactInfo: PropTypes.arrayOf(
        PropTypes.shape({
          icon: PropTypes.string,
          text: PropTypes.string
        })
      )
    })
  })
};
