import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Import page components
import Home from "./pages/Home";
import Product from "./pages/Product";
import Explore from "./pages/Explore";
import Components from "./pages/Components";
import HomePage from "./pages/HomePage";

// Import Header component
import Header from "./components/Header/Header";

function App() {
  return (
    <Router>
      <div className="app">
        {/* Add the Header component to be visible on all pages */}
        <Header />
        
        {/* Main content area with padding-top to account for fixed header */}
        <div className="content" style={{ paddingTop: "64px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/product" element={<Product />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/components" element={<Components />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
