import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link to="/" className={styles.logo}>
          BabySteps
        </Link>

        <button 
          className={styles.mobileMenuButton}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className={styles.hamburger}></span>
        </button>

        <div className={`${styles.navLinks} ${isMobileMenuOpen ? styles.active : ''}`}>
          <Link 
            to="/" 
            className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Find Doctor
          </Link>
          
          <Link 
            to="/appointments" 
            className={`${styles.navLink} ${isActive('/appointments') ? styles.active : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            My Appointments
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;