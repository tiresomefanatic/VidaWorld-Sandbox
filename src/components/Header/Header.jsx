import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Header.scss";
import vidaLogo from '../../../public/VidaLogo.svg'
import CloseHamburger from '../../../public/CloseHamburger.svg';
import Button from '../Button/Button';

// Sample config JSON for Header component
const headerConfig = {
  logo: '/VidaLogo.svg',
  closeHamburger: '/CloseHamburger.svg',
  nav: {
    products: 'Products',
    explore: 'Explore',
  },
  rightButtons: {
    testRide: 'Test Ride',
    buyNow: 'Buy Now',
  },
  vehicles: [
    { id: 'vx2plus', name: 'VX2 Plus', badge: 'NEW', image: '/VX2-Plus.svg', link: '/vehicles/vx2-plus', price: 'From ₹1,00,000' },
    { id: 'vx2go', name: 'VX2 Go', badge: 'NEW', image: '/VX2-Go.svg', link: '/vehicles/vx2-go', price: 'From ₹1,00,000' },
    { id: 'v2pro', name: 'V2 Pro', image: '/V2-Pro.svg', link: '/vehicles/v2-pro', price: 'From ₹1,00,000' },
    { id: 'v2plus', name: 'V2 Plus', image: '/V2-Plus.svg', link: '/vehicles/v2-plus', price: 'From ₹1,00,000' },
    { id: 'v2lite', name: 'V2 Lite', image: '/V2-Lite.svg', link: '/vehicles/v2-lite', price: 'From ₹1,00,000' },
  ],
  explore: [
    { id: 'service', name: 'Service', description: "Get your VIDA serviced with trusted care, backed by Hero's legacy.", link: '/service' },
    { id: 'charging-network', name: 'Charging Network', description: 'Access a growing network of fast, easy-to-use VIDA charging stations.', link: '/charging-network' },
    { id: 'road-side-assistance', name: 'Road Side Assistance', description: "We've got your back - anytime, anywhere with 24x7 RSA.", link: '/road-side-assistance' },
    { id: 'extended-battery-warranty', name: 'Extended Battery Warranty', description: 'Worry less with extra years of battery protection and performance.', link: '/extended-battery-warranty' },
    { id: 'vida-zip', name: 'VIDA ZIP', description: 'Pay-as-you-go battery subscription for lower upfront cost.', link: '/vida-zip' },
    { id: 'connectivity', name: 'Connectivity', description: 'Smart features on your app that make every ride more seamless.', link: '/connectivity' },
    { id: 'dealers-locator', name: 'Dealers Locator', description: 'Find VIDA dealerships and service centres near you.', link: '/dealers-locator' },
    { id: 'savings-calculator', name: 'Savings Calculator', description: 'See how much you save when you switch to electric.', link: '/savings-calculator' },
    { id: 'accessories', name: 'Accessories', description: 'Custom add-ons for style, safety, and everyday utility.', link: '/accessories' },
  ],
  exploreRightNav: [
    { id: 'log-in', name: 'Log In', link: '/log-in' },
    { id: 'sign-up', name: 'Sign Up', link: '/sign-up' },
    { id: 'faqs', name: 'FAQs', link: '/faqs' },
  ],
  mobile: {
    products: 'PRODUCTS',
    explore: 'EXPLORE',
    myAccount: 'MY ACCOUNT',
    vx2Series: 'VX2 Series',
    vx2Badge: 'NEW',
    v2Series: 'V2 Series',
    login: 'Login',
    signUp: 'Sign Up',
    faqs: 'FAQs',
    terms: 'Terms of Service',
    privacy: 'Privacy Policy',
    testRide: 'Test Ride',
    buyNow: 'Buy Now',
  },
};

