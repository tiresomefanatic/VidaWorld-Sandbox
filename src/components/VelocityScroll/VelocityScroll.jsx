import React, { useState, useEffect, useRef } from 'react';
import './VelocityScroll.scss';

const VelocityScroll = () => {
  const [scrollValue, setScrollValue] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const lastScrollY = useRef(window.scrollY);
  const lastTimestamp = useRef(performance.now());

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const currentTime = performance.now();
      const deltaY = currentScroll - lastScrollY.current;
      const deltaTime = currentTime - lastTimestamp.current;

      // Calculate velocity in pixels per second
      const currentVelocity = deltaTime > 0 ? (deltaY / deltaTime) * 1000 : 0;
      
      setScrollValue(currentScroll);
      setVelocity(currentVelocity);

      lastScrollY.current = currentScroll;
      lastTimestamp.current = currentTime;
    };

    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="velocity-scroll">
      <div className="velocity-scroll__content">
        <h2>Scroll: {Math.round(scrollValue)}px</h2>
        <h3>Velocity: {Math.round(velocity)}px/s</h3>
      </div>
    </div>
  );
};

export default VelocityScroll;
