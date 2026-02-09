// src/components/navbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(prev => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Brand */}
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <span className="brand-text">FOCUSED</span>
          <img
            src="/logo.png"   // public/logo.png
            alt="Focused logo"
            className="brand-logo"
          />
        </Link>

        {/* 3-line menu button */}
        <button
          className="menu-toggle"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Dropdown menu (only visible when menuOpen is true) */}
      <ul className={`nav-menu ${menuOpen ? 'nav-menu--open' : ''}`}>
        <li className="nav-menu-item">
          <Link to="/" className="nav-menu-link" onClick={closeMenu}>
            Home
          </Link>
        </li>
        <li className="nav-menu-item">
          <Link to="/tasks" className="nav-menu-link" onClick={closeMenu}>
            Tasks
          </Link>
        </li>
        <li className="nav-menu-item">
          <Link to="/about" className="nav-menu-link" onClick={closeMenu}>
            About
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;