// This component focuses on UI and CSS implementation matching the Figma design
const Header = ({ config = headerConfig }) => {
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

  // Use config for all text and image assets
  const vehicleModels = config.vehicles;
  const exploreItems = config.explore;
  const exploreRightNav = config.exploreRightNav;

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
            <img src={config.logo} alt="VIDA Logo" />
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
                {config.nav.products}
                <ChevronDown />
              </Link>
            </li>
            <li 
              className={`vida-header__nav-item vida-header__nav-item--dropdown${showExploreDropdown ? ' dropdown-open' : ''}`}
              onMouseEnter={handleExploreMouseEnter}
              onMouseLeave={handleExploreMouseLeave}
            >
              <Link to="/explore" className="vida-header__nav-link">
                {config.nav.explore}
                <ChevronDown />
              </Link>
            </li>
          </ul>
        </nav>
        
        {/* Right side buttons */}
        <div className="vida-header__right-buttons">
          <Link to="/test-ride" className="vida-header__top-link">
            {config.rightButtons.testRide}
          </Link>
          <Button
            label={config.rightButtons.buyNow}
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
            <div className="vida-header__dropdown-inner">
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
                    <div className="vida-header__vehicle-info">
                      <div className="vida-header__vehicle-name-row">
                        <span className="vida-header__vehicle-name">{vehicle.name}</span>
                        {vehicle.badge && <span className="vida-header__vehicle-badge">{vehicle.badge}</span>}
                      </div>
                      <span className="vida-header__vehicle-price">{vehicle.price}</span>
                    </div>
                  </Link>
                ))}
              </div>
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
            <div className="vida-header__dropdown-inner">
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
                  {exploreRightNav.map((nav) => (
                    <Link key={nav.id} to={nav.link} className="vida-header__dropdown-nav-item">
                      {nav.name}
                    </Link>
                  ))}
                </div>
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
                  <img src={config.logo} alt="VIDA Logo" />
                </Link>
              </div>
              <button 
                className="vida-header__mobile-close"
                onClick={toggleMobileMenu}
                aria-label="Close mobile menu"
              >
                <img src={config.closeHamburger} alt="Close menu" />
              </button>
            </div>

            <div className="vida-header__mobile-menu-container">
              {/* Mobile Menu Content */}
              <div className="vida-header__mobile-section">
                <div className="vida-header__mobile-section-header static">
                  {config.mobile.products}
                </div>
                <div className="vida-header__mobile-section-content open">
                  {/* VX2 Series Dropdown */}
                  <div
                    className={`vida-header__mobile-item vida-header__mobile-dropdown${mobileVX2Open ? ' open' : ''}`}
                    onClick={() => setMobileVX2Open(!mobileVX2Open)}
                    style={{cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}
                  >
                    <span style={{display: 'flex', alignItems: 'center', gap: 8}}>
                      {config.mobile.vx2Series}
                      <span className="vida-header__mobile-badge">{config.mobile.vx2Badge}</span>
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
                        <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                          <span>{vehicleModels.find(v => v.id === 'vx2plus')?.name || 'VX2 Plus'}</span>
                        </div>
                      </Link>
                      <Link
                        to="/vehicles/vx2-go"
                        className="vida-header__mobile-item vida-header__mobile-subitem"
                        onClick={toggleMobileMenu}
                        style={{paddingLeft: 32}}
                      >
                        <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                          <span>{vehicleModels.find(v => v.id === 'vx2go')?.name || 'VX2 Go'}</span>
                        </div>
                      </Link>
                    </div>
                  )}
                  {/* V2 Series Dropdown */}
                  <div
                    className={`vida-header__mobile-item vida-header__mobile-dropdown${mobileV2Open ? ' open' : ''}`}
                    onClick={() => setMobileV2Open(!mobileV2Open)}
                    style={{cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}
                  >
                    <span>{config.mobile.v2Series}</span>
                    <span className="vida-header__mobile-chevron" style={{display: 'flex', alignItems: 'center'}}>
                      <span style={{display: 'inline-flex', transition: 'transform 0.2s', transform: mobileV2Open ? 'rotate(180deg)' : 'none'}}>
                        <ChevronDown style={{width: 'var(--Button-fontSize, 16px)', height: '16px'}} />
                      </span>
                    </span>
                  </div>
                  {mobileV2Open && (
                    <div>
                      {['v2pro', 'v2plus', 'v2lite'].map((id) => {
                        const v = vehicleModels.find(v => v.id === id);
                        return v ? (
                          <Link
                            key={id}
                            to={v.link}
                            className="vida-header__mobile-item vida-header__mobile-subitem"
                            onClick={toggleMobileMenu}
                            style={{paddingLeft: 32}}
                          >
                            <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                              <span>{v.name}</span>
                              {v.badge && <span className="vida-header__mobile-badge">{v.badge}</span>}
                            </div>
                          </Link>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              </div>
              <div className="vida-header__mobile-separator"></div>
              <div className="vida-header__mobile-section">
                <div className="vida-header__mobile-section-header static">
                  {config.mobile.explore}
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
                    {config.mobile.faqs}
                  </Link>
                </div>
              </div>
              <div className="vida-header__mobile-separator"></div>
              <div className="vida-header__mobile-section">
                <div className="vida-header__mobile-section-header static">
                  {config.mobile.myAccount}
                </div>
                <div className="vida-header__mobile-section-content open">
                  <Link 
                    to="/login" 
                    className="vida-header__mobile-item"
                    onClick={toggleMobileMenu}
                  >
                    {config.mobile.login}
                  </Link>
                  <Link 
                    to="/sign-up" 
                    className="vida-header__mobile-item"
                    onClick={toggleMobileMenu}
                  >
                    {config.mobile.signUp}
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
                  {config.mobile.terms}
                </Link>
                <Link 
                  to="/privacy-policy" 
                  className="vida-header__mobile-footer-link"
                  onClick={toggleMobileMenu}
                >
                  {config.mobile.privacy}
                </Link>
              </div>
            </div>
            {/* Action Buttons - moved outside the menu container */}
            <div className="vida-header__mobile-actions">
              <Button
                className="vida-header__mobile-action-button"
                label={config.mobile.testRide}
                variant="primary"
                size="m"
                prominence="dark"
                visibility="off"
                roundness="circle"
                onClick={() => window.location.href = '/test-ride'}
              />
              <Button
                className="vida-header__mobile-action-button vida-header__mobile-action-button--buy"
                label={config.mobile.buyNow}
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
