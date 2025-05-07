import React from 'react';
import Button from '../Button/Button';
import './ButtonsShowcase.scss';

const ButtonsShowcase = () => {
  return (
    <div className="buttons-showcase">
      <section className="buttons-showcase__section">
        <h3>Button Prominence</h3>
        <div className="buttons-showcase__examples">
          <Button label="Primary Button" prominence="primary" />
          <Button label="Secondary Button" prominence="secondary" />
          <Button label="Tertiary Button" prominence="tertiary" />
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
        <h3>Buttons with Icons</h3>
        <div className="buttons-showcase__examples">
          <Button label="Left Icon" iconLeft={true} />
          <Button label="Right Icon" iconRight={true} />
          <Button label="Both Icons" iconLeft={true} iconRight={true} />
        </div>
      </section>
    </div>
  );
};

export default ButtonsShowcase; 