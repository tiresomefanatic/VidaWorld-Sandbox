import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Drawer.scss';

const Drawer = ({ children, title = 'Button Styles' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`drawer ${isOpen ? 'drawer--open' : ''}`}>
      <button 
        className="drawer__toggle" 
        onClick={toggleDrawer}
      >
        {isOpen ? 'Hide' : 'View'} {title}
      </button>
      
      <div className="drawer__content">
        {children}
      </div>
    </div>
  );
};

Drawer.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string
};

export default Drawer; 