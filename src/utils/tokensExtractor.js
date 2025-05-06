/**
 * Direct SCSS Tokens Extractor
 * 
 * This version directly reads from the tokens.scss file with proper error handling
 * and no fallbacks - it will throw errors when tokens can't be extracted.
 */

// Cache for tokens to avoid multiple parsing of the file
let tokensCache = null;
let lastFetchTime = 0;
const CACHE_EXPIRY = 5000; // 5 seconds cache expiry to detect file changes

/**
 * Fetches the tokens.scss file and parses it to extract variable values
 * @param {boolean} forceRefresh Force a refresh of the cache
 * @returns {Promise<Object>} Object with token names as keys and values as values
 * @throws {Error} If tokens file can't be loaded or parsed
 */
export async function extractScssTokens(forceRefresh = false) {
  const now = Date.now();
  
  // Use cache if available and not expired
  if (tokensCache && !forceRefresh && (now - lastFetchTime < CACHE_EXPIRY)) {
    return tokensCache;
  }

  console.log("Attempting to load tokens.scss file...");
  
  try {
    // Use the public endpoint to get the unprocessed SCSS content
    const response = await fetch(`/tokens.scss?t=${Date.now()}`, {
      headers: {
        'Accept': 'text/plain',
        'Cache-Control': 'no-cache'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch tokens.scss: ${response.status} ${response.statusText}`);
    }
    
    const scssContent = await response.text();
    
    // Verify we have actual SCSS content, not Vite transformed content
    if (!scssContent || scssContent.trim().length === 0) {
      throw new Error("Empty SCSS content received");
    }
    
    // Check if we got HTML or transformed code instead of raw SCSS
    if (scssContent.includes('<!DOCTYPE html>') || 
        scssContent.includes('<html>') ||
        scssContent.includes('import.meta.hot')) {
      throw new Error("Invalid SCSS content received - got HTML or transformed code instead");
    }
    
    // Log the first 100 characters for debugging
    console.log("Fetched raw SCSS content, first 100 chars:", scssContent.substring(0, 100));
    
    // Parse the SCSS content for tokens
    const tokens = parseScssVariables(scssContent);
    
    const tokenCount = Object.keys(tokens).length;
    if (tokenCount === 0) {
      throw new Error("No tokens found in the SCSS file. Check the file path and content format.");
    }
    
    tokensCache = tokens;
    lastFetchTime = now;
    
    console.log(`Successfully extracted ${tokenCount} tokens from SCSS`);
    
    // For debugging, let's log a few example tokens
    const sampleTokens = Object.keys(tokens).slice(0, 5);
    console.log("Sample tokens:", sampleTokens.map(key => `${key}: ${tokens[key].value}`));
    
    return tokens;
  } catch (error) {
    console.error('Error extracting tokens:', error);
    throw error; // Rethrow to be handled by the caller
  }
}

/**
 * Parse SCSS content to extract variable declarations
 * @param {string} scssContent The content of the tokens.scss file
 * @returns {Object} Object with token names as keys and token info as values
 */
function parseScssVariables(scssContent) {
  const tokens = {};
  
  // Regular expression to match SCSS variable declarations
  // $variable-name: value;
  const variableRegex = /\$([\w-]+):\s*([^;]+);/g;
  
  let match;
  let matchCount = 0;
  while ((match = variableRegex.exec(scssContent)) !== null) {
    matchCount++;
    const name = match[1];
    let value = match[2].trim();
    
    // Check if the value is a reference to another variable
    if (value.startsWith('$')) {
      tokens[name] = { 
        isReference: true, 
        reference: value.substring(1), 
        rawValue: value,
        value: null, // Will be resolved later
        referenceChain: [name] // Track the reference chain to detect circular references
      };
    } else {
      tokens[name] = { 
        isReference: false, 
        reference: null,
        rawValue: value,
        value: value,
        referenceChain: [name]
      };
    }
  }
  
  console.log(`Found ${matchCount} token declarations in SCSS content`);
  
  // Resolve all references
  for (const name of Object.keys(tokens)) {
    if (tokens[name].isReference) {
      resolveTokenReference(name, tokens);
    }
  }
  
  return tokens;
}

/**
 * Resolve a token reference, recursively if needed
 * @param {string} tokenName The name of the token to resolve
 * @param {Object} allTokens All tokens
 * @returns {Object} The resolved token info
 */
function resolveTokenReference(tokenName, allTokens) {
  const token = allTokens[tokenName];
  
  // If already resolved, return
  if (token.value !== null) {
    return token;
  }
  
  // If not a reference, nothing to resolve
  if (!token.isReference) {
    return token;
  }
  
  const referenceName = token.reference;
  
  // If referenced token doesn't exist, throw an error
  if (!allTokens[referenceName]) {
    throw new Error(`Referenced token '${referenceName}' not found for '${tokenName}'`);
  }
  
  // Check for circular references
  if (allTokens[referenceName].referenceChain.includes(tokenName)) {
    throw new Error(`Circular reference detected for token: ${tokenName}`);
  }
  
  // Update reference chain to track resolution path
  allTokens[referenceName].referenceChain = 
    [...token.referenceChain, referenceName];
  
  // Resolve the referenced token recursively if needed
  const resolvedReference = resolveTokenReference(referenceName, allTokens);
  
  // Set the resolved value
  token.value = resolvedReference.value;
  
  return token;
}

/**
 * Get a specific token value by name
 * @param {string} tokenName The name of the token
 * @param {boolean} raw Whether to return raw or resolved value
 * @returns {Promise<string|null>} The token value or null if not found
 */
export async function getTokenValue(tokenName, raw = false) {
  try {
    const tokens = await extractScssTokens();
    const token = tokens[tokenName];
    
    if (!token) {
      throw new Error(`Token not found: ${tokenName}`);
    }
    
    return raw ? token.rawValue : token.value;
  } catch (error) {
    console.error(`Error getting token value for ${tokenName}:`, error);
    throw error; // Rethrow error instead of returning null
  }
}

/**
 * Get all tokens of a specific category
 * @param {string} category Category prefix (e.g., 'font-size', 'color')
 * @returns {Promise<Object>} Filtered tokens
 */
export async function getTokensByCategory(category) {
  try {
    const tokens = await extractScssTokens();
    const filteredTokens = {};
    
    for (const [name, info] of Object.entries(tokens)) {
      if (name.startsWith(category)) {
        filteredTokens[name] = info;
      }
    }
    
    if (Object.keys(filteredTokens).length === 0) {
      throw new Error(`No tokens found for category: ${category}`);
    }
    
    return filteredTokens;
  } catch (error) {
    console.error(`Error getting tokens by category ${category}:`, error);
    throw error; // Rethrow error instead of returning empty object
  }
}

/**
 * Check if a token is a reference to another token
 * @param {string} tokenName The name of the token
 * @returns {Promise<boolean>} True if the token is a reference
 */
export async function isTokenReference(tokenName) {
  try {
    const tokens = await extractScssTokens();
    const token = tokens[tokenName];
    
    if (!token) {
      throw new Error(`Token not found: ${tokenName}`);
    }
    
    return token.isReference;
  } catch (error) {
    console.error(`Error checking if token is reference: ${tokenName}`, error);
    throw error; // Rethrow error instead of returning false
  }
}

/**
 * Get the reference chain for a token
 * @param {string} tokenName The name of the token
 * @returns {Promise<Array<string>>} The reference chain
 */
export async function getTokenReferenceChain(tokenName) {
  try {
    const tokens = await extractScssTokens();
    const token = tokens[tokenName];
    
    if (!token) {
      throw new Error(`Token not found: ${tokenName}`);
    }
    
    return token.referenceChain;
  } catch (error) {
    console.error(`Error getting reference chain for ${tokenName}:`, error);
    throw error; // Rethrow error instead of returning null
  }
}