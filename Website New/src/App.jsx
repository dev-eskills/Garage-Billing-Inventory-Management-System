import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop"; // Import ScrollToTop
import Home from "./pages/Home";
import ServicesPage from "./pages/ServicesPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import FloatingWhatsApp from "./components/FloatingWhatsApp";

export default function App() {
  return (
    <div
      style={{
        background: "#FFFFFF",
        minHeight: "100vh",
        width: "100vw",
        overflowX: "hidden",
      }}
    >
      <ScrollToTop /> {/* Reset scroll on every route change */}
      <Navbar />
      <Suspense
        fallback={
          <div
            style={{
              height: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#FFF",
            }}
          >
            <div
              style={{
                fontWeight: 800,
                color: "var(--accent-red)",
                fontSize: "1.2rem",
                fontFamily: "Syne, sans-serif",
              }}
            >
              LOADING...
            </div>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </Suspense>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
