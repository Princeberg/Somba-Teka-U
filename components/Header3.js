import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faStore,
  faBullhorn,
  faInfoCircle,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

export default function AdminHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { pathname } = router;

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

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

  const handleOverlayClick = () => closeMenu();

  return (
    <>
      <header className="header" role="banner">
        <div className="container">
          <div className="header-right">
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

          <nav
            id="primary-navigation"
            className={`nav ${isOpen ? "nav--open" : ""}`}
            aria-label="Main menu"
          >
            <ul>
              <li>
                <Link
                  href="/admin/menu"
                  onClick={closeMenu}
                  className="nav-link"
                  aria-current={pathname === "/admin/menu" ? "page" : undefined}
                >
                  <FontAwesomeIcon icon={faHome} className="nav-icon" />
                  <span className="nav-text">{t.home}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/ajout"
                  onClick={closeMenu}
                  className="nav-link"
                  aria-current={pathname === "/admin/ajout" ? "page" : undefined}
                >
                  <FontAwesomeIcon icon={faStore} className="nav-icon" />
                  <span className="nav-text">{t.ajout}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/view"
                  onClick={closeMenu}
                  className="nav-link"
                  aria-current={pathname === "/admin/view" ? "page" : undefined}
                >
                  <FontAwesomeIcon icon={faBullhorn} className="nav-icon" />
                  <span className="nav-text">{t.views}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/vendeur"
                  onClick={closeMenu}
                  className="nav-link"
                  aria-current={pathname === "/admin/vendeur" ? "page" : undefined}
                >
                  <FontAwesomeIcon icon={faInfoCircle} className="nav-icon" />
                  <span className="nav-text">{t.vendeurs}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/logout"
                  onClick={closeMenu}
                  className="nav-link"
                  aria-current={pathname === "/logout" ? "page" : undefined}
                >
                  <FontAwesomeIcon icon={faRightFromBracket} className="nav-icon" />
                  <span className="nav-text">{t.logout}</span>
                </Link>
              </li>
            </ul>
          </nav>
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

      {/* Global Styles */}
      <style jsx global>{`
        :root {
          --primary-bg: #f8f9fa;
          --secondary-bg: #f8f9fa;
          --text-color: #333333;
          --accent-color: #4caf50;
          --border-color: rgba(0, 0, 0, 0.1);
          --hover-bg: rgba(0, 0, 0, 0.05);
          --shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        html, body {
          background-color: var(--secondary-bg);
          color: var(--text-color);
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
          justify-content: flex-end;
          position: relative;
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
          background: #5cb85c;
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
          z-index: 20;
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
          nav.nav {
            position: fixed;
            top: 60px;
            left: 0;
            right: 0;
            background-color: black; 
            transform: translateY(-150%);
            transition: transform 0.3s ease;
            z-index: 15;
            box-shadow: var(--shadow);
            border-bottom: 1px solid var(--border-color);
            padding: 1rem 0;
            color: black; 
          }
          
          nav.nav.nav--open {
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
          
          .hamburger {
            display: flex;
          }
        }
      `}</style>
    </>
  );
}