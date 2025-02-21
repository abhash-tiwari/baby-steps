import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">➕</span>
          <span className="logo-text">MedBook</span>
        </Link>

        <div className="mobile-menu-icon" onClick={toggleMobileMenu}>
          <i className={mobileMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
          {mobileMenuOpen ? '✕' : '☰'}
        </div>

        <ul className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/doctors" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              Doctors
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;