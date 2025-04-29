import React from 'react';
import '../../styles/main.scss';
import Button from '../../components/Button/Button';

const ButtonComponent = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Button Component</h1>
      <p>This page provides information on how to use and edit the Button component.</p>

      <div style={{ marginTop: '2rem' }}>
        <h2>Examples</h2>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          <Button size="small">Small Button</Button>
          <Button size="medium">Medium Button</Button>
          <Button size="large">Large Button</Button>
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          <Button variant="primary" size="medium">Primary Button</Button>
          <Button variant="secondary" size="medium">Secondary Button</Button>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>How to Edit</h2>
        <p>The Button component can be found at: <code>src/components/Button/Button.jsx</code></p>
        <p>The component accepts the following props:</p>
        <ul style={{ textAlign: 'left' }}>
          <li><strong>variant</strong>: "primary" (default) or "secondary"</li>
          <li><strong>size</strong>: "small", "medium" (default), or "large"</li>
          <li><strong>onClick</strong>: function to call when button is clicked</li>
          <li><strong>children</strong>: content to display inside the button</li>
        </ul>
        <p>Styling for the Button can be modified in: <code>src/components/Button/Button.scss</code></p>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>Usage Example</h2>
        <pre style={{ textAlign: 'left', backgroundColor: '#f5f5f5', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
          {`import Button from '../components/Button/Button';

// Primary medium button (default)
<Button onClick={() => console.log('Button clicked!')}>
  Click Me
</Button>

// Secondary small button
<Button 
  variant="secondary" 
  size="small" 
  onClick={() => alert('Button clicked!')}
>
  Click Me
</Button>`}
        </pre>
      </div>
    </div>
  );
};

export default ButtonComponent; 