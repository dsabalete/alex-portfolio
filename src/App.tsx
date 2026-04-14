import { Routes, Route } from "react-router-dom";
import PageHeader from "./components/PageHeader";
import PageFooter from "./components/PageFooter";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactePage from "./pages/ContactePage";
import styles from "./App.module.css";

function App() {
  return (
    <div className={styles.app}>
      <PageHeader />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contacte" element={<ContactePage />} />
      </Routes>

      <PageFooter />
    </div>
  );
}

export default App;
