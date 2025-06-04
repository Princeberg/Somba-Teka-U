import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faBullhorn,
  faInfoCircle,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const translations = {
    en: {
      home: "Home",
      ad: "Advertising",
      about: "About",
      shopSpace: "Seller Space",
    },
    fr: {
      home: "Accueil",
      ad: "Publicité",
      about: "À propos",
      shopSpace: "Espace vendeur",
    },
  };

  const t = translations[router.locale || "fr"] || translations.fr;

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header-left">
            <Link href="#" legacyBehavior>
              <a className="logo" onClick={closeMenu}>
                <span className="logo-main">SOMBA</span>
                <span className="logo-accent">TEKA</span>
              </a>
            </Link>
          </div>

          <div className="header-center">
            <nav className={`nav ${isOpen ? "nav--open" : ""}`} aria-label="Main menu">
              <ul>
                <li>
                  <Link href="/" legacyBehavior>
                    <a onClick={closeMenu} className="nav-link">
                      <FontAwesomeIcon icon={faHome} className="nav-icon" />
                      <span className="nav-text">{t.home}</span>
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/ad" legacyBehavior>
                    <a onClick={closeMenu} className="nav-link">
                      <FontAwesomeIcon icon={faBullhorn} className="nav-icon" />
                      <span className="nav-text">{t.ad}</span>
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/about" legacyBehavior>
                    <a onClick={closeMenu} className="nav-link">
                      <FontAwesomeIcon icon={faInfoCircle} className="nav-icon" />
                      <span className="nav-text">{t.about}</span>
                    </a>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <div className="header-right">
            <Link href="/login" legacyBehavior>
              <a className="auth-button" onClick={closeMenu}>
                <FontAwesomeIcon icon={faUser} className="auth-icon" />
                <span>{t.shopSpace}</span>
              </a>
            </Link>

            <button
              className={`hamburger ${isOpen ? "hamburger--open" : ""}`}
              onClick={toggleMenu}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="primary-navigation"
            >
              <span className="hamburger-line" />
              <span className="hamburger-line" />
              <span className="hamburger-line" />
            </button>
          </div>
        </div>
      </header>

      {/* Global Styles */}
      <style jsx global>{`
        :root {
          --primary-bg: #f8f9fa;
          --secondary-bg: #f8f9fa;
          --text-color: #333333;
          --text-muted: #6c757d;
          --accent-color: #4CAF50;
          --border-color: rgba(0, 0, 0, 0.1);
          --card-bg: #ffffff;
          --container-bg: #ffffff; 
          --hover-bg: rgba(0, 0, 0, 0.05);
          --shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        html, body {
          background-color: var(--secondary-bg);
          color: var(--text-color);
          font-family: 'Inter', sans-serif;
        }
      `}</style>

      {/* Component-specific styles */}
      <style jsx>{`
        .header {
          background: var(--primary-bg);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--border-color);
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: var(--shadow);
        }
        
        .container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0.75rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
        }
        
        .header-left,
        .header-center,
        .header-right {
          display: flex;
          align-items: center;
        }
        
        .header-center {
          flex: 1;
          justify-content: center;
        }
        
        .header-right {
          gap: 1.5rem;
        }
        
        .logo {
          font-family: 'Poppins', sans-serif;
          font-weight: 700;
          font-size: 1.75rem;
          color: var(--accent-color);
          text-decoration: none;
          user-select: none;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        
        .logo-main {
          color: var(--text-color);
        }
        
        .logo-accent {
          color: var(--text-color);
        }
        
        .nav ul {
          display: flex;
          gap: 1.5rem;
          margin: 0;
          padding: 0;
          list-style: none;
          align-items: center;
        }
        
        .nav-link {
          color: var(--text-color);
          text-decoration: none;
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          border-radius: 6px;
        }
        
        .nav-link:hover,
        .nav-link:focus {
          color: white;
          background: #5cb85c;
          transform: translateY(-1px);
        }
        
        .nav-icon {
          font-size: 1rem;
          transition: transform 0.3s ease;
        }
        
        .nav-link:hover .nav-icon {
          transform: scale(1.1);
        }
        
        .auth-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--primary-bg); 
          color: var(--text-color);
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-weight: 500;
          transition: all 0.3s ease;
          border: 1px solid var(--border-color);
          text-decoration: none; 
        }
        
        .auth-button:hover {
          background: #5cb85c;
          color: white;
          transform: translateY(-1px);
        }
        
        .auth-icon {
          font-size: 0.9rem;
        }
        
        /* Hamburger styles */
        .hamburger {
          display: none;
          flex-direction: column;
          justify-content: space-between;
          width: 25px;
          height: 20px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          z-index: 110;
        }
        
        .hamburger:focus {
          outline: 2px solid var(--accent-color);
          outline-offset: 2px;
        }
        
        .hamburger-line {
          height: 3px;
          width: 100%;
          background: var(--text-color);
          border-radius: 2px;
          transition: all 0.3s ease;
        }
        
        /* Hamburger open animation */
        .hamburger--open .hamburger-line:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }
        
        .hamburger--open .hamburger-line:nth-child(2) {
          opacity: 0;
        }
        
        .hamburger--open .hamburger-line:nth-child(3) {
          transform: rotate(-45deg) translate(5px, -5px);
        }
        
        /* Responsive */
        @media (max-width: 992px) {
          .container {
            padding: 0.75rem 1.5rem;
          }
          
          .nav ul {
            gap: 1rem;
          }
        }
        
        @media (max-width: 768px) {
          .header-center {
            position: static;
            display: block;
          }
          
          .nav {
            position: fixed;
            top: 70px;
            left: 0;
            right: 0;
            background: var(--primary-bg);
            height: calc(100vh - 70px);
            width: 100%;
            flex-direction: column;
            padding: 2rem 0;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            box-shadow: -5px 0 15px rgba(0,0,0,0.1);
            border-top: 1px solid var(--border-color);
          }
          
          .nav.nav--open {
            transform: translateX(0);
          }
          
          .nav ul {
            flex-direction: column;
            gap: 1.5rem;
            width: 100%;
          }
          
          .nav-link {
            padding: 0.75rem 1.5rem;
            width: 100%;
            justify-content: center;
          }
          
          .hamburger {
            display: flex;
          }
        }
        
        @media (max-width: 480px) {
          .logo {
            font-size: 1.5rem;
          }
          
          .container {
            padding: 0.75rem 1rem;
          }
          
          .auth-button span {
            display: none;
          }
        }
      `}</style>
    </>
  );
}