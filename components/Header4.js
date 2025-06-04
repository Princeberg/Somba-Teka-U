import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

export default function AdminHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { pathname } = router;

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
  const handleOverlayClick = () => closeMenu();

  const translations = {
    home: "Accueil",
    demande: "Ajouter un produit",
    view: "Mes produits",
    logout: "Déconnexion",
  };

  return (
    <>
      <header className="header" role="banner">
        <div className="container">
          <div className="header-left">
            <Link href="#" className="logo" onClick={closeMenu} style={{ textDecoration: 'none' }}>
              <div className="logo-container">
                <span className="logo-accent">SOMBA TEKA</span>
              </div>
            </Link>
          </div>

          <div className={`header-center ${isOpen ? "nav--open" : ""}`}>
            <nav id="primary-navigation" className="nav" aria-label="Main menu">
              <ul>
                <li>
                  <Link
                    href="/boutique/menu"
                    onClick={closeMenu}
                    className={`nav-link ${pathname === "/boutique/menu" ? "active" : ""}`}
                    style={{ color: 'black' }}
                    aria-current={pathname === "/boutique/menu" ? "page" : undefined}
                  >
                    <span className="nav-text">{translations.home}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/boutique/demande"
                    onClick={closeMenu}
                    className={`nav-link ${pathname === "/boutique/demande" ? "active" : ""}`}
                    style={{ color: 'black' }}
                    aria-current={pathname === "/boutique/demande" ? "page" : undefined}
                  >
                    <span className="nav-text">{translations.demande}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/boutique/view"
                    onClick={closeMenu}
                    className={`nav-link ${pathname === "/boutique/view" ? "active" : ""}`}
                    style={{ color: 'black' }}
                    aria-current={pathname === "/boutique/view" ? "page" : undefined}
                  >
                    <span className="nav-text">{translations.view}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/logout"
                    onClick={closeMenu}
                    className="nav-link"
                    style={{ color: 'black' }}
                  >
                    <FontAwesomeIcon icon={faRightFromBracket} className="nav-icon" />
                    <span className="nav-text">{translations.logout}</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <div className="header-right">
            <button
              className={`hamburger ${isOpen ? "hamburger--open" : ""}`}
              onClick={toggleMenu}
              aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={isOpen}
              aria-controls="primary-navigation"
            >
              <span className="hamburger-line" />
              <span className="hamburger-line" />
              <span className="hamburger-line" />
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="menu-overlay" onClick={handleOverlayClick} aria-hidden="true" />
        )}
      </header>

      {/* Global Styles */}
      <style jsx global>{`
        :root {
          --primary-bg: #f8f9fa;
          --text-color: #333333;
          --accent-color: #4caf50;
          --border-color: rgba(0, 0, 0, 0.1);
          --shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        html, body {
          background-color: var(--primary-bg);
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
          justify-content: space-between;
          flex-wrap: wrap;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--accent-color);
        }

        .logo-accent {
          font-size: 1.5rem;
          font-weight: 800;
          color:  #333333; 
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
          background: #5cb85c;
          outline: none;
        }

        .nav-link.active {
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
          transform: rotate(45deg) translate(5px, 5px);
        }

        .hamburger--open .hamburger-line:nth-child(2) {
          opacity: 0;
        }

        .hamburger--open .hamburger-line:nth-child(3) {
          transform: rotate(-45deg) translate(5px, -5px);
        }

        @media (max-width: 768px) {
          .header-center {
            position: fixed;
            top: 70px;
            left: 0;
            right: 0;
            background-color: var(--primary-bg);
            transform: translateY(-100%);
            transition: transform 0.3s ease, opacity 0.3s ease;
            z-index: 15;
            box-shadow: var(--shadow);
            border-bottom: 1px solid var(--border-color);
            padding: 1rem 0;
            margin: 0;
            opacity: 0;
            visibility: hidden;
          }

          .header-center.nav--open {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
          }

          nav.nav ul {
            flex-direction: column;
            gap: 0;
            align-items: center;
          }

          nav.nav li {
            width: 100%;
            text-align: center;
            border-bottom: 1px solid var(--border-color);
          }

          .nav-link {
            padding: 1rem;
            font-size: 1.1rem;
            justify-content: center;
          }

          .hamburger {
            display: flex;
          }
        }
      `}</style>
    </>
  );
}
