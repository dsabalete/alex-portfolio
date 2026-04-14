import { Routes, Route } from "react-router-dom";
import "./index.css";
import PageHeader from "./components/PageHeader";
import PageFooter from "./components/PageFooter";
import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import ContactePage from "./pages/ContactePage";

function App() {
  return (
    <div className="app">
      <PageHeader />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contacte" element={<ContactePage />} />
      </Routes>

      <PageFooter />
    </div>
  );
}

export default App;
