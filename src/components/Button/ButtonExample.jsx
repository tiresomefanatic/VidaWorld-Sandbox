import React from 'react';
import Button from './Button';
import '../styles/main.scss';

const ButtonExample = () => {
  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h1>Button Examples</h1>
      
      <section>
        <h2>Primary Buttons</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Button size="small">Small</Button>
          <Button size="medium">Medium</Button>
          <Button size="large">Large</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>
      
      <section>
        <h2>Secondary Buttons</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Button variant="secondary" size="small">Small</Button>
          <Button variant="secondary" size="medium">Medium</Button>
          <Button variant="secondary" size="large">Large</Button>
          <Button variant="secondary" disabled>Disabled</Button>
        </div>
      </section>
      
      <section>
        <h2>Tertiary Buttons</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Button variant="tertiary" size="small">Small</Button>
          <Button variant="tertiary" size="medium">Medium</Button>
          <Button variant="tertiary" size="large">Large</Button>
          <Button variant="tertiary" disabled>Disabled</Button>
        </div>
      </section>
    </div>
  );
};

export default ButtonExample; 