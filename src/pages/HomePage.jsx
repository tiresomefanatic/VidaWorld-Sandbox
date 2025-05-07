import React from 'react';
import '../styles/main.scss';

const HomePage = () => {
  return (
    <div className="home-page" style={{ paddingTop: '96px' }}>
      <div className="home-page__container">
        <h1>Home Page</h1>
        <p>This is the dedicated home page, separate from the landing page.</p>
        <p>Here you can add specific content that should appear on the home page.</p>
      </div>
    </div>
  );
};

export default HomePage; 