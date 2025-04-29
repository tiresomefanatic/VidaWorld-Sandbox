import React from 'react';
import '../../styles/main.scss';

const HeaderComponent = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Header Component</h1>
      <p>This page provides information on how to use and edit the Header component.</p>

      <div style={{ marginTop: '2rem' }}>
        <h2>Overview</h2>
        <p>The Header component serves as the main navigation bar for the application. It is displayed at the top of every page.</p>
        <p>You can see the Header in action at the top of this page.</p>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>How to Edit</h2>
        <p>The Header component can be found at: <code>src/components/Header/Header.jsx</code></p>
        <p>The component is used in the main App layout and doesn't require any props to function.</p>
        <p>To modify the navigation links or header content, edit the Header.jsx file directly.</p>
        <p>Styling for the Header can be modified in: <code>src/components/Header/Header.scss</code></p>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>Customization Tips</h2>
        <ul style={{ textAlign: 'left' }}>
          <li><strong>Logo:</strong> To change the logo, update the image import and path in the Header component.</li>
          <li><strong>Navigation Links:</strong> Modify the navigation items array or JSX structure to add/remove links.</li>
          <li><strong>Mobile Responsiveness:</strong> The header includes responsive design for mobile devices. Test any changes on various screen sizes.</li>
          <li><strong>Colors:</strong> Update the SCSS variables in the Header.scss file to change the color scheme.</li>
        </ul>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>Usage Example</h2>
        <pre style={{ textAlign: 'left', backgroundColor: '#f5f5f5', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
          {`// In App.jsx
import Header from "./components/Header/Header";

function App() {
  return (
    <Router>
      <div className="app">
        {/* Header component is used without props */}
        <Header />
        
        {/* Rest of your app */}
        <div className="content">
          {/* ... */}
        </div>
      </div>
    </Router>
  );
}`}
        </pre>
      </div>
    </div>
  );
};

export default HeaderComponent; 