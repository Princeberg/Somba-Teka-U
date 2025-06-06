import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faStore,
  faBullhorn,
  faInfoCircle,
  faRightFromBracket,
  faTimes,
  faSun,
  faMoon
} from "@fortawesome/free-solid-svg-icons";

export default function AdminHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  // Dark mode handling
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  // Close menu on route change
  useEffect(() => {
    const handleRouteChange = () => closeMenu();
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => router.events.off("routeChangeComplete", handleRouteChange);
  }, [router.events]);

  const translations = {
    en: {
      home: "Home",
      ajout: "All requests",
      views: "All products",
      vendeurs: "All sellers",
      logout: "Logout",
    },
    fr: {
      home: "Accueil",
      ajout: "Voir les demandes",
      views: "Tous les produits",
      vendeurs: "Tous les Vendeurs",
      logout: "Déconnexion",
    },
  };

  const t = translations[router.locale || "fr"] || translations.fr;

  return (
    <>
      <header className={`header ${scrolled ? "scrolled" : ""}`}>
        <div className="container">
          <div className="header-left">
            <Link href="/admin/menu" legacyBehavior>
              <a className="logo" onClick={closeMenu}>
                <span className="logo-main">ADMIN</span>
                <span className="logo-main">PANEL</span>
              </a>
            </Link>
          </div>

          <div className="header-center">
            <nav
              className={`nav ${isOpen ? "nav--open" : ""}`}
              aria-label="Main navigation"
              id="primary-navigation"
            >
              <ul>
                <li>
                  <Link href="/admin/menu" legacyBehavior>
                    <a
                      onClick={closeMenu}
                      className={`nav-link ${router.pathname === "/admin/menu" ? "active" : ""}`}
                    >
                      <FontAwesomeIcon icon={faHome} className="nav-icon" />
                      <span className="nav-text">{t.home}</span>
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/admin/ajout" legacyBehavior>
                    <a
                      onClick={closeMenu}
                      className={`nav-link ${router.pathname === "/admin/ajout" ? "active" : ""}`}
                    >
                      <FontAwesomeIcon icon={faStore} className="nav-icon" />
                      <span className="nav-text">{t.ajout}</span>
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/admin/view" legacyBehavior>
                    <a
                      onClick={closeMenu}
                      className={`nav-link ${router.pathname === "/admin/view" ? "active" : ""}`}
                    >
                      <FontAwesomeIcon icon={faBullhorn} className="nav-icon" />
                      <span className="nav-text">{t.views}</span>
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/admin/vendeur" legacyBehavior>
                    <a
                      onClick={closeMenu}
                      className={`nav-link ${router.pathname === "/admin/vendeur" ? "active" : ""}`}
                    >
                      <FontAwesomeIcon icon={faInfoCircle} className="nav-icon" />
                      <span className="nav-text">{t.vendeurs}</span>
                    </a>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <div className="header-right">
            <button
              onClick={toggleDarkMode}
              className="theme-toggle"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              <FontAwesomeIcon 
                icon={darkMode ? faSun : faMoon} 
                className="theme-icon"
              />
            </button>

            <Link href="/logout" legacyBehavior>
              <a className="auth-button" onClick={closeMenu}>
                <FontAwesomeIcon icon={faRightFromBracket} className="auth-icon" />
                <span className="auth-text">{t.logout}</span>
              </a>
            </Link>

            <button
              className={`hamburger ${isOpen ? "hamburger--open" : ""}`}
              onClick={toggleMenu}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="primary-navigation"
            >
              {isOpen ? (
                <FontAwesomeIcon icon={faTimes} className="hamburger-icon" />
              ) : (
                <>
                  <span className="hamburger-line" />
                  <span className="hamburger-line" />
                  <span className="hamburger-line" />
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Overlay for mobile menu */}
      <div
        className={`overlay ${isOpen ? "overlay--visible" : ""}`}
        onClick={closeMenu}
      />

      {/* Global Styles */}
      <style jsx global>{`
        :root {
          --primary-bg: rgba(255, 255, 255, 0.98);
          --secondary-bg: #f8f9fa;
          --text-color: #1a1a1a;
          --text-muted: #6c757d;
          --accent-color: #4CAF50;
          --accent-hover: #4CAF50;
          --border-color: rgba(0, 0, 0, 0.08);
          --card-bg: #ffffff;
          --container-bg: #ffffff;
          --hover-bg: rgba(0, 0, 0, 0.03);
          --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          --radius: 12px;
          --nav-height: 70px;
        }

        .dark {
          --primary-bg: rgba(17, 24, 39, 0.98);
          --secondary-bg: #111827;
          --text-color: #f3f4f6;
          --text-muted: #9ca3af;
          --accent-color: #4CAF50;
          --accent-hover: #4CAF50;
          --border-color: rgba(255, 255, 255, 0.08);
          --card-bg: #1f2937;
          --container-bg: #1f2937;
          --hover-bg: rgba(255, 255, 255, 0.05);
          --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.25), 0 2px 4px -1px rgba(0, 0, 0, 0.15);
        }

        html, body {
          background-color: var(--secondary-bg);
          color: var(--text-color);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          scroll-behavior: smooth;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        button {
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
        }
      `}</style>

      {/* Component-specific styles */}
      <style jsx>{`
        .header {
          background: var(--primary-bg);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border-color);
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: var(--shadow);
          transition: var(--transition);
          height: var(--nav-height);
        }
        
        .header.scrolled {
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.15);
        }
        
        .container {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          height: 100%;
        }
        
        .header-left,
        .header-center,
        .header-right {
          display: flex;
          align-items: center;
          height: 100%;
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
          font-weight: 800;
          font-size: 1.8rem;
          color: var(--accent-color);
          text-decoration: none;
          user-select: none;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          transition: var(--transition);
          height: 100%;
          padding: 0.5rem 0;
        }
        
        .logo:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }
        
        .logo-main {
          color: var(--text-color);
          letter-spacing: -0.5px;
        }
        
        .dark .logo-main {
          color: white;
        }
        
        .nav ul {
          display: flex;
          gap: 1.5rem;
          margin: 0;
          padding: 0;
          list-style: none;
          align-items: center;
          height: 100%;
        }
        
        .nav-link {
          color: var(--text-muted);
          text-decoration: none;
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          font-size: 0.95rem;
          transition: var(--transition);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-radius: var(--radius);
          position: relative;
          height: 100%;
        }
        
        .nav-link:hover,
        .nav-link:focus-visible {
          color: white;
          background: var(--accent-color);
        }
        
        .nav-link.active {
          font-weight: 600;
        }
        
        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 3px;
          background: var(--accent-color);
          border-radius: 3px;
          color: white; 
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
          background: var(--accent-color);
          color: white;
          padding: 0.6rem 1.5rem;
          border-radius: var(--radius);
          font-weight: 500;
          transition: var(--transition);
          border: none;
          text-decoration: none;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          height: 40px;
        }
        
        .auth-button:hover {
          background: var(--accent-hover);
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
        
        .auth-button.active {
          background: var(--accent-hover);
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .auth-icon {
          font-size: 0.9rem;
        }

        .auth-text {
          white-space: nowrap;
        }
        
        /* Theme toggle styles */
        .theme-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          transition: var(--transition);
          color: var(--text-color);
        }
        
        .theme-toggle:hover {
          background: var(--hover-bg);
        }
        
        .theme-icon {
          font-size: 1rem;
          transition: transform 0.3s ease;
        }
        
        .theme-toggle:hover .theme-icon {
          transform: scale(1.1);
        }
        
        /* Overlay styles */
        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease, visibility 0.3s ease;
          backdrop-filter: blur(5px);
        }
        
        .overlay--visible {
          opacity: 1;
          visibility: visible;
        }
        
        /* Hamburger styles */
        .hamburger {
          display: none;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 44px;
          height: 44px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          z-index: 1100;
          border-radius: 50%;
          transition: var(--transition);
          position: relative;
        }
        
        .hamburger:hover {
          background: var(--hover-bg);
        }
        
        .hamburger:focus-visible {
          outline: 2px solid var(--accent-color);
          outline-offset: 2px;
        }
        
        .hamburger-line {
          height: 2px;
          width: 22px;
          background: var(--text-color);
          border-radius: 2px;
          transition: var(--transition);
          position: absolute;
        }
        
        .hamburger-line:nth-child(1) {
          transform: translateY(-7px);
        }
        
        .hamburger-line:nth-child(2) {
          opacity: 1;
        }
        
        .hamburger-line:nth-child(3) {
          transform: translateY(7px);
        }
        
        .hamburger--open .hamburger-line:nth-child(1) {
          transform: translateY(0) rotate(45deg);
        }
        
        .hamburger--open .hamburger-line:nth-child(2) {
          opacity: 0;
        }
        
        .hamburger--open .hamburger-line:nth-child(3) {
          transform: translateY(0) rotate(-45deg);
        }
        
        .hamburger-icon {
          font-size: 1.5rem;
          color: var(--text-color);
        }
        
        /* Responsive styles */
        @media (max-width: 1200px) {
          .container {
            padding: 0 1.5rem;
          }
          
          .nav ul {
            gap: 1rem;
          }
        }
        
        @media (max-width: 992px) {
          .header-center {
            position: static;
            display: block;
          }
          
          .nav {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: var(--primary-bg);
            height: 100vh;
            width: 85%;
            max-width: 320px;
            flex-direction: column;
            padding: 6rem 2rem 2rem;
            transform: translateX(-100%);
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 5px 0 30px rgba(0,0,0,0.15);
            z-index: 1000;
          }
          
          .nav.nav--open {
            transform: translateX(0);
          }
          
          .nav ul {
            flex-direction: column;
            gap: 1.5rem;
            width: 100%;
            height: auto;
          }
          
          .nav-link {
            padding: 1rem 1.5rem;
            width: 100%;
            justify-content: flex-start;
            font-size: 1.1rem;
            height: auto;
            border-radius: 8px;
          }
          
          .nav-link.active::after {
            left: 1.5rem;
            transform: none;
            bottom: 12px;
          }
          
          .hamburger {
            display: flex;
          }
          
          .auth-button {
            padding: 0.6rem 1.25rem;
          }
        }
        
        @media (max-width: 768px) {
          .logo {
            font-size: 1.6rem;
          }
          
          .container {
            padding: 0 1.25rem;
          }
          
          .auth-text {
            display: none;
          }
          
          .auth-button {
            width: 40px;
            height: 40px;
            padding: 0;
            justify-content: center;
          }
          
          .auth-icon {
            font-size: 1rem;
            margin: 0;
          }

          .theme-toggle {
            width: 36px;
            height: 36px;
          }
        }
        
        @media (max-width: 480px) {
          .container {
            padding: 0 1rem;
          }
          
          .logo {
            font-size: 1.5rem;
          }
          
          .nav {
            width: 90%;
            padding: 5rem 1.5rem 2rem;
          }
        }
      `}</style>
    </>
  );
}