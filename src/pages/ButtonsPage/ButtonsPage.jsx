import React from 'react';
import './ButtonsPage.scss';
import LabelButton from '../../components/LabelButton/LabelButton';
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
          <h2>Finished Components</h2>
          
          <div className="buttons-page__component-card">
            <h3>Label Button</h3>
            <div className="buttons-page__component-preview">
              <LabelButton label="Label" />
            </div>
            <div className="buttons-page__component-code">
              <pre>{`<LabelButton label="Label" />`}</pre>
            </div>
          </div>
          
          {/* Add more finished components here as they are created */}
        </section>
      </div>
    </div>
  );
};

export default ButtonsPage; 