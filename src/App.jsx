import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import React from "react";

// Import page components
// Note: Page components should follow the pattern:
// - Each page has its own folder under src/pages
// - The folder contains both the JSX and SCSS files for that page
// - Example: src/pages/ButtonsPage/ButtonsPage.jsx and src/pages/ButtonsPage/ButtonsPage.scss
import Home from "./pages/Index";
import ProductPage from "./pages/ProductPage/ProductPage";
import ExplorePage from "./pages/ExplorePage/ExplorePage";
import HomePage from "./pages/HomePage/HomePage";
import DesignTokensPage from "./pages/DesignTokensPage/DesignTokens";
import ButtonsPage from "./pages/ButtonsPage/ButtonsPage";
import TeaserPage from "./pages/TeaserPage/TeaserPage";

// Import Header component
import Header from "./components/Header/Header";



function App() {
  return (
 
      <Router>
        <div className="app">
          {/* Header is fixed at the top */}
          <Header />
          
          {/* Content container with no margin or padding */}
          <main className="app-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/product" element={<ProductPage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/designtokens" element={<DesignTokensPage />} />
              <Route path="/buttons" element={<ButtonsPage />} />
              <Route path="/teaser" element={<TeaserPage />} />
            </Routes>
          </main>
          
       
        </div>
      </Router>
  
  );
}

export default App;
