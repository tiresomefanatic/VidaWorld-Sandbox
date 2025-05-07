import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import React from "react";

// Import page components
// Note: Page components should follow the pattern:
// - Each page has its own folder under src/pages
// - The folder contains both the JSX and SCSS files for that page
// - Example: src/pages/ButtonsPage/ButtonsPage.jsx and src/pages/ButtonsPage/ButtonsPage.scss
import Home from "./pages/Home";
import Product from "./pages/Product";
import ExplorePage from "./pages/ExplorePage/ExplorePage";
import HomePage from "./pages/HomePage";
import DesignTokens from "./pages/DesignTokens";
import ButtonsPage from "./pages/ButtonsPage/ButtonsPage";

// Import Header component
import Header from "./components/Header/Header";

// Import content management components
import { ContentProvider } from "./utils/ContentContext";
import ContentEditButton from "./components/ContentEditButton/ContentEditButton";

function App() {
  return (
    <ContentProvider>
      <Router>
        <div className="app">
          {/* Header is fixed at the top */}
          <Header />
          
          {/* Content container with no margin or padding */}
          <main className="app-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/product" element={<Product />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/designtokens" element={<DesignTokens />} />
              <Route path="/buttons" element={<ButtonsPage />} />
            </Routes>
          </main>
          
          {/* Content edit button */}
          <ContentEditButton />
        </div>
      </Router>
    </ContentProvider>
  );
}

export default App;
