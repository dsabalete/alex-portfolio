import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import PageHeader from "./components/PageHeader";
import PageFooter from "./components/PageFooter";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactePage from "./pages/ContactePage";
import { trackPageView } from "./lib/analytics";
import styles from "./App.module.css";

function App() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);

  return (
    <div className={styles.app}>
      <PageHeader />

      <div key={location.pathname} className={styles.routeTransition}>
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contacte" element={<ContactePage />} />
        </Routes>
      </div>

      <PageFooter />
    </div>
  );
}

export default App;
