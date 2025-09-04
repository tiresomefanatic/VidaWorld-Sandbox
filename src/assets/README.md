# Assets Organization

This directory contains all the assets organized by page/component for better file management and organization.

## Directory Structure

### 📱 Hero Page (`/hero-page/`)
- `banner_desktop.png` - Desktop hero background image
- `banner_mobile.jpg` - Mobile hero background image

### 🔋 Batteries Page (`/batteries-page/`)
- `battery_l.png` - Desktop left battery image
- `battery_r.png` - Desktop right battery image
- `battery_m_l.svg` - Mobile left battery image
- `battery_m_r.svg` - Mobile right battery image

### 🔗 Connect Page (`/connect-page/`)
- `google_button.svg` - Google Play download button
- `apple_button.svg` - Apple App Store download button

### 🎯 Teaser Page (`/teaser-page/`)
- Reserved for teaser page assets

### 📄 Other Assets
- `react.svg` - React logo (general asset)

## Usage

All assets are copied to the `public/` directory for direct access in components. The source files remain organized here for development and version control.

## File Naming Convention

- **Desktop images**: `.png` extension
- **Mobile images**: `.jpg` for photos, `.svg` for graphics
- **Icons/Buttons**: `.svg` extension for scalability
- **Page-specific**: Assets are grouped by page name

## Adding New Assets

1. Place assets in the appropriate page folder
2. Copy to `public/` directory
3. Update this README if adding new categories
4. Use descriptive names that indicate purpose and screen size
