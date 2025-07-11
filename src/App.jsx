import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import RegisterDrugs from "./components/RegisterDrugs";
import Authenticator from "./components/Authenticator";
import Inventory from "./components/Inventory";
import Contact from "./components/Contact";
import TrendModal from "./components/TrendModal";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register-drugs" element={<RegisterDrugs />} />
        <Route path="/authenticator" element={<Authenticator />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <TrendModal />
      <footer>
        <p>© 2025 Hackivate. All rights reserved.</p>
      </footer>
    </>
  );
}

export default App;