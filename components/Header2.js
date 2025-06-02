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
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("fr");
  const router = useRouter();
  const { pathname, asPath } = router;

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);


  const updateDarkMode = (isDark) => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark", isDark);
    }
  };


  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialMode = savedMode ? savedMode === "enabled" : prefersDark;
    setDarkMode(initialMode);
    updateDarkMode(initialMode);

    const savedLang = localStorage.getItem("language") || router.locale || "fr";
    setLanguage(savedLang);
  }, []);

  const translations = {
    en: {
      home: "Home",
      ad: "Advertising",
      about: "About",
      shopSpace: "Seller Space",
      language: "Language",
    },
    fr: {
      home: "Accueil",
      ad: "Publicité",
      about: "À propos",
      shopSpace: "Espace vendeur",
      language: "Langue",
    },
  };

  const t = translations[language] || translations.fr;

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
            <div className="header-controls">
              {/* <button
                onClick={toggleDarkMode}
                className="mode-toggle"
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
              </button> */}

              {/* <div className="language-switcher">
                <button
                  className={`language-btn ${language === "fr" ? "active" : ""}`}
                  onClick={() => changeLanguage("fr")}
                >
                  FR
                </button>
                <span className="language-separator">|</span>
                <button
                  className={`language-btn ${language === "en" ? "active" : ""}`}
                  onClick={() => changeLanguage("en")}
                >
                  EN
                </button>
              </div> */}
            </div>

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

      {/* Global Dark Mode Support */}
      <style jsx global>{`
        :root {
          --primary-bg:   #f8f9fa;
          --secondary-bg: #f8f9fa;
          --text-color: #333333;
          --text-muted: #6c757d;
          --accent-color: #4CAF50;
          --border-color: rgba(0, 0, 0, 0.1);
          --card-bg: #ffffff;
          --container-bg:  #ffffff; 
          --hover-bg: rgba(0, 0, 0, 0.05);
          --shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .dark {
          --primary-bg: rgba(15, 15, 25, 0.95);
          --secondary-bg:rgba(15, 15, 25, 0.95);
          --text-color: white;
          --text-muted: white;
          --accent-color: #5cb85c;
          --border-color: rgba(255, 255, 255, 0.1);
          --card-bg:rgba(0, 0, 0, 0.1);
          --container-bg: rgba(0, 0, 0, 0.1);
          --hover-bg: white;
          --shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
          --coming-soon-container: 0 2px 10px rgba(0, 0, 0, 0.3);

        }

        html, body {
          background-color: var(--secondary-bg);
          color: var(--text-color);
          transition: background-color 0.3s ease, color 0.3s ease;
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
          transition: background-color 0.3s ease, border-color 0.3s ease;
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
        
        .header-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
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
          color: #5cb85c;
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
          position: relative;
        }
        
        .nav-link:hover,
        .nav-link:focus {
          color: white;
          background:  #5cb85c;
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
        
        /* Dark/Light mode toggle */
        .mode-toggle {
          background: transparent;
          border: none;
          color: var(--text-color);
          cursor: pointer;
          font-size: 1.1rem;
          padding: 0.5rem;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        
        .mode-toggle:hover {
          background: var(--hover-bg);
          color: #5cb85c;
        }
        
        /* Language switcher */
        .language-switcher {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          background: var(--hover-bg);
          border-radius: 20px;
          padding: 0.25rem;
        }
        
        .language-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          font-size: 0.8rem;
          padding: 0.25rem 0.5rem;
          border-radius: 15px;
          transition: all 0.3s ease;
          font-weight: 500;
        }
        
        .language-btn.active {
          color: var(--text-color);
          background: rgba(76, 175, 80, 0.3);
        }
        
        .language-btn:hover {
          color: #5cb85c;
        }
        
        .language-separator {
          color: var(--text-muted);
          font-size: 0.8rem;
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
            display: none;
          }
          
          .header-right {
            gap: 1rem;
          }
          
          .header-controls {
            display: none;
          }
          
          .auth-button span {
            display: none;
          }
          
          .nav {
            position: fixed;
            top: 70px;
            right: 0;
            background: var(--primary-bg);
            height: calc(100vh - 70px);
            width: 280px;
            flex-direction: column;
            padding: 2rem 0;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            box-shadow: -5px 0 15px rgba(0,0,0,0.3);
            border-left: 1px solid var(--border-color);
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
            border-radius: 0;
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
        }
      `}</style>
    </>
  );
}