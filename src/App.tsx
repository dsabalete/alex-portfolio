import { useState } from "react";
import "./index.css";
import PageHeader from "./components/PageHeader";
import PageFooter from "./components/PageFooter";
import HeroSection from "./components/HeroSection";

function App() {
  const [showHero, setShowHero] = useState(false);

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowHero(true);
  };

  return (
    <div className="app">
      <PageHeader onContactClick={handleContactClick} />

      {showHero && <HeroSection />}

      {/* Main Content */}
      <main className="main-content">
        {/* This is where the portfolio content will go */}
        <div style={{ height: "150vh" }}>
          {/* Spacer content to enable scrolling */}
        </div>
      </main>

      <PageFooter />
    </div>
  );
}

export default App;
