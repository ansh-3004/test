import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <header>
      <nav className="navbar">
        <div className="logo">Med - Ackivate</div>
        <ul className="nav-links">
          <li><Link to="/" className={pathname === "/" ? "active" : ""}>Home</Link></li>
          <li><Link to="/register-drugs" className={pathname === "/register-drugs" ? "active" : ""}>Register Drugs</Link></li>
          <li><Link to="/authenticator" className={pathname === "/authenticator" ? "active" : ""}>Authenticator</Link></li>
          <li><Link to="/inventory" className={pathname === "/inventory" ? "active" : ""}>Inventory</Link></li>
          <li><Link to="/contact" className={pathname === "/contact" ? "active" : ""}>Contact Us</Link></li>
        </ul>
      </nav>
    </header>
  );
}

