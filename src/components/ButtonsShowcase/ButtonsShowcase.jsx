import React from 'react';
import Button from '../Button/Button';
import './ButtonsShowcase.scss';

const ButtonsShowcase = () => {
  return (
    <div className="buttons-showcase">
      <section className="buttons-showcase__section">
        <h3>Button Variants</h3>
        <div className="buttons-showcase__examples">
          <Button label="Primary Button" variant="primary" />
          <Button label="Secondary Button" variant="secondary" />
          <Button label="Tertiary Button" variant="tertiary" />
        </div>
      </section>
      
      <section className="buttons-showcase__section">
        <h3>Button Sizes</h3>
        <div className="buttons-showcase__examples">
          <Button label="Small Button" size="s" />
          <Button label="Medium Button" size="m" />
          <Button label="Large Button" size="l" />
        </div>
      </section>
      
      <section className="buttons-showcase__section">
        <h3>Button States</h3>
        <div className="buttons-showcase__examples">
          <Button label="Default State" state="default" />
          <Button label="Hover State" state="hover" />
          <Button label="Pressed State" state="pressed" />
          <Button label="Disabled Button" disabled={true} />
        </div>
      </section>
      
      <section className="buttons-showcase__section">
        <h3>Button Prominence</h3>
        <div className="buttons-showcase__examples">
          <Button label="Light" prominence="light" />
          <Button label="Dark" prominence="dark" />
          <Button label="Link" prominence="link" />
        </div>
      </section>
      
      <section className="buttons-showcase__section">
        <h3>Semantic Typography</h3>
        <div className="buttons-showcase__examples">
          <Button label="Desktop" semanticTypography="desktop" />
          <Button label="Mobile" semanticTypography="mobile" />
        </div>
      </section>
      
      <section className="buttons-showcase__section">
        <h3>Visibility</h3>
        <div className="buttons-showcase__examples">
          <Button label="Left Icon Visible" visibility="left" customIcon={<IconPlaceholder />} />
          <Button label="Right Icon Visible" visibility="right" customIcon={<IconPlaceholder />} />
          <Button label="No Icons Visible" visibility="off" />
        </div>
      </section>
      
      <section className="buttons-showcase__section">
        <h3>Custom Icon Button</h3>
        <div className="buttons-showcase__examples">
          <Button 
            label="Lightning Button" 
            customIcon={
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.33628 14.7854L7.19912 10.0412C7.28035 9.83572 7.17747 9.60324 6.97169 9.52485L2.92111 7.94073C2.64494 7.83259 2.57723 7.47036 2.79925 7.27303L10.0259 0.771654C10.34 0.490514 10.8192 0.820317 10.6649 1.21499L8.80204 5.95923C8.72081 6.16468 8.82369 6.39716 9.02947 6.47556L13.08 8.05967C13.3562 8.1678 13.4212 8.53004 13.2019 8.72738L5.97527 15.2287C5.6639 15.5099 5.18466 15.1774 5.33628 14.7854Z" fill="currentColor" />
              </svg>
            } 
          />
        </div>
      </section>
    </div>
  );
};

const IconPlaceholder = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.33628 14.7854L7.19912 10.0412C7.28035 9.83572 7.17747 9.60324 6.97169 9.52485L2.92111 7.94073C2.64494 7.83259 2.57723 7.47036 2.79925 7.27303L10.0259 0.771654C10.34 0.490514 10.8192 0.820317 10.6649 1.21499L8.80204 5.95923C8.72081 6.16468 8.82369 6.39716 9.02947 6.47556L13.08 8.05967C13.3562 8.1678 13.4212 8.53004 13.2019 8.72738L5.97527 15.2287C5.6639 15.5099 5.18466 15.1774 5.33628 14.7854Z"
      fill="currentColor"
    />
  </svg>
);

export default ButtonsShowcase; 