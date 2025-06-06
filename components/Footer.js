export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-grid">
          <div className="footer-section">
            <h3>SOMBA TEKA</h3>
            <p>Plateforme de commerce local au Congo-Brazzaville.</p>
            <div className="social-links">
              <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 SOMBA TEKA. Tous droits réservés.</p>
          <p className="credits">Designed by Magic & Tech</p>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background-color:  #111827;
          color: #fff;
          padding: 3rem 1rem 1rem;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          margin-top: 4rem;
        }

        .footer-content {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
          justify-items: center;
        }

        .footer-section {
          text-align: center;
        }

        .footer-section h3 {
          color: white;
          margin-bottom: 1.2rem;
          font-size: 1.2rem;
          position: relative;
          padding-bottom: 0.5rem;
        }

        .footer-section h3::after {
          content: '';
          position: absolute;
          left: 50%;
          bottom: 0;
          width: 50px;
          height: 2px;
          background:white;
          transform: translateX(-50%);
        }

        .footer-section p {
          font-size: 0.9rem;
          line-height: 1.6;
          color: #bbb;
          margin-bottom: 1.5rem;
        }

        .social-links {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }

        .social-links a {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 1.5rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .footer-bottom p {
          margin: 0;
          color: #bbb;
          font-size: 0.85rem;
        }

        .credits {
          color: white;
          font-size: 15px;
        }

        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .footer-section {
            text-align: center;
          }

          .footer-section h3::after {
            left: 50%;
            transform: translateX(-50%);
          }

          .social-links {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .footer {
            padding: 2rem 1rem 1rem;
          }

          .footer-bottom {
            flex-direction: column;
          }
        }
      `}</style>
    </footer>
  );
}
