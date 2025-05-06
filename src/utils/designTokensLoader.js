/**
 * Design Tokens Loader - Direct SCSS Version
 * 
 * This utility loads and processes design tokens for visual display
 * on the design tokens page, always using the exact values from tokens.scss.
 */

import { 
  extractScssTokens, 
  getTokenValue
} from './tokensExtractor';

// Main initialization function to be called when the page loads
export function initializeDesignTokens() {
  console.log('Initializing design tokens display...');
  
  // Wait for the DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupTokenDisplays);
  } else {
    setupTokenDisplays();
  }
}

// Setup all token displays
async function setupTokenDisplays() {
  console.log('Setting up token displays...');
  
  try {
    // Pre-load tokens to ensure they're available
    const tokens = await extractScssTokens(true);
    
    if (!tokens || Object.keys(tokens).length === 0) {
      throw new Error("No design tokens were extracted from the SCSS file.");
    }
    
    // Load token values into the preview elements
    await Promise.all([
      loadFontSizes(),
      loadLineHeights(),
      loadFontWeights(),
      loadLetterSpacing(),
      loadSpacing(),
      loadColors(),
      loadBorderRadius(),
      loadBorderWidths(),
      loadBreakpoints(),
      loadSemanticColors()
    ]);
    
    // Setup refresh button to update from SCSS
    addRefreshButton();
    
    console.log('Token displays setup complete');
  } catch (error) {
    console.error('Error setting up token displays:', error);
    
    // Show error message on the page
    showErrorMessage(error);
  }
}

// Show error message on the page
function showErrorMessage(error) {
  const container = document.querySelector('.design-tokens-page__container');
  if (container) {
    // Remove any existing error messages
    const existingError = document.querySelector('.token-error-message');
    if (existingError) {
      existingError.remove();
    }
    
    const errorMessage = document.createElement('div');
    errorMessage.className = 'token-error-message';
    errorMessage.innerHTML = `
      <h3>Error Loading Design Tokens</h3>
      <p>${error.message}</p>
      <p>To fix this issue:</p>
      <ol>
        <li>Make sure your <code>tokens.scss</code> file contains valid SCSS variable declarations (e.g., <code>$variable-name: value;</code>)</li>
        <li>Check that the server is properly configured to serve raw SCSS files through the raw-scss endpoint</li>
        <li>Ensure Vite is running with the proper configuration</li>
      </ol>
      <p>If issues persist, try restarting your development server.</p>
      <button class="refresh-button">Try Again</button>
    `;
    
    // Add styles
    errorMessage.style.cssText = `
      margin: 2rem 0;
      padding: 1.5rem;
      border-radius: 8px;
      background-color: #FFCCCC;
      border: 1px solid #FF3333;
      color: #660000;
      font-size: 14px;
      line-height: 1.5;
    `;
    
    const refreshButton = errorMessage.querySelector('.refresh-button');
    refreshButton.style.cssText = `
      margin-top: 1rem;
      padding: 8px 16px;
      background-color: #FF3333;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
    `;
    
    container.prepend(errorMessage);
    
    // Add event listener to refresh button
    refreshButton.addEventListener('click', () => {
      errorMessage.remove();
      setupTokenDisplays();
    });
  }
}

