import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import React from "react";

// Import page components
import Home from "./pages/Home";
import Product from "./pages/Product";
import Explore from "./pages/Explore";
import HomePage from "./pages/HomePage";
import DesignTokens from "./pages/DesignTokens";

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
            <Route path="/product" element={<Product />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/designtokens" element={<DesignTokens />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
