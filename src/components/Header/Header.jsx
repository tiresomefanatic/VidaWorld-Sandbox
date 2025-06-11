import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Header.scss";
import vidaLogo from '../../../public/VidaHeaderLogo.svg'
import Button from '../Button/Button';

// This component focuses on UI and CSS implementation matching the Figma design
const Header = () => {
  const [showProductsDropdown, setShowProductsDropdown] = useState(false);
  const [showExploreDropdown, setShowExploreDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
              className="vida-header__nav-item vida-header__nav-item--dropdown"
              onMouseEnter={handleProductsMouseEnter}
              onMouseLeave={handleProductsMouseLeave}
            >
              <Link to="/vehicles" className="vida-header__nav-link">
                Products
                <ChevronDown />
              </Link>
            </li>
            <li className="vida-header__nav-item">
              <Button
                label="Book a Test Ride"
                variant="primary"
                size="m"
                prominence="dark"
                visibility="off"
                onClick={() => window.location.href = '/book-test-ride'}
                className="vida-header__nav-button-component"
              />
            </li>
            <li 
              className="vida-header__nav-item vida-header__nav-item--dropdown"
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
        
        {/* Mobile menu toggle button */}
        <div 
          className="vida-header__mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <div className="hamburger-icon"></div>
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
          </div>
        </div>
        
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
                      const dropdown = document.querySelector('.vida-header__mobile-dropdown.products');
                      if (dropdown) {
                        dropdown.style.display = dropdown.style.display === 'none' ? 'flex' : 'none';
                      }
                    }}
                  >
                    Products
                    <ChevronDown />
                  </button>
                  <div className="vida-header__mobile-dropdown dropdown products">
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
                  <Button
                    label="Book a Test Ride"
                    variant="primary"
                    size="m"
                    prominence="dark"
                    visibility="off"
                    onClick={() => window.location.href = '/book-test-ride'}
                    className="vida-header__mobile-nav-button-component"
                  />
                </li>
                <li className="vida-header__mobile-nav-item vida-header__mobile-nav-item--dropdown">
                  <button 
                    className="vida-header__mobile-nav-link"
                    onClick={() => {
                      // Toggle mobile dropdown
                      const dropdown = document.querySelector('.vida-header__mobile-dropdown.explore');
                      if (dropdown) {
                        dropdown.style.display = dropdown.style.display === 'none' ? 'flex' : 'none';
                      }
                    }}
                  >
                    Explore
                    <ChevronDown />
                  </button>
                  <div className="vida-header__mobile-dropdown dropdown explore">
                    {exploreItems.map((item) => (
                      <Link 
                        key={item.id} 
                        to={item.link} 
                        className="vida-header__mobile-vehicle-item"
                        onClick={toggleMobileMenu}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
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
