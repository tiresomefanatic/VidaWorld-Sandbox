/**
 * @author Noor Mohamed <nmohamme@adobe.com>
 * Media Breakpoints
 * Usage : window.matchMedia(breakpoints.mediaExpression.TYPE).matches
 * Return Value : Boolean
 */

export const SCREEN_PH = 360;
export const SCREEN_TAB = 768;
export const SCREEN_DK = 1024;
export const SCREEN_DK_MD = 1280;
export const SCREEN_DK_LG = 1440;
export const SCREEN_DK_XL = 1600;
export const SCREEN_DK_XXL = 1920;

const breakpoints = {
  mediaExpression: {
    phone: `(min-width:${SCREEN_PH}px)`,
    tablet: `(min-width:${SCREEN_TAB}px)`,
    desktop: `(min-width:${SCREEN_DK}px)`,
    "desktop-md": `(min-width:${SCREEN_DK_MD}px)`,
    "desktop-lg": `(min-width:${SCREEN_DK_LG}px)`,
    "desktop-xl": `(min-width:${SCREEN_DK_XL}px)`,
    "desktop-xxl": `(min-width:${SCREEN_DK_XXL}px)`
  }
};

export default breakpoints;
