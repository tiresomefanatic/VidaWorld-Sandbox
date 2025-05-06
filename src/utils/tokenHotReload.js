/**
 * Token Hot Reload Utility
 * 
 * This utility adds live hot reloading functionality to the design tokens page.
 * It periodically checks for changes in the SCSS files and automatically updates
 * the display when changes are detected.
 */

import { extractScssTokens } from './tokensExtractor';
import { initializeDesignTokens } from './designTokensLoader';

// Last file hash to detect changes
let lastFileHash = '';
let isWatching = false;
let watchInterval = null;
const WATCH_INTERVAL_MS = 2000; // Check every 2 seconds

/**
 * Start watching for SCSS file changes
 * @returns {boolean} Success status
 */
export function startTokenWatcher() {
  if (isWatching) {
    console.log('Token watcher is already running');
    return false;
  }
  
  console.log('Starting token file watcher...');
  
  // Initial file hash
  updateFileHash();
  
  // Setup interval to check for changes
  watchInterval = setInterval(checkForChanges, WATCH_INTERVAL_MS);
  isWatching = true;
  
  // Add status indicator to the page
  addWatcherStatusIndicator();
  
  return true;
}

/**
 * Stop watching for SCSS file changes
 */
export function stopTokenWatcher() {
  if (!isWatching) {
    console.log('Token watcher is not running');
    return;
  }
  
  clearInterval(watchInterval);
  isWatching = false;
  
  // Update status indicator
  updateStatusIndicator(false);
  
  console.log('Token file watcher stopped');
}

/**
 * Check if token files have changed
 */
async function checkForChanges() {
  try {
    const currentHash = await getFileHash();
    
    if (currentHash && lastFileHash && currentHash !== lastFileHash) {
      console.log('Token file changes detected!');
      
      // Update status indicator to show refresh is happening
      updateStatusIndicator(true, 'refreshing');
      
      // Force refresh of token cache and reinitialize display
      await extractScssTokens(true);
      await initializeDesignTokens();
      
      // Update last hash
      lastFileHash = currentHash;
      
      // Update status indicator back to watching
      updateStatusIndicator(true);
      
      console.log('Token display updated successfully');
    }
  } catch (error) {
    console.error('Error checking for file changes:', error);
    updateStatusIndicator(true, 'error');
  }
}

/**
 * Update file hash
 */
async function updateFileHash() {
  try {
    lastFileHash = await getFileHash();
  } catch (error) {
    console.error('Error getting file hash:', error);
  }
}

/**
 * Get hash of token files to detect changes
 * @returns {Promise<string>} Hash string
 */
async function getFileHash() {
  try {
    // Fetch the tokens.scss file with cache busting using the public endpoint
    const response = await fetch(`/tokens.scss?t=${Date.now()}`, {
      headers: {
        'Accept': 'text/plain',
        'Cache-Control': 'no-cache'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch tokens.scss: ${response.status}`);
    }
    
    const content = await response.text();
    
    if (!content || typeof content !== 'string' || content.includes('import.meta.hot')) {
      throw new Error('Invalid content for hashing');
    }
    
    // Simple hash function for text content
    return hashString(content);
  } catch (error) {
    console.error('Error generating file hash:', error);
    return '';
  }
}

/**
 * Simple string hash function
 * @param {string} str String to hash
 * @returns {string} Hash string
 */
function hashString(str) {
  let hash = 0;
  
  if (str.length === 0) {
    return hash.toString();
  }
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return hash.toString();
}

/**
 * Add watcher status indicator to the page
 */
function addWatcherStatusIndicator() {
  const container = document.querySelector('.design-tokens-page__container');
  
  if (container) {
    // Remove existing indicator if present
    const existingIndicator = document.querySelector('.watcher-status-indicator');
    if (existingIndicator) {
      existingIndicator.remove();
    }
    
    const statusIndicator = document.createElement('div');
    statusIndicator.className = 'watcher-status-indicator';
    statusIndicator.innerHTML = `
      <div class="indicator-dot watching"></div>
      <span class="indicator-text">Watching for token changes</span>
    `;
    
    // Add styles
    statusIndicator.style.cssText = `
      position: fixed;
      top: 150px;
      right: 20px;
      padding: 8px 12px;
      background-color: rgba(0, 0, 0, 0.8);
      color: white;
      border-radius: 4px;
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
      z-index: 1000;
    `;
    
    // Style the indicator dot
    const indicatorDot = statusIndicator.querySelector('.indicator-dot');
    indicatorDot.style.cssText = `
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #4CAF50;
      position: relative;
    `;
    
    // Add pulse animation for watching state
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.5); opacity: 0.7; }
        100% { transform: scale(1); opacity: 1; }
      }
      
      .indicator-dot.watching {
        animation: pulse 2s infinite;
        background-color: #4CAF50;
      }
      
      .indicator-dot.refreshing {
        background-color: #FFC107;
        animation: pulse 0.5s infinite;
      }
      
      .indicator-dot.error {
        background-color: #F44336;
        animation: none;
      }
      
      .indicator-dot.stopped {
        background-color: #9E9E9E;
        animation: none;
      }
    `;
    
    document.head.appendChild(style);
    container.appendChild(statusIndicator);
  }
}

/**
 * Update status indicator state
 * @param {boolean} isActive Whether watcher is active
 * @param {string} state Optional state ('watching', 'refreshing', 'error')
 */
function updateStatusIndicator(isActive, state = 'watching') {
  const indicator = document.querySelector('.watcher-status-indicator');
  
  if (indicator) {
    const dot = indicator.querySelector('.indicator-dot');
    const text = indicator.querySelector('.indicator-text');
    
    // Remove all state classes
    dot.classList.remove('watching', 'refreshing', 'error', 'stopped');
    
    if (isActive) {
      switch (state) {
        case 'refreshing':
          dot.classList.add('refreshing');
          text.textContent = 'Updating tokens...';
          break;
        case 'error':
          dot.classList.add('error');
          text.textContent = 'Error watching tokens';
          break;
        default:
          dot.classList.add('watching');
          text.textContent = 'Watching for token changes';
      }
    } else {
      dot.classList.add('stopped');
      text.textContent = 'Token watcher stopped';
    }
  }
}

/**
 * Toggle watcher state
 * @returns {boolean} New state
 */
export function toggleTokenWatcher() {
  if (isWatching) {
    stopTokenWatcher();
    return false;
  } else {
    return startTokenWatcher();
  }
}

/**
 * Add the watch toggle button to the page
 */
export function addWatchToggleButton() {
  const container = document.querySelector('.design-tokens-page__container');
  
  if (container) {
    // Remove existing button if present
    const existingButton = document.querySelector('.watch-toggle-button');
    if (existingButton) {
      existingButton.remove();
    }
    
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Enable Live Reload';
    toggleButton.className = 'watch-toggle-button';
    toggleButton.style.cssText = `
      position: fixed;
      bottom: 140px;
      right: 20px;
      padding: 12px 16px;
      background-color: #2196F3;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      z-index: 999;
      font-weight: 500;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    `;
    
    toggleButton.addEventListener('click', () => {
      const isNowWatching = toggleTokenWatcher();
      toggleButton.textContent = isNowWatching ? 'Disable Live Reload' : 'Enable Live Reload';
      toggleButton.style.backgroundColor = isNowWatching ? '#F44336' : '#2196F3';
    });
    
    container.appendChild(toggleButton);
  }
}

/**
 * Initialize the hot reload functionality
 */
export function initializeHotReload() {
  // Add watch toggle button when the page loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addWatchToggleButton);
  } else {
    addWatchToggleButton();
  }
}