import React from 'react';
import TeaserRiv from '../components/TeaserRiv/TeaserRiv';

const TeaserWithRiv = () => {
  // Use the new cropped PNG for the teaser image
  const bikeImage = '/TeaserBanner.png';
  const featureImage = 'https://placehold.co/300x200/333/FFF?text=Feature';
  
  // Sample data for the teaser
  const teaserData = {
    heading: 'The Future of Urban Movement',
    subheading: 'The all new VX2 with RIV starting from *****',
    ctaText: 'Notify Me',
    ctaAction: () => console.log('CTA clicked'),
    image: bikeImage,
    bannerText: 'LAUNCHING THIS JULY',
    features: [
      {
        title: 'Modern aesthetics with ease of use',
        image: featureImage
      },
      {
        title: 'Removable battery',
        image: featureImage
      },
      {
        title: 'BAAS',
        image: featureImage
      }
    ],
    backgroundColor: 'dark',
    productName: 'Vida VX2 with RIV'
  };

  // No top margin or padding for the container
  const pageContainerStyle = {
    paddingTop: '64px', // Only for header
    minHeight: '100vh',
    boxSizing: 'border-box',
    overflow: 'hidden',
  };

  return (
    <div style={pageContainerStyle}>
      <TeaserRiv {...teaserData} />
    </div>
  );
};

export default TeaserWithRiv; 