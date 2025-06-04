export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="social-links">
          <a href="#"><i className="fab fa-facebook-f"></i></a>
          <a href="#"><i className="fab fa-instagram"></i></a>
        </div>
        <p>
          &copy; 2025 SOMBA TEKA. Tous droits réservés.<br />
          Plateforme de commerce local au Congo-Brazzaville. <br />
          Designed by Magic & Tech
        </p>
      </div>

      <style jsx>{`
        .footer {
          position: relative;
          z-index: 3;
          background-color: #222;
          color: #fff;
          text-align: center;
          padding: 2rem 1rem;
          margin-top: 4rem;
        }

        .footer-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .social-links {
          margin-bottom: 1rem;
        }

        .social-links a {
          color: #fff;
          margin: 0 10px;
          font-size: 1.2rem;
          transition: color 0.3s ease;
        }

        .social-links a:hover {
          color: #f39c12;
        }

        p {
          font-size: 0.9rem;
          line-height: 1.5;
        }
      `}</style>
    </footer>
  );
}