// Add refresh button to reload tokens from SCSS
function addRefreshButton() {
  // Find the body element to append to
  const body = document.body;
  
  if (body) {
    // Remove any existing refresh button
    const existingRefresh = document.querySelector('.refresh-tokens-button');
    if (existingRefresh) {
      existingRefresh.remove();
    }
    
    const refreshButton = document.createElement('button');
    refreshButton.textContent = 'Refresh Tokens';
    refreshButton.className = 'refresh-tokens-button';
    refreshButton.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 12px 16px;
      background-color: #3F3D3D;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      z-index: 9999;
      font-weight: 500;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    `;
    
    refreshButton.addEventListener('click', async () => {
      refreshButton.disabled = true;
      refreshButton.textContent = 'Refreshing...';
      
      try {
        // Force refresh of token cache
        await extractScssTokens(true);
        
        // Reload all token displays
        await setupTokenDisplays();
        
        refreshButton.textContent = 'Tokens Refreshed!';
        
        // Reset button after 2 seconds
        setTimeout(() => {
          refreshButton.textContent = 'Refresh Tokens';
          refreshButton.disabled = false;
        }, 2000);
      } catch (error) {
        console.error('Error refreshing tokens:', error);
        refreshButton.textContent = 'Refresh Failed';
        alert('Error refreshing tokens: ' + error.message);
        
        // Reset button after 2 seconds
        setTimeout(() => {
          refreshButton.textContent = 'Refresh Tokens';
          refreshButton.disabled = false;
        }, 2000);
      }
    });
    
    body.appendChild(refreshButton);
    console.log('Refresh button added');
  }
}

// Load font sizes
async function loadFontSizes() {
  console.log('Loading font sizes...');
  const fontSizePreviews = document.querySelectorAll('.font-size-preview');
  const fontSizeValues = document.querySelectorAll('.font-size-value');
  
  for (const preview of fontSizePreviews) {
    const tokenName = preview.dataset.token;
    const scssValue = await getTokenValue(tokenName);
    
    if (scssValue) {
      preview.style.fontSize = scssValue;
      
      // Find the corresponding value element and update it
      const valueElement = Array.from(fontSizeValues).find(el => el.dataset.token === tokenName);
      if (valueElement) {
        valueElement.textContent = scssValue;
      }
    }
  }
}

// Load line heights
async function loadLineHeights() {
  console.log('Loading line heights...');
  const lineHeightPreviews = document.querySelectorAll('.line-height-preview');
  const lineHeightValues = document.querySelectorAll('.line-height-value');
  
  for (const preview of lineHeightPreviews) {
    const tokenName = preview.dataset.token;
    const scssValue = await getTokenValue(tokenName);
    
    if (scssValue) {
      // For previews, set the height of the preview container
      preview.style.height = 'auto'; // Reset first
      
      // Find text element and set its line height
      const textElement = preview.querySelector('.text');
      if (textElement) {
        textElement.style.lineHeight = scssValue;
      }
      
      // Find the corresponding value element and update it
      const valueElement = Array.from(lineHeightValues).find(el => el.dataset.token === tokenName);
      if (valueElement) {
        valueElement.textContent = scssValue;
      }
    }
  }
}

// Load font weights
async function loadFontWeights() {
  console.log('Loading font weights...');
  const fontWeightPreviews = document.querySelectorAll('.font-weight-preview');
  const fontWeightValues = document.querySelectorAll('.font-weight-value');
  
  for (const preview of fontWeightPreviews) {
    const tokenName = preview.dataset.token;
    const scssValue = await getTokenValue(tokenName);
    
    if (scssValue) {
      preview.style.fontWeight = scssValue;
      
      // Find the corresponding value element and update it
      const valueElement = Array.from(fontWeightValues).find(el => el.dataset.token === tokenName);
      if (valueElement) {
        valueElement.textContent = scssValue;
      }
    }
  }
}

// Load letter spacing
async function loadLetterSpacing() {
  console.log('Loading letter spacing...');
  const letterSpacingPreviews = document.querySelectorAll('.letter-spacing-preview');
  const letterSpacingValues = document.querySelectorAll('.letter-spacing-value');
  
  for (const preview of letterSpacingPreviews) {
    const tokenName = preview.dataset.token;
    const scssValue = await getTokenValue(tokenName);
    
    if (scssValue) {
      preview.style.letterSpacing = scssValue;
      
      // Find the corresponding value element and update it
      const valueElement = Array.from(letterSpacingValues).find(el => el.dataset.token === tokenName);
      if (valueElement) {
        valueElement.textContent = scssValue;
      }
    }
  }
}

// Load spacing values
async function loadSpacing() {
  console.log('Loading spacing values...');
  const spacePreviews = document.querySelectorAll('.space-preview');
  const spaceValues = document.querySelectorAll('.space-value');
  
  for (const preview of spacePreviews) {
    const tokenName = preview.dataset.token;
    const scssValue = await getTokenValue(tokenName);
    
    if (scssValue) {
      const spaceBlock = preview.querySelector('.space-block');
      if (spaceBlock) {
        spaceBlock.style.width = scssValue;
        spaceBlock.style.height = scssValue;
      }
      
      // Find the corresponding value element and update it
      const valueElement = Array.from(spaceValues).find(el => el.dataset.token === tokenName);
      if (valueElement) {
        valueElement.textContent = scssValue;
      }
    }
  }
}

// Load color values
async function loadColors() {
  console.log('Loading colors...');
  const colorPreviews = document.querySelectorAll('.color-preview:not(.semantic-color-preview)');
  const colorValues = document.querySelectorAll('.color-value:not(.semantic-color-value)');
  
  for (const preview of colorPreviews) {
    const tokenName = preview.dataset.token;
    const scssValue = await getTokenValue(tokenName);
    
    if (scssValue) {
      preview.style.backgroundColor = scssValue;
      
      // Find the corresponding value element and update it
      const valueElement = Array.from(colorValues).find(el => el.dataset.token === tokenName);
      if (valueElement) {
        valueElement.textContent = scssValue;
      }
    }
  }
}

// Load border radius values
async function loadBorderRadius() {
  console.log('Loading border radius values...');
  const radiusPreviews = document.querySelectorAll('.radius-preview');
  const radiusValues = document.querySelectorAll('.radius-value');
  
  for (const preview of radiusPreviews) {
    const tokenName = preview.dataset.token;
    const scssValue = await getTokenValue(tokenName);
    
    if (scssValue) {
      preview.style.borderRadius = scssValue;
      
      // Find the corresponding value element and update it
      const valueElement = Array.from(radiusValues).find(el => el.dataset.token === tokenName);
      if (valueElement) {
        valueElement.textContent = scssValue;
      }
    }
  }
}

// Load border width values
async function loadBorderWidths() {
  console.log('Loading border width values...');
  const widthPreviews = document.querySelectorAll('.width-preview');
  const widthValues = document.querySelectorAll('.width-value');
  
  for (const preview of widthPreviews) {
    const tokenName = preview.dataset.token;
    const scssValue = await getTokenValue(tokenName);
    
    if (scssValue) {
      preview.style.borderWidth = scssValue;
      
      // Find the corresponding value element and update it
      const valueElement = Array.from(widthValues).find(el => el.dataset.token === tokenName);
      if (valueElement) {
        valueElement.textContent = scssValue;
      }
    }
  }
}

// Load breakpoint values
async function loadBreakpoints() {
  console.log('Loading breakpoint values...');
  const breakpointPreviews = document.querySelectorAll('.breakpoint-preview');
  const breakpointValues = document.querySelectorAll('.breakpoint-value');
  
  for (const preview of breakpointPreviews) {
    const tokenName = preview.dataset.token;
    const scssValue = await getTokenValue(tokenName);
    
    if (scssValue) {
      // Update the screen indicator to show the breakpoint size
      const indicator = preview.querySelector('.screen-indicator');
      if (indicator) {
        indicator.style.width = `calc(${scssValue} / 10)`;
        indicator.setAttribute('title', scssValue);
      }
      
      // Find the corresponding value element and update it
      const valueElement = Array.from(breakpointValues).find(el => el.dataset.token === tokenName);
      if (valueElement) {
        valueElement.textContent = scssValue;
      }
    }
  }
}

// Load semantic colors
async function loadSemanticColors() {
  console.log('Loading semantic colors...');
  const semanticColorPreviews = document.querySelectorAll('.semantic-color-preview');
  const semanticColorValues = document.querySelectorAll('.semantic-color-value');
  
  for (const preview of semanticColorPreviews) {
    const tokenName = preview.dataset.token;
    const scssValue = await getTokenValue(tokenName);
    
    if (scssValue) {
      preview.style.backgroundColor = scssValue;
      
      // Find the corresponding value element and update it
      const valueElement = Array.from(semanticColorValues).find(el => el.dataset.token === tokenName);
      if (valueElement) {
        valueElement.textContent = scssValue;
      }
    }
  }
}