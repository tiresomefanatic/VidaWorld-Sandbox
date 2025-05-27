import React from 'react';
import './TeaserFooterBanner.scss';

const TeaserFooterBanner = () => {
  return (
    <div className="teaser-footer-banner">
      <div className="teaser-footer-banner__marquee">
        {[...Array(2)].map((_, j) =>
          Array(8).fill(null).map((_, i) => (
            <React.Fragment key={j + '-' + i}>
              VIDA VX2 <span className="teaser-footer-banner__icon"><img src="/marqueeLightningIcon.svg" alt="Lightning Icon" className="teaser-footer-banner__icon-img" /></span>
            </React.Fragment>
          ))
        )}
      </div>
    </div>
  );
};

export default TeaserFooterBanner; 