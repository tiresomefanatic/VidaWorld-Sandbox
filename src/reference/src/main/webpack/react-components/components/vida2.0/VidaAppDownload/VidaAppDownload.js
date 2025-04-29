import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import analyticsUtils from "../../../../site/scripts/utils/analyticsUtils";
import { useIntersectionObserver } from "../../../hooks/IntersectionObserver/IntersectionObserver";

function getOS() {
  const userAgent = window.navigator.userAgent,
    platform =
      window.navigator?.platform || window.navigator?.userAgentData?.platform,
    macosPlatforms = ["macOS", "Macintosh", "MacIntel", "MacPPC", "Mac68K"],
    windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"],
    iosPlatforms = ["iPhone", "iPad", "iPod"];
  let os = null;
  if (macosPlatforms.indexOf(platform) !== -1) {
    os = "app store";
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = "app store";
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = "play store";
  } else if (/Android/.test(userAgent)) {
    os = "play store";
  } else if (/Linux/.test(platform)) {
    os = "play store";
  } else {
    os = "play store";
  }
  return os;
}

const VidaAppDownload = (props) => {
  const {
    dataPosition,
    cardBgImgMob,
    cardBgImgDesktop,
    stayConnectTitle,
    downloadText,
    mobileDownloadImage,
    desktopDownloadImage,
    downloadAppLinks,
    cardBgImgAlt,
    cardBgImgTitle,
    downloadImageAlt,
    downloadImageTitle
  } = props.config;

  // intersection observer
  const {
    ref: vidaAppDownloadContainerRef,
    isVisible: vidaAppDownloadContainerVisible
  } = useIntersectionObserver();

  const playstoreLink = downloadAppLinks?.playStoreLink;
  const appstoreLink = downloadAppLinks?.appStoreLink;
  const [appLink, setAppLink] = useState(playstoreLink);
  const isAnalyticsEnabled = analyticsUtils.isAnalyticsEnabled();

  useEffect(() => {
    var osLink = getOS();
    if (osLink === "play store") {
      setAppLink(playstoreLink);
    } else {
      setAppLink(appstoreLink);
    }
  }, []);

  const ctaTracking = (e) => {
    if (isAnalyticsEnabled) {
      const customLink = {
        ctaText: e?.target?.alt || e?.target?.innerText,
        ctaLocation: e?.target?.dataset?.linkPosition
      };
      analyticsUtils.trackCTAClicksVida2(customLink, "ctaButtonClick");
    }
  };

  return (
    <div
      className="vida-app-download"
      ref={vidaAppDownloadContainerRef}
      style={{ opacity: vidaAppDownloadContainerVisible ? 1 : 0 }}
    >
      <div className="vida-app-download__mobile-bg-img">
        <img
          src={cardBgImgMob}
          alt={cardBgImgAlt}
          title={cardBgImgTitle}
          className="vida-app-download-mobile-bg-img"
          aria-label="vida-app-bg-img"
          loading="lazy"
        />
      </div>
      <div className="vida-app-download__desktop-bg-img">
        <img
          src={cardBgImgDesktop}
          alt={cardBgImgAlt}
          title={cardBgImgTitle}
          className="vida-app-download-desktop-bg-img"
          aria-label="vida-app-bg-img"
          loading="lazy"
        />
      </div>
      <div className="vida-app-download__links-container vida-2-container">
        <div className="vida-app-download__stay-connect-container">
          <p className="stay-connect-text">{stayConnectTitle}</p>
        </div>
        <div className="vida-app-download__links-parent-container">
          <div className="vida-app-download__links-here-container">
            <div className="vida-app-download__playstore-appstore-text-container">
              <p className="vida-app-download__playstore-appstore-text">
                {downloadText}
              </p>
            </div>
            <div className="vida-app-download__playstore-appstore-img-container mobile-image-visible">
              <a
                data-link-position={dataPosition || "vidaAppDownload"}
                onClick={(e) => ctaTracking(e)}
                href={appLink}
              >
                <img
                  src={mobileDownloadImage?.imageUrl}
                  data-link-position={dataPosition || "vidaAppDownload"}
                  alt={downloadImageAlt}
                  title={downloadImageTitle}
                  aria-label="download-app-link"
                  loading="lazy"
                />
              </a>
            </div>
            <div className="vida-app-download__playstore-appstore-img-container desktop-image-visible">
              <a
                data-link-position={dataPosition || "vidaAppDownload"}
                onClick={(e) => ctaTracking(e)}
                href={appLink}
              >
                <img
                  src={desktopDownloadImage?.imageUrl}
                  data-link-position={dataPosition || "vidaAppDownload"}
                  alt={downloadImageAlt}
                  title={downloadImageTitle}
                  aria-label="download-app-link"
                  loading="lazy"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default VidaAppDownload;
VidaAppDownload.propTypes = {
  config: PropTypes.shape({
    dataPosition: PropTypes.string,
    cardBgImgMob: PropTypes.string,
    cardBgImgDesktop: PropTypes.string,
    stayConnectTitle: PropTypes.string,
    downloadText: PropTypes.string,
    mobileDownloadImage: PropTypes.shape({
      imageUrl: PropTypes.string
    }),
    desktopDownloadImage: PropTypes.shape({
      imageUrl: PropTypes.string
    }),
    downloadAppLinks: PropTypes.shape({
      playStoreLink: PropTypes.string,
      appStoreLink: PropTypes.string
    }),
    cardBgImgAlt: PropTypes.string,
    cardBgImgTitle: PropTypes.string,
    downloadImageAlt: PropTypes.string,
    downloadImageTitle: PropTypes.string
  })
};
// VidaAppDownload.defaultProps = {
//   config: {
//     cardBgImgMob:
//       "../src/main/webpack/resources/images/png/vida-app-download-bg-img-mobile.png",
//     cardBgImgDesktop:
//       "../src/main/webpack/resources/images/png/vida-app-download-bg-img-desktop.png",
//     stayConnectTitle:
//       " Stay connected with the My VIDA app. No matter where you are.",
//     downloadText: "Download the My VIDA app",
//     mobileDownloadImage: {
//       imageUrl:
//         "../src/main/webpack/resources/images/png/vida-app-download-playstore-appstore-img-mobile.png"
//     },
//     desktopDownloadImage: {
//       imageUrl:
//         "../src/main/webpack/resources/images/png/vida-app-download-playstore-appstore-img-desktop.png"
//     },
//     downloadAppLinks: {
//       playStoreLink:
//         "https://play.google.com/store/apps/details?id=com.hero.vida&hl=en&gl=US",
//       appStoreLink: "https://apps.apple.com/in/app/my-vida/id1619977916"
//     }
//   }
// };
