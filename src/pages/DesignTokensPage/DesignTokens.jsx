import React, { useEffect, useState } from 'react';
import './DesignTokensPage.scss';
import { initializeDesignTokens } from '../../utils/designTokensLoader';
import { initializeHotReload } from '../../utils/tokenHotReload';

const DesignTokensPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Initialize design tokens when component mounts
    initializeDesignTokens();
    
    // Initialize hot reload functionality
    initializeHotReload();
    
    // Cleanup on unmount
    return () => {
      // Remove hot reload UI elements to avoid memory leaks
      const existingButton = document.querySelector('.watch-toggle-button');
      if (existingButton) {
        existingButton.remove();
      }
      
      const existingIndicator = document.querySelector('.watcher-status-indicator');
      if (existingIndicator) {
        existingIndicator.remove();
      }
    };
  }, []);

  // Handle search filter functionality
  useEffect(() => {
    const tokenCards = document.querySelectorAll('.token-card');
    const tokenSections = document.querySelectorAll('.token-section');
    const tokenGroups = document.querySelectorAll('.token-group');
    
    if (searchQuery.trim() === '') {
      // Show all cards and sections if search is empty
      tokenCards.forEach(card => {
        card.style.display = 'flex';
      });
      tokenSections.forEach(section => {
        section.style.display = 'block';
      });
      tokenGroups.forEach(group => {
        group.style.display = 'block';
      });
      return;
    }
    
    // Filter cards based on search query
    const query = searchQuery.toLowerCase();
    let visibleSections = new Set();
    let visibleGroups = new Set();
    
    tokenCards.forEach(card => {
      const nameElement = card.querySelector('.token-card__name');
      const name = nameElement?.textContent?.toLowerCase() || '';
      const valueElement = card.querySelector('.token-card__value');
      const value = valueElement?.textContent?.toLowerCase() || '';
      
      if (name.includes(query) || value.includes(query)) {
        card.style.display = 'flex';
        
        // Find parent section and group to make them visible
        const parentGroup = card.closest('.token-group');
        const parentSection = card.closest('.token-section');
        
        if (parentGroup) visibleGroups.add(parentGroup);
        if (parentSection) visibleSections.add(parentSection);
      } else {
        card.style.display = 'none';
      }
    });
    
    // Hide/show sections and groups based on matching cards
    tokenSections.forEach(section => {
      section.style.display = visibleSections.has(section) ? 'block' : 'none';
    });
    
    tokenGroups.forEach(group => {
      group.style.display = visibleGroups.has(group) ? 'block' : 'none';
    });
  }, [searchQuery]);

  // Simple container styles
  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
  };

  return (
    <div className="design-tokens-page">
      <div className="design-tokens-page__container">
        <h1>Design Tokens</h1>
        <p>Explore our design system's tokens and their values.</p>
        
        <div className="design-tokens-page__content">
          {/* File change instructions */}
          <div style={{
            margin: '2rem 0', 
            padding: '1rem', 
            borderRadius: '8px', 
            backgroundColor: '#F4F4F4',
            border: '1px solid #DFDFDF'
          }}>
            <h3 style={{marginTop: 0}}>Live Reload Instructions</h3>
            <p>
              This page displays all design tokens directly from your <code style={{fontFamily: 'monospace', backgroundColor: '#EAEAEA', padding: '2px 4px', borderRadius: '4px'}}>tokens.scss</code> file with automatic refresh capabilities.
            </p>
            <ol style={{paddingLeft: '1.5rem'}}>
              <li>Click the "Enable Live Reload" button to start watching for changes</li>
              <li>Edit your <code style={{fontFamily: 'monospace', backgroundColor: '#EAEAEA', padding: '2px 4px', borderRadius: '4px'}}>tokens.scss</code> file</li>
              <li>Save the file, and the visualization will update automatically</li>
            </ol>
          </div>
          
          {/* Search bar */}
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search tokens by name or value..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                className="search-clear-button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
          
          {/* Typography Primitives */}
          <section className="token-section">
            <h2 className="token-section__title">Typography Primitives</h2>
            
            <div className="token-group">
              <h3 className="token-group__title">Font Family</h3>
              <div className="token-card font-family-card">
                <div className="token-card__header">
                  <div className="token-card__name">$font-family-brand-sans-serif</div>
                  <div className="token-card__value">PP Neue Montreal</div>
                </div>
                <div className="token-card__preview font-family-preview">
                  The quick brown fox jumps over the lazy dog
                </div>
              </div>
            </div>
            
            <div className="token-group">
              <h3 className="token-group__title">Font Size</h3>
              <div className="token-grid">
                {Array.from({ length: 15 }, (_, i) => {
                  const level = i === 0 ? '50' : `${i}00`;
                  return (
                    <div key={`font-size-${level}-card`} className="token-card">
                      <div className="token-card__header">
                        <div className="token-card__name">{`$font-size-${level}`}</div>
                        <div className="token-card__value font-size-value" data-token={`font-size-${level}`}></div>
                      </div>
                      <div className="token-card__preview font-size-preview" data-token={`font-size-${level}`}>
                        Aa
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="token-group">
              <h3 className="token-group__title">Line Height</h3>
              <div className="token-grid">
                {Array.from({ length: 16 }, (_, i) => {
                  const level = i === 0 ? '100' : `${i}00`;
                  return (
                    <div key={`lineheight-${level}-card-${i}`} className="token-card">
                      <div className="token-card__header">
                        <div className="token-card__name">{`$line-height-${level}`}</div>
                        <div className="token-card__value line-height-value" data-token={`line-height-${level}`}></div>
                      </div>
                      <div className="token-card__preview line-height-preview" data-token={`line-height-${level}`}>
                        <div className="line"></div>
                        <div className="text">Line Height</div>
                        <div className="line"></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="token-group">
              <h3 className="token-group__title">Font Weight</h3>
              <div className="token-grid">
                {['light', 'book', 'regular', 'medium', 'semibold', 'bold'].map((weight) => (
                  <div key={`font-weight-${weight}-card`} className="token-card">
                    <div className="token-card__header">
                      <div className="token-card__name">{`$font-weight-${weight}`}</div>
                      <div className="token-card__value font-weight-value" data-token={`font-weight-${weight}`}></div>
                    </div>
                    <div className="token-card__preview font-weight-preview" data-token={`font-weight-${weight}`}>
                      The quick brown fox
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="token-group">
              <h3 className="token-group__title">Letter Spacing</h3>
              <div className="token-grid">
                {['xs', 's', 'm', 'l', 'xl', 'xxl'].map((size) => (
                  <div key={`letter-spacing-${size}-card`} className="token-card">
                    <div className="token-card__header">
                      <div className="token-card__name">{`$letter-spacing-${size}`}</div>
                      <div className="token-card__value letter-spacing-value" data-token={`letter-spacing-${size}`}></div>
                    </div>
                    <div className="token-card__preview letter-spacing-preview" data-token={`letter-spacing-${size}`}>
                      LETTER SPACING
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          {/* Spacing */}
          <section className="token-section">
            <h2 className="token-section__title">Spacing</h2>
            <div className="token-grid">
              {['2xs', 'xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl', '10xl', '11xl', '12xl'].map((size) => (
                <div key={`space-${size}-card`} className="token-card">
                  <div className="token-card__header">
                    <div className="token-card__name">{`$space-${size}`}</div>
                    <div className="token-card__value space-value" data-token={`space-${size}`}></div>
                  </div>
                  <div className="token-card__preview space-preview" data-token={`space-${size}`}>
                    <div className="space-block"></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          {/* Color Primitives */}
          <section className="token-section">
            <h2 className="token-section__title">Color Primitives</h2>
            
            {/* Brand Colors */}
            <div className="token-group">
              <h3 className="token-group__title">Brand Colors</h3>
              <div className="token-grid">
                {Array.from({ length: 9 }, (_, i) => {
                  const level = (i + 1) * 100;
                  return (
                    <div key={`brand-${level}-card`} className="token-card color-card">
                      <div className="token-card__preview color-preview" data-token={`brand-${level}`}></div>
                      <div className="token-card__header">
                        <div className="token-card__name">{`$brand-${level}`}</div>
                        <div className="token-card__value color-value" data-token={`brand-${level}`}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Neutral Colors */}
            <div className="token-group">
              <h3 className="token-group__title">Neutral Colors</h3>
              <div className="token-grid">
                {['50', ...Array.from({ length: 18 }, (_, i) => (i + 1) * 50)].map((level, idx) => (
                  <div key={`neutral-${level}-card-${idx}`} className="token-card color-card">
                    <div className="token-card__preview color-preview" data-token={`neutral-${level}`}></div>
                    <div className="token-card__header">
                      <div className="token-card__name">{`$neutral-${level}`}</div>
                      <div className="token-card__value color-value" data-token={`neutral-${level}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Other Color Palettes */}
            {['cyan', 'red', 'yellow', 'green', 'blue'].map((colorName) => (
              <div key={`${colorName}-color-group`} className="token-group">
                <h3 className="token-group__title">{`${colorName.charAt(0).toUpperCase() + colorName.slice(1)} Colors`}</h3>
                <div className="token-grid">
                  {Array.from({ length: 9 }, (_, i) => {
                    const level = (i + 1) * 100;
                    return (
                      <div key={`${colorName}-${level}-card`} className="token-card color-card">
                        <div className="token-card__preview color-preview" data-token={`${colorName}-${level}`}></div>
                        <div className="token-card__header">
                          <div className="token-card__name">{`$${colorName}-${level}`}</div>
                          <div className="token-card__value color-value" data-token={`${colorName}-${level}`}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            
            {/* Transparent Colors */}
            <div className="token-group">
              <h3 className="token-group__title">Transparent Colors</h3>
              <div className="token-grid">
                {['transparent-black-50', 'transparent-white-50'].map((token) => (
                  <div key={`${token}-card`} className="token-card color-card">
                    <div className="token-card__preview color-preview gradient-bg" data-token={token}></div>
                    <div className="token-card__header">
                      <div className="token-card__name">{`$${token}`}</div>
                      <div className="token-card__value color-value" data-token={token}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          {/* Border */}
          <section className="token-section">
            <h2 className="token-section__title">Border</h2>
            
            {/* Border Radius */}
            <div className="token-group">
              <h3 className="token-group__title">Border Radius</h3>
              <div className="token-grid">
                {['circle', 'pill', 'l', 'm', 's', 'xs'].map((size) => (
                  <div key={`radius-${size}-card`} className="token-card">
                    <div className="token-card__header">
                      <div className="token-card__name">{`$radius-${size}`}</div>
                      <div className="token-card__value radius-value" data-token={`radius-${size}`}></div>
                    </div>
                    <div className="token-card__preview radius-preview" data-token={`radius-${size}`}></div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Border Width */}
            <div className="token-group">
              <h3 className="token-group__title">Border Width</h3>
              <div className="token-grid">
                {['xl', 'l', 'm', 's', 'xs'].map((size) => (
                  <div key={`width-${size}-card`} className="token-card">
                    <div className="token-card__header">
                      <div className="token-card__name">{`$width-${size}`}</div>
                      <div className="token-card__value width-value" data-token={`width-${size}`}></div>
                    </div>
                    <div className="token-card__preview width-preview" data-token={`width-${size}`}></div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          {/* Layout */}
          <section className="token-section">
            <h2 className="token-section__title">Layout</h2>
            <div className="token-group">
              <h3 className="token-group__title">Breakpoints</h3>
              <div className="token-grid">
                {['xl', 'l', 'm', 's'].map((size) => (
                  <div key={`breakpoint-${size}-card`} className="token-card">
                    <div className="token-card__header">
                      <div className="token-card__name">{`$breakpoint-${size}`}</div>
                      <div className="token-card__value breakpoint-value" data-token={`breakpoint-${size}`}></div>
                    </div>
                    <div className="token-card__preview breakpoint-preview" data-token={`breakpoint-${size}`}>
                      <div className="screen-indicator"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          {/* Semantic Colors */}
          <section className="token-section">
            <h2 className="token-section__title">Semantic Colors</h2>
            <div className="token-grid semantic-colors-grid">
              {[
                /* Content colors */
                'content-primary', 'content-secondary', 'content-tertiary',
                'content-primary-inverse', 'content-secondary-inverse', 'content-tertiary-inverse',
                'content-disabled', 'content-brand', 'content-link', 'content-link-hover',
                'content-link-pressed', 'content-notice', 'content-notice-bold',
                'content-negative', 'content-negative-bold', 'content-positive', 'content-positive-bold',
                
                /* Background colors */
                'background-primary', 'background-hover', 'background-pressed', 'background-selected',
                'background-disabled', 'background-inverse', 'background-brand', 'background-brand-hover',
                'background-brand-pressed', 'background-info', 'background-info-subtle',
                'background-notice', 'background-notice-subtle', 'background-negative',
                'background-negative-subtle', 'background-positive', 'background-positive-subtle',
                
                /* Border colors */
                'border-primary', 'border-secondary', 'border-tertiary', 'border-disabled',
                'border-inverse', 'border-brand', 'border-focus', 'border-info',
                'border-notice', 'border-negative', 'border-positive',
                
                /* Surface levels */
                'surface-l0', 'surface-l1', 'surface-l2', 'surface-l3', 'surface-l4', 'surface-l5', 'surface-l6',
                
                /* Overlay */
                'overlay-50', 'overlay-50-inverse', 'content-brand-focus'
              ].map((token, idx) => (
                <div key={`${token}-card-${idx}`} className="token-card color-card">
                  <div className="token-card__preview semantic-color-preview" data-token={token}></div>
                  <div className="token-card__header">
                    <div className="token-card__name">{`$${token}`}</div>
                    <div className="token-card__value semantic-color-value" data-token={token}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          {/* Component Tokens */}
          <section className="token-section">
            <h2 className="token-section__title">Component Tokens</h2>
            
            <div className="token-group">
              <h3 className="token-group__title">Prominence</h3>
              <p>Used to define visual hierarchy for components like buttons.</p>
              <div className="component-preview-grid">
                {['Primary', 'Secondary', 'Tertiary'].map((prominence) => (
                  <div key={`prominence-${prominence}`} className="component-preview-card">
                    <div className="component-preview-card__title">{prominence}</div>
                    <div className="component-preview-card__content">
                      <div className="component-preview-row">
                        <div className="component-preview-label">Fill:</div>
                        <div className="component-preview-value">{`var(--${prominence.toLowerCase()}-fill)`}</div>
                      </div>
                      <div className="component-preview-row">
                        <div className="component-preview-label">Stroke:</div>
                        <div className="component-preview-value">{`var(--${prominence.toLowerCase()}-stroke)`}</div>
                      </div>
                      <div className="component-preview-row">
                        <div className="component-preview-label">Text Color:</div>
                        <div className="component-preview-value">{`var(--${prominence.toLowerCase()}-text-color)`}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="token-group">
              <h3 className="token-group__title">Size</h3>
              <div className="component-preview-grid">
                {['S', 'M', 'L'].map((size) => (
                  <div key={`size-${size}`} className="component-preview-card">
                    <div className="component-preview-card__title">Size {size}</div>
                    <div className="component-preview-card__content">
                      <div className="component-preview-row">
                        <div className="component-preview-label">Horizontal Padding:</div>
                        <div className="component-preview-value">{`var(--space-${size === 'S' ? 'm' : size === 'M' ? 'l' : 'xl'})`}</div>
                      </div>
                      <div className="component-preview-row">
                        <div className="component-preview-label">Vertical Padding:</div>
                        <div className="component-preview-value">{`var(--space-${size === 'S' ? 's' : size === 'M' ? 'm' : 'l'})`}</div>
                      </div>
                      <div className="component-preview-row">
                        <div className="component-preview-label">Font Size:</div>
                        <div className="component-preview-value">{`var(--label-label-${size.toLowerCase()}-medium-font-size)`}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="token-group">
              <h3 className="token-group__title">States</h3>
              <div className="component-preview-grid">
                {['Default', 'Hover', 'Pressed'].map((state) => (
                  <div key={`state-${state}`} className="component-preview-card">
                    <div className="component-preview-card__title">{state}</div>
                    <div className="component-preview-card__content component-state-preview" data-state={state.toLowerCase()}>
                      <div className="button-preview primary-button">Primary</div>
                      <div className="button-preview secondary-button">Secondary</div>
                      <div className="button-preview tertiary-button">Tertiary</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DesignTokensPage;