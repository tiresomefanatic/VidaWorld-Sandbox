import React from "react";
import PropTypes from "prop-types";
import Accordian from "../Accordian/Accordian";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";

const Footer = (props) => {
  const { config } = props;

  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();

  const ctaTracking = (e) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        ctaText: e?.target?.alt || e?.target?.innerText,
        ctaLocation: e?.target?.dataset?.linkPosition
      };
      analyticsUtils.trackCTAClicksVida2(customLink, "ctaButtonClick");
    }
  };
  const HeadingTag = "h2";

  return (
    <div className="footer-main-container">
      {config.isShowFaqSection && (
        <div className="faq-section">
          <Accordian accordianData={config.faqs.faqsContent} />
        </div>
      )}
      <div className="footer-address">
        <div className="footer-address__wrapper">
          <div className="footer-address__logo-container">
            <div className="vida-logo">
              <a
                href={config.footerLink}
                data-link-position={config.dataPosition || "footer"}
                onClick={(e) => ctaTracking(e)}
              >
                <img
                  src={config.footerLogo}
                  data-link-position={config.dataPosition || "footer"}
                  alt={config.footerLogoAlt || "footer logo"}
                  title={config.footerLogoTitle}
                ></img>
              </a>
            </div>
            <div className="hero-logo">
              <a
                href={config.footerHeroLink}
                target={config.footerHeroLogoNewTab ? "_blank" : "_self"}
                rel="noreferrer"
              >
                <img
                  src={config?.footerHeroLogo}
                  alt={config?.footerHeroLogoAlt || "vida_logo"}
                  title={config?.footerHeroLogoTitle}
                ></img>
              </a>
            </div>
          </div>
          <div className="footer-address__description">
            <p>{config.footerAddress}</p>
          </div>
          <div className="footer-address__ph-no">
            <a
              className="vida-contact-us__contact-links"
              href={`tel:${config.footerPhno}`}
            >
              {config.footerPhno}
            </a>
          </div>
          <div className="footer-address__email">
            <a
              className="vida-contact-us__contact-links"
              href={`mailto:${config.footerEmail}`}
            >
              {config.footerEmail}
            </a>
          </div>
          <div className="social-media">
            <div className="social-media__follow-header">
              <p className="social-media__follow-text">{config.followUsText}</p>
            </div>
            <div className="social-media__icons">
              {config.footerMediaIcons?.map((footerIcons, index) => (
                <div
                  className="social-media__icon-container"
                  key={footerIcons.imageAltText + index}
                >
                  <a
                    href={footerIcons.link}
                    onClick={(e) => ctaTracking(e)}
                    target={footerIcons.newTab ? "_blank" : "_self"}
                    data-link-position={config.dataPosition || "footer"}
                    rel="noreferrer"
                  >
                    <img
                      src={footerIcons.image}
                      data-link-position={config.dataPosition || "footer"}
                      alt={footerIcons.imageAltText}
                    ></img>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="footer-address__desktop-container">
          <div className="footer-address__desktop-accordian-details">
            {config?.accordianData?.accordianContent &&
              config?.accordianData?.accordianContent?.map((item, index) => (
                <div className="footer-address__vida" key={index}>
                  <HeadingTag className="footer-address__vida__header">
                    {item.title}
                  </HeadingTag>
                  <div className="footer-address__vida__content">
                    {item.contentItem?.map((contents, index) => (
                      <a
                        key={index}
                        href={contents.navLink}
                        data-link-position={config.dataPosition || "footer"}
                        target={contents.newTab ? "_blank" : "_self"}
                        rel="noreferrer"
                        className="footer-address__vida__content__data"
                        onClick={(e) => ctaTracking(e)}
                      >
                        {contents.label}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
          </div>
          {config?.accordianData?.accordionCityData && (
            <div className="footer-address__desktop-city-container">
              <p className="city-container-header">
                {config?.accordianData?.accordionCityData[0].title}
              </p>
              <div className="city-options">
                {config?.accordianData?.accordionCityData[0].contentItem.map(
                  (item, index) => (
                    <a
                      className="city-name-link"
                      href={item.navLink}
                      key={index}
                      target={item.newTab ? "_blank" : "_self"}
                      rel="noreferrer"
                    >
                      {item.label}
                    </a>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {config?.footerDescription?.length > 0 && (
        <div className="footer-descriptions">
          {config?.footerDescription?.map((description, index) => (
            <div className="footer-description" key={index}>
              <div
                className="footer-description__header"
                dangerouslySetInnerHTML={{
                  __html: description?.header
                }}
              ></div>
              <div
                className="footer-description__content"
                dangerouslySetInnerHTML={{
                  __html: description?.content
                }}
              ></div>
            </div>
          ))}
        </div>
      )}
      <div className="footer-accordian">
        <Accordian
          accordianData={config?.accordianData?.accordianContent}
          isFooter={true}
        />
        <Accordian
          accordianData={config?.accordianData?.accordionCityData}
          isFooter={true}
        />
      </div>
      <div className="terms-and-service-container">
        <div className="terms-and-service-container__wrapper">
          <div className="terms-and-service">
            {config.footerTermsAndSerivice?.map((termContents, index) => (
              <a
                className="terms-and-service__text"
                onClick={(e) => ctaTracking(e)}
                data-link-position={config.dataPosition || "footer"}
                key={index}
                href={termContents.navLink}
              >
                {termContents.label}
              </a>
            ))}
          </div>
        </div>

        <div className="copy-right-wrapper">
          <div
            className="copy-right-wrapper__text"
            dangerouslySetInnerHTML={{
              __html: config.copyWriteText
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Footer;

Footer.propTypes = {
  config: PropTypes.shape({
    accordianData: PropTypes.objectOf(PropTypes.any),
    footerDescription: PropTypes.arrayOf(PropTypes.any),
    faqs: PropTypes.objectOf(PropTypes.any),
    footerMediaIcons: PropTypes.arrayOf(PropTypes.any),
    footerTermsAndSerivice: PropTypes.arrayOf(PropTypes.any),
    followUs: PropTypes.arrayOf(PropTypes.any),
    footerAddress: PropTypes.string,
    footerEmail: PropTypes.string,
    footerPhno: PropTypes.string,
    followUsText: PropTypes.string,
    copyWriteText: PropTypes.string,
    footerLogo: PropTypes.string,
    footerLink: PropTypes.string,
    dataPosition: PropTypes.string,
    isShowFaqSection: PropTypes.bool,
    footerLogoAlt: PropTypes.string,
    footerLogoTitle: PropTypes.string,
    footerHeroLink: PropTypes.string,
    footerHeroLogo: PropTypes.string,
    footerHeroLogoNewTab: PropTypes.bool,
    footerHeroLogoAlt: PropTypes.string,
    footerHeroLogoTitle: PropTypes.string
  })
};
