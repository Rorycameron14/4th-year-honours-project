import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Link } from 'react-router-dom';
import './navbar.css';

// The responsive navbar pattern was built with reference to Brian Design's React Website Tutorial,
// then customised for this project.
// Reference: https://github.com/briancodex/react-website-v1/tree/starter
function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    showButton();
    window.addEventListener('resize', showButton);
    return () => window.removeEventListener('resize', showButton);
  }, []);

  return (
    <>
      <nav className='navbar'>
        <div className='navbar-container'>
          <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
            FOCUSED
            <i className='fab fa-typo3' />
            <img
              src="/images/logo.png"
              alt="Focused logo"
              className="navbar-logo-icon"
              style={{
                height: '20px',
                width: 'auto',
                marginLeft: '8px',
                objectFit: 'contain',
              }}
            />
          </Link>

          <div className='menu-icon' onClick={handleClick}>
            <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
          </div>

          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            <li className='nav-item'>
              <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                Home
              </Link>
            </li>

            <li className='nav-item'>
              <Link
                to='/lesson'
                className='nav-links'
                onClick={closeMobileMenu}
              >
                Lesson
              </Link>
            </li>

            <li className='nav-item'>
              <Link
                to='/quiz'
                className='nav-links'
                onClick={closeMobileMenu}
              >
                Quiz
              </Link>
            </li>

            <li className='nav-item'>
              <Link
                to='/about'
                className='nav-links'
                onClick={closeMobileMenu}
              >
                About
              </Link>
            </li>

            <li>
              <Link
                to='/enquire'
                className='nav-links-mobile'
                onClick={closeMobileMenu}
              >
                Enquire
              </Link>
            </li>
          </ul>

          {button && <Button buttonStyle='btn--outline'>Enquire</Button>}
        </div>
      </nav>
    </>
  );
}

export default Navbar;

