import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Header.scss";
import vidaLogo from '../../../public/VidaHeaderLogo.svg'

// This component focuses on UI and CSS implementation matching the Figma design
const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownTimeoutRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Handle outside click to close mobile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && 
          !event.target.classList.contains('hamburger-icon')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  // Vehicle models data for the dropdown - using SVGs from public folder
  const vehicleModels = [
    {
      id: "vx2plus",
      name: "VX2 Plus",
      image: "/V2Plus.svg",
      link: "/vehicles/vx2-plus"
    },
    {
      id: "vx2go",
      name: "VX2 Go",
      image: "/VidaGo.svg",
      link: "/vehicles/vx2-go"
    },
    {
      id: "v2pro",
      name: "V2 Pro",
      image: "/V2Pro.svg",
      link: "/vehicles/v2-pro"
    },
    {
      id: "v2plus",
      name: "V2 Plus",
      image: "/V2Plus.svg",
      link: "/vehicles/v2-plus"
    },
    {
      id: "v2lite",
      name: "V2 Lite",
      image: "/V2Lite.svg",
      link: "/vehicles/v2-lite"
    }
  ];

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (!mobileMenuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  };

  // Handle mouse enter event
  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setShowDropdown(true);
  };

  // Handle mouse leave event with delay
  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setShowDropdown(false);
    }, 300);
  };

  // Dropdown arrow SVG component
  const ChevronDown = () => (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="chevron-down"
    >
      <path 
        d="M6 9L12 15L18 9" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <header className="vida-header">
      <div className="vida-header__container">
        {/* Logo */}
        <div className="vida-header__logo">
          <Link to="/">
            <img src={vidaLogo} alt="VIDA Logo" />
          </Link>
        </div>
        
        {/* Navigation */}
        <nav className="vida-header__nav">
          <ul className="vida-header__nav-list">
            <li 
              className="vida-header__nav-item vida-header__nav-item--dropdown"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Link to="/vehicles" className="vida-header__nav-link">
                Vehicles
                <ChevronDown />
              </Link>
            </li>
            <li className="vida-header__nav-item">
              <Link to="/charging-network" className="vida-header__nav-link">
                Charging Network
              </Link>
            </li>
            <li className="vida-header__nav-item">
              <Link to="/dealer-locator" className="vida-header__nav-link">
                Dealer Locator
              </Link>
            </li>
          </ul>
        </nav>
        
        {/* CTA button on desktop */}
        <div className="vida-header__cta-wrapper">
          <Link to="/book-test-ride" className="vida-header__cta-button">
            Book a Test Ride
          </Link>
        </div>
        
        {/* Mobile menu toggle button */}
        <div 
          className="vida-header__mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <div className="hamburger-icon"></div>
        </div>
        
        {/* Vehicles dropdown - now as a separate element outside the nav item */}
        {showDropdown && (
          <div 
            className="vida-header__dropdown dropdown"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="vida-header__dropdown-content">
              <div className="vida-header__dropdown-vehicles">
                {vehicleModels.map((vehicle) => (
                  <Link 
                    key={vehicle.id} 
                    to={vehicle.link} 
                    className="vida-header__vehicle-item"
                  >
                    <div className="vida-header__vehicle-image">
                      <img src={vehicle.image} alt={vehicle.name} />
                    </div>
                    <span className="vida-header__vehicle-name">{vehicle.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="vida-header__mobile-menu" ref={mobileMenuRef}>
            <div className="vida-header__mobile-menu-header">
              <button 
                className="vida-header__mobile-menu-close"
                onClick={toggleMobileMenu}
                aria-label="Close mobile menu"
              >
                ×
              </button>
            </div>
            <nav className="vida-header__mobile-nav">
              <ul className="vida-header__mobile-nav-list">
                <li className="vida-header__mobile-nav-item vida-header__mobile-nav-item--dropdown">
                  <button 
                    className="vida-header__mobile-nav-link"
                    onClick={() => {
                      // Toggle mobile dropdown
                      const dropdown = document.querySelector('.vida-header__mobile-dropdown');
                      if (dropdown) {
                        dropdown.style.display = dropdown.style.display === 'none' ? 'flex' : 'none';
                      }
                    }}
                  >
                    Vehicles
                    <ChevronDown />
                  </button>
                  <div className="vida-header__mobile-dropdown dropdown">
                    {vehicleModels.map((vehicle) => (
                      <Link 
                        key={vehicle.id} 
                        to={vehicle.link} 
                        className="vida-header__mobile-vehicle-item"
                        onClick={toggleMobileMenu}
                      >
                        {vehicle.name}
                      </Link>
                    ))}
                  </div>
                </li>
                <li className="vida-header__mobile-nav-item">
                  <Link 
                    to="/charging-network" 
                    className="vida-header__mobile-nav-link"
                    onClick={toggleMobileMenu}
                  >
                    Charging Network
                  </Link>
                </li>
                <li className="vida-header__mobile-nav-item">
                  <Link 
                    to="/dealer-locator" 
                    className="vida-header__mobile-nav-link"
                    onClick={toggleMobileMenu}
                  >
                    Dealer Locator
                  </Link>
                </li>
                <li className="vida-header__mobile-nav-item">
                  <Link 
                    to="/book-test-ride" 
                    className="vida-header__mobile-nav-link"
                    onClick={toggleMobileMenu}
                  >
                    Book a Test Ride
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
