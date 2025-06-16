import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Header.scss";
import vidaLogo from '../../../public/VidaLogo.svg'
import CloseHamburger from '../../../public/CloseHamburger.svg';
import Button from '../Button/Button';

// This component focuses on UI and CSS implementation matching the Figma design
const Header = () => {
  const [showProductsDropdown, setShowProductsDropdown] = useState(false);
  const [showExploreDropdown, setShowExploreDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileExploreOpen, setMobileExploreOpen] = useState(false);
  const [mobileVX2Open, setMobileVX2Open] = useState(false);
  const [mobileV2Open, setMobileV2Open] = useState(false);
  const productsDropdownTimeoutRef = useRef(null);
  const exploreDropdownTimeoutRef = useRef(null);
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
      if (productsDropdownTimeoutRef.current) {
        clearTimeout(productsDropdownTimeoutRef.current);
      }
      if (exploreDropdownTimeoutRef.current) {
        clearTimeout(exploreDropdownTimeoutRef.current);
      }
    };
  }, []);

  // Vehicle models data for the products dropdown - using SVGs from public folder
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
      image: "/VX2Go.svg",
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

  // Explore dropdown content - matching exact Figma design structure
  const exploreItems = [
    {
      id: "service",
      name: "Service",
      description: "Lorem ipsum dolor sit amet",
      link: "/service"
    },
    {
      id: "extended-battery-warranty",
      name: "Extended Battery Warranty",
      description: "Lorem ipsum dolor sit amet",
      link: "/extended-battery-warranty"
    },
    {
      id: "battery-as-service",
      name: "Battery As A Service", 
      description: "Lorem ipsum dolor sit amet",
      link: "/battery-as-service"
    },
    {
      id: "dealers-locator",
      name: "Dealers Locator",
      description: "Lorem ipsum dolor sit amet", 
      link: "/dealers-locator"
    },
    {
      id: "charging-network",
      name: "Charging Network",
      description: "Lorem ipsum dolor sit amet",
      link: "/charging-network"
    },
    {
      id: "road-side-assistance", 
      name: "Road Side Assistance",
      description: "Lorem ipsum dolor sit amet",
      link: "/road-side-assistance"
    },
    {
      id: "savings-calculator",
      name: "Savings Calculator",
      description: "Lorem ipsum dolor sit amet",
      link: "/savings-calculator"
    },
    {
      id: "accessories",
      name: "Accessories",
      description: "Lorem ipsum dolor sit amet",
      link: "/accessories"
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

  // Handle Products dropdown mouse events
  const handleProductsMouseEnter = () => {
    if (productsDropdownTimeoutRef.current) {
      clearTimeout(productsDropdownTimeoutRef.current);
      productsDropdownTimeoutRef.current = null;
    }
    setShowProductsDropdown(true);
    setShowExploreDropdown(false);
  };

  const handleProductsMouseLeave = () => {
    productsDropdownTimeoutRef.current = setTimeout(() => {
      setShowProductsDropdown(false);
    }, 300);
  };

  // Handle Explore dropdown mouse events
  const handleExploreMouseEnter = () => {
    if (exploreDropdownTimeoutRef.current) {
      clearTimeout(exploreDropdownTimeoutRef.current);
      exploreDropdownTimeoutRef.current = null;
    }
    setShowExploreDropdown(true);
    setShowProductsDropdown(false);
  };

  const handleExploreMouseLeave = () => {
    exploreDropdownTimeoutRef.current = setTimeout(() => {
      setShowExploreDropdown(false);
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
              className={`vida-header__nav-item vida-header__nav-item--dropdown${showProductsDropdown ? ' dropdown-open' : ''}`}
              onMouseEnter={handleProductsMouseEnter}
              onMouseLeave={handleProductsMouseLeave}
            >
              <Link to="/vehicles" className="vida-header__nav-link">
                Products
                <ChevronDown />
              </Link>
            </li>
            <li 
              className={`vida-header__nav-item vida-header__nav-item--dropdown${showExploreDropdown ? ' dropdown-open' : ''}`}
              onMouseEnter={handleExploreMouseEnter}
              onMouseLeave={handleExploreMouseLeave}
            >
              <Link to="/explore" className="vida-header__nav-link">
                Explore
                <ChevronDown />
              </Link>
            </li>
          </ul>
        </nav>
        
        {/* Right side buttons */}
        <div className="vida-header__right-buttons">
          <Link to="/test-ride" className="vida-header__top-link">
            Test Ride
          </Link>
          <Button
            label="Buy Now"
            variant="secondary"
            size="s"
            prominence="dark"
            visibility="off"
            roundness="circle"
            onClick={() => window.location.href = '/buy-now'}
          />
        </div>
        
        {/* Mobile menu toggle button */}
        <div className="vida-header__mobile-nav">
          <button
            className="vida-header__mobile-menu-button"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <div className={`vida-header__hamburger ${mobileMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>
        
        {/* Products dropdown */}
        <div 
          className={`vida-header__dropdown dropdown ${showProductsDropdown ? 'show' : ''}`}
          onMouseEnter={handleProductsMouseEnter}
          onMouseLeave={handleProductsMouseLeave}
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

        {/* Explore dropdown */}
        <div 
          className={`vida-header__dropdown dropdown explore-dropdown ${showExploreDropdown ? 'show' : ''}`}
          onMouseEnter={handleExploreMouseEnter}
          onMouseLeave={handleExploreMouseLeave}
        >
          <div className="vida-header__dropdown-content">
            <div className="vida-header__dropdown-vehicles">
              <div className="vida-header__dropdown-grid">
                {exploreItems.map((item) => (
                  <Link 
                    key={item.id} 
                    to={item.link} 
                    className="vida-header__vehicle-item"
                  >
                    <span className="vida-header__vehicle-name">{item.name}</span>
                    <span className="vida-header__vehicle-description">{item.description}</span>
                  </Link>
                ))}
              </div>
              
              {/* Vertical separator line */}
              <div className="vida-header__dropdown-separator"></div>
              
              {/* Right side navigation items */}
              <div className="vida-header__dropdown-right-nav">
                <Link to="/log-in" className="vida-header__dropdown-nav-item">
                  Log In
                </Link>
                <Link to="/sign-up" className="vida-header__dropdown-nav-item">
                  Sign Up
                </Link>
                <Link to="/faqs" className="vida-header__dropdown-nav-item">
                  FAQs
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className={`vida-header__mobile-menu ${mobileMenuOpen ? 'open' : ''}`} ref={mobileMenuRef}>
            {/* Mobile Header with Logo and Close Button */}
            <div className="vida-header__mobile-header">
              <div className="vida-header__mobile-logo">
                <Link to="/" onClick={toggleMobileMenu}>
                  <img src={vidaLogo} alt="VIDA Logo" />
                </Link>
              </div>
              <button 
                className="vida-header__mobile-close"
                onClick={toggleMobileMenu}
                aria-label="Close mobile menu"
              >
                <img src={CloseHamburger} alt="Close menu" />
              </button>
            </div>

            <div className="vida-header__mobile-menu-container">
              {/* Mobile Menu Content */}
              <div className="vida-header__mobile-section">
                <div className="vida-header__mobile-section-header static">
                  PRODUCTS
                </div>
                <div className="vida-header__mobile-section-content open">
                  {/* VX2 Series Dropdown */}
                  <div
                    className={`vida-header__mobile-item vida-header__mobile-dropdown${mobileVX2Open ? ' open' : ''}`}
                    onClick={() => setMobileVX2Open(!mobileVX2Open)}
                    style={{cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}
                  >
                    <span style={{display: 'flex', alignItems: 'center', gap: 8}}>
                      VX2 Series
                      <span className="vida-header__mobile-badge">New</span>
                    </span>
                    <span className="vida-header__mobile-chevron" style={{display: 'flex', alignItems: 'center'}}>
                      <span style={{display: 'inline-flex', transition: 'transform 0.2s', transform: mobileVX2Open ? 'rotate(180deg)' : 'none'}}>
                        <ChevronDown style={{width: 'var(--Button-fontSize, 16px)', height: '16px'}} />
                      </span>
                    </span>
                  </div>
                  {mobileVX2Open && (
                    <div>
                      <Link
                        to="/vehicles/vx2-plus"
                        className="vida-header__mobile-item vida-header__mobile-subitem"
                        onClick={toggleMobileMenu}
                        style={{paddingLeft: 32}}
                      >
                        VX2 Plus
                      </Link>
                      <Link
                        to="/vehicles/vx2-go"
                        className="vida-header__mobile-item vida-header__mobile-subitem"
                        onClick={toggleMobileMenu}
                        style={{paddingLeft: 32}}
                      >
                        VX2 Go
                      </Link>
                    </div>
                  )}
                  {/* V2 Series Dropdown */}
                  <div
                    className={`vida-header__mobile-item vida-header__mobile-dropdown${mobileV2Open ? ' open' : ''}`}
                    onClick={() => setMobileV2Open(!mobileV2Open)}
                    style={{cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}
                  >
                    <span>V2 Series</span>
                    <span className="vida-header__mobile-chevron" style={{display: 'flex', alignItems: 'center'}}>
                      <span style={{display: 'inline-flex', transition: 'transform 0.2s', transform: mobileV2Open ? 'rotate(180deg)' : 'none'}}>
                        <ChevronDown style={{width: 'var(--Button-fontSize, 16px)', height: '16px'}} />
                      </span>
                    </span>
                  </div>
                  {mobileV2Open && (
                    <div>
                      <Link
                        to="/vehicles/v2-pro"
                        className="vida-header__mobile-item vida-header__mobile-subitem"
                        onClick={toggleMobileMenu}
                        style={{paddingLeft: 32}}
                      >
                        V2 Pro
                      </Link>
                      <Link
                        to="/vehicles/v2-plus"
                        className="vida-header__mobile-item vida-header__mobile-subitem"
                        onClick={toggleMobileMenu}
                        style={{paddingLeft: 32}}
                      >
                        V2 Plus
                      </Link>
                      <Link
                        to="/vehicles/v2-lite"
                        className="vida-header__mobile-item vida-header__mobile-subitem"
                        onClick={toggleMobileMenu}
                        style={{paddingLeft: 32}}
                      >
                        V2 Lite
                      </Link>
                    </div>
                  )}
                </div>
              </div>
              <div className="vida-header__mobile-separator"></div>
              <div className="vida-header__mobile-section">
                <div className="vida-header__mobile-section-header static">
                  EXPLORE
                </div>
                <div className="vida-header__mobile-section-content open">
                  {exploreItems.map((item) => (
                    <Link 
                      key={item.id}
                      to={item.link} 
                      className="vida-header__mobile-item"
                      onClick={toggleMobileMenu}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <Link 
                    to="/faqs" 
                    className="vida-header__mobile-item"
                    onClick={toggleMobileMenu}
                  >
                    FAQs
                  </Link>
                </div>
              </div>
              <div className="vida-header__mobile-separator"></div>
              <div className="vida-header__mobile-section">
                <div className="vida-header__mobile-section-header static">
                  MY ACCOUNT
                </div>
                <div className="vida-header__mobile-section-content open">
                  <Link 
                    to="/login" 
                    className="vida-header__mobile-item"
                    onClick={toggleMobileMenu}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/sign-up" 
                    className="vida-header__mobile-item"
                    onClick={toggleMobileMenu}
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
              <div className="vida-header__mobile-separator"></div>
              <div className="vida-header__mobile-footer">
                <Link 
                  to="/terms-of-service" 
                  className="vida-header__mobile-footer-link"
                  onClick={toggleMobileMenu}
                >
                  Terms of Service
                </Link>
                <Link 
                  to="/privacy-policy" 
                  className="vida-header__mobile-footer-link"
                  onClick={toggleMobileMenu}
                >
                  Privacy Policy
                </Link>
              </div>
            </div>
            {/* Action Buttons - moved outside the menu container */}
            <div className="vida-header__mobile-actions">
              <Button
                className="vida-header__mobile-action-button"
                label="Test Ride"
                variant="primary"
                size="m"
                prominence="light"
                visibility="off"
                roundness="circle"
                onClick={() => window.location.href = '/test-ride'}
              />
              <Button
                className="vida-header__mobile-action-button vida-header__mobile-action-button--buy"
                label="Buy Now"
                variant="secondary"
                size="m"
                prominence="dark"
                visibility="off"
                roundness="circle"
                onClick={() => window.location.href = '/buy-now'}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
