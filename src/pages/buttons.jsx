import React, { useState } from 'react';
import '../styles/main.scss';
import Button from '../components/Button';

const ButtonsPage = () => {
  return (
    <div className="buttons-page">
      <h1>Button Component</h1>
      
      <section>
        <h2>Prominence Variations</h2>
        <div className="button-grid">
          <div>
            <h3>Primary</h3>
            <Button label="Button" prominence="primary" />
          </div>
          <div>
            <h3>Secondary</h3>
            <Button label="Button" prominence="secondary" />
          </div>
          <div>
            <h3>Tertiary</h3>
            <Button label="Button" prominence="tertiary" />
          </div>
        </div>
      </section>

      <section>
        <h2>Size Variations</h2>
        <div className="button-grid">
          <div>
            <h3>Small</h3>
            <Button label="Button" size="s" />
          </div>
          <div>
            <h3>Medium</h3>
            <Button label="Button" size="m" />
          </div>
          <div>
            <h3>Large</h3>
            <Button label="Button" size="l" />
          </div>
        </div>
      </section>

      <section>
        <h2>State Variations</h2>
        <div className="button-grid">
          <div>
            <h3>Default</h3>
            <Button label="Button" />
          </div>
          <div>
            <h3>Hover</h3>
            <Button label="Button" state="hover" />
          </div>
          <div>
            <h3>Pressed</h3>
            <Button label="Button" state="pressed" />
          </div>
          <div>
            <h3>Disabled</h3>
            <Button label="Button" disabled />
          </div>
        </div>
      </section>

      <section>
        <h2>With Icons</h2>
        <div className="button-grid">
          <div>
            <h3>Left Icon</h3>
            <Button label="Button" iconLeft={true} />
          </div>
          <div>
            <h3>Right Icon</h3>
            <Button label="Button" iconRight={true} />
          </div>
          <div>
            <h3>Both Icons</h3>
            <Button label="Button" iconLeft={true} iconRight={true} />
          </div>
        </div>
      </section>

      <style jsx>{`
        .buttons-page {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        section {
          margin-bottom: 3rem;
        }
        
        .button-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 2rem;
          margin-top: 1rem;
        }
      `}</style>
    </div>
  );
};

export default ButtonsPage; 