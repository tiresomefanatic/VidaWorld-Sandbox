import React from 'react';
import './ButtonsPage.scss';
import Button from '../../components/Button/Button';
import Drawer from '../../components/Drawer/Drawer';
import ButtonsShowcase from '../../components/ButtonsShowcase/ButtonsShowcase';

const ButtonsPage = () => {
  return (
    <div className="buttons-page" style={{ marginTop: '106px' }}>
      <div className="buttons-page__container">
        <div className="buttons-page__header">
          <h1>Buttons</h1>
          <div className="buttons-page__drawer-container">
            <Drawer title="Button System">
              <ButtonsShowcase />
            </Drawer>
          </div>
        </div>
        
        <section className="buttons-page__section">
          <div className="buttons-page__component-card">
            <h3>Button Component</h3>
            <div className="buttons-page__component-preview">
              <Button label="Reserve" customIcon={
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.33628 14.7854L7.19912 10.0412C7.28035 9.83572 7.17747 9.60324 6.97169 9.52485L2.92111 7.94073C2.64494 7.83259 2.57723 7.47036 2.79925 7.27303L10.0259 0.771654C10.34 0.490514 10.8192 0.820317 10.6649 1.21499L8.80204 5.95923C8.72081 6.16468 8.82369 6.39716 9.02947 6.47556L13.08 8.05967C13.3562 8.1678 13.4212 8.53004 13.2019 8.72738L5.97527 15.2287C5.6639 15.5099 5.18466 15.1774 5.33628 14.7854Z" fill="currentColor" />
                </svg>
              } />
            </div>
            <div className="buttons-page__component-code">
              <pre>{`<Button 
  label="Label text goes here" 
  prominence="light" 
  size="m" 
  state="default" 
  disabled={false}
  variant="primary"
  semanticTypography="desktop" 
  visibility="left" 
  customIcon={<IconComponent />} 
  onClick={() => console.log('Button clicked!')}
  className="custom-class"
/>`}</pre>
            </div>
          </div>
          
          {/* Add more finished components here as they are created */}
        </section>
      </div>
    </div>
  );
};

export default ButtonsPage; 