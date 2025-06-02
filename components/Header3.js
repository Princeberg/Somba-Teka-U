import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faStore,
  faBullhorn,
  faInfoCircle,
  faSun,
  faMoon,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

export default function AdminHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("fr");
  const router = useRouter();
  const { pathname, asPath } = router;

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (typeof window !== "undefined") {
      localStorage.setItem("darkMode", newMode ? "enabled" : "disabled");
      document.documentElement.classList.toggle("dark", newMode);
    }
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang);
    }
    router.push(pathname, asPath, { locale: lang });
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedMode = localStorage.getItem("darkMode");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initialMode = savedMode ? savedMode === "enabled" : prefersDark;
      setDarkMode(initialMode);
      document.documentElement.classList.toggle("dark", initialMode);

      const savedLang = localStorage.getItem("language") || router.locale || "fr";
      setLanguage(savedLang);
    }
  }, [router.locale]);

  const translations = {
    en: {
      home: "Home",
      ajout: "All requests",
      views: " All products ",
      vendeurs: "All sellers",
      logout: "Logout",
      language: "Language",
    },
    fr: {
      home: "Accueil",
      ajout: "Voir les demandes",
      views: "Tous les produits",
      vendeurs: "Tous les Vendeurs",
      logout: "Déconnexion",
      language: "Langue",
    },
  };

  const t = translations[language] || translations.fr;

  // Accessibility: close menu on overlay click
  const handleOverlayClick = () => closeMenu();

  return (
    <>
      <header className="header" role="banner">
        <div className="container">
          <div className="header-left">
            <Link href="#" legacyBehavior>
              <a className="logo" onClick={closeMenu} aria-label="SOMBA TEKA Home">
                <span className="logo-main">SOMBA</span>
                <span className="logo-accent">TEKA</span>
              </a>
            </Link>
          </div>

          <div className="header-center">
            <nav
              id="primary-navigation"
              className={`nav ${isOpen ? "nav--open" : ""}`}
              aria-label="Main menu"
            >
              <ul>
                <li>
                  <Link href="/admin/menu" legacyBehavior>
                    <a
                      onClick={closeMenu}
                      className="nav-link"
                      aria-current={pathname === "/admin/menu" ? "page" : undefined}
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
                      className="nav-link"
                      aria-current={pathname === "/admin/ajout" ? "page" : undefined}
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
                      className="nav-link"
                      aria-current={pathname === "/admin/view" ? "page" : undefined}
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
                      className="nav-link"
                      aria-current={pathname === "/admin/vendeur" ? "page" : undefined}
                    >
                      <FontAwesomeIcon icon={faInfoCircle} className="nav-icon" />
                      <span className="nav-text">{t.vendeurs}</span>
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/logout" legacyBehavior>
                    <a
                      onClick={closeMenu}
                      className="nav-link"
                      aria-current={pathname === "../logout" ? "page" : undefined}
                    >
                      <FontAwesomeIcon icon={faRightFromBracket} className="nav-icon" />
                      <span className="nav-text">{t.logout}</span>
                    </a>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <div className="header-right">
            <div className="header-controls">
              <button
                onClick={toggleDarkMode}
                className="mode-toggle"
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                title={darkMode ? "Passer en mode clair" : "Passer en mode sombre"}
              >
                <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
              </button>

              <div className="language-switcher" aria-label={t.language}>
                <button
                  className={`language-btn ${language === "fr" ? "active" : ""}`}
                  onClick={() => changeLanguage("fr")}
                  aria-pressed={language === "fr"}
                  aria-label="Changer la langue en français"
                  title="Français"
                >
                  FR
                </button>
                <span className="language-separator" aria-hidden="true">
                  |
                </span>
                <button
                  className={`language-btn ${language === "en" ? "active" : ""}`}
                  onClick={() => changeLanguage("en")}
                  aria-pressed={language === "en"}
                  aria-label="Switch language to English"
                  title="English"
                >
                  EN
                </button>
              </div>
            </div>

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

        {/* Overlay for mobile menu */}
        {isOpen && (
          <div
            className="menu-overlay"
            onClick={handleOverlayClick}
            aria-hidden="true"
          />
        )}
      </header>

      {/* Global Dark Mode Support */}
      <style jsx global>{`
        :root {
          --primary-bg:   #f8f9fa;
          --secondary-bg: #f8f9fa;
          --text-color: #333333;
          --text-muted: #6c757d;
          --accent-color: #4caf50;
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
          --text-muted: #ccc;
          --accent-color: #5cb85c;
          --border-color: rgba(255, 255, 255, 0.1);
          --card-bg:rgba(0, 0, 0, 0.1);
          --container-bg: rgba(0, 0, 0, 0.1);
          --hover-bg: rgba(255, 255, 255, 0.15);
          --shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        html, body {
          background-color: var(--secondary-bg);
          color: var(--text-color);
          transition: background-color 0.3s ease, color 0.3s ease;
          font-family: 'Inter', sans-serif;
          margin: 0;
          padding: 0;
        }
          
        .menu-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          z-index: 9;
          cursor: pointer;
        }
      `}</style>

      {/* Component Scoped Styles */}
      <style jsx>{`
        .header {
          position: fixed;
          top: 0;
          width: 100%;
          background-color: var(--primary-bg);
          box-shadow: var(--shadow);
          z-index: 10;
          border-bottom: 1px solid var(--border-color);
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0.5rem 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
        }
        .header-left .logo {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--accent-color);
          text-decoration: none;
          user-select: none;
        }
        .logo-accent {
          color: #333333;
          font-weight: 900;
        }
        .header-center {
          flex: 1 1 auto;
          margin: 0 1rem;
        }
        nav.nav {
          display: flex;
          justify-content: center;
        }
        nav.nav ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          gap: 1.5rem;
        }
        nav.nav li {
          position: relative;
        }
        .nav-link {
          color: var(--text-color);
          font-weight: 600;
          font-size: 1rem;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.5rem 0.3rem;
          border-radius: 4px;
          transition: background-color 0.3s ease;
        }
        .nav-link:hover,
        .nav-link:focus {
          color: white;
          background:  #5cb85c;
          outline: none;
        }
        .nav-link[aria-current="page"] {
          font-weight: 700;
          border-bottom: 2px solid var(--accent-color);
        }
        .nav-icon {
          font-size: 1.2rem;
        }
        .nav-text {
          white-space: nowrap;
        }
        .header-right {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }
        .header-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-right: 1rem;
        }
        .mode-toggle {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-color);
          font-size: 1.2rem;
          padding: 0.25rem;
          border-radius: 4px;
          transition: background-color 0.3s ease;
        }
        .mode-toggle:hover,
        .mode-toggle:focus {
          background-color: var(--hover-bg);
          outline: none;
        }
        .language-switcher {
          display: flex;
          align-items: center;
          font-weight: 600;
          font-size: 0.9rem;
          user-select: none;
        }
        .language-btn {
          cursor: pointer;
          background: none;
          border: none;
          padding: 0.15rem 0.4rem;
          color: var(--text-color);
          font-weight: 600;
          transition: background-color 0.3s ease;
          border-radius: 4px;
        }
        .language-btn.active,
        .language-btn:hover,
        .language-btn:focus {
          background-color: var(--accent-color);
          color: white;
          outline: none;
        }
        .language-separator {
          margin: 0 0.3rem;
          user-select: none;
        }
        .auth-button {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.4rem 0.8rem;
          font-weight: 700;
          background-color: var(--accent-color);
          color: white;
          border-radius: 6px;
          text-decoration: none;
          transition: background-color 0.3s ease;
          user-select: none;
        }
        .auth-button:hover,
        .auth-button:focus {
          background-color: #3a8a35;
          outline: none;
        }
        .auth-icon {
          font-size: 1.1rem;
        }

        /* Hamburger styles */
        .hamburger {
          display: none;
          flex-direction: column;
          justify-content: space-around;
          width: 24px;
          height: 24px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          z-index: 20;
        }
        .hamburger-line {
          width: 24px;
          height: 3px;
          background-color: var(--text-color);
          border-radius: 3px;
          transition: all 0.3s ease;
          transform-origin: 1px;
        }
        .hamburger--open .hamburger-line:nth-child(1) {
          transform: rotate(45deg);
        }
        .hamburger--open .hamburger-line:nth-child(2) {
          opacity: 0;
          transform: translateX(20px);
        }
        .hamburger--open .hamburger-line:nth-child(3) {
          transform: rotate(-45deg);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .header-center {
            position: fixed;
            top: 60px;
            left: 0;
            right: 0;
            background-color: var(--primary-bg);
            transform: translateY(-100%);
            transition: transform 0.3s ease;
            z-index: 15;
            box-shadow: var(--shadow);
            border-bottom: 1px solid var(--border-color);
          }
          .nav.nav--open {
            transform: translateY(0);
          }
          nav.nav ul {
            flex-direction: column;
            gap: 0;
          }
          nav.nav li {
            border-bottom: 1px solid var(--border-color);
          }
          .nav-link {
            padding: 1rem;
            font-size: 1.1rem;
          }
          .header-right {
            gap: 0.3rem;
          }
          .hamburger {
            display: flex;
          }
          .auth-button {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
