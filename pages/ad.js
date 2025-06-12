import { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from "@/components/Header2";
import Link from "next/link";
import Footer from "@/components/Footer";
import Script from 'next/script';

const AdPage = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark'); // Add dark class to <html>
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Initialize Swiper if window is defined
    const initializeSwiper = () => {
      if (typeof window !== 'undefined' && window.Swiper) {
        new window.Swiper('.swiper', {
          loop: true,
          autoplay: {
            delay: 3000, // Increased from 1s to 3s for better viewing
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          },
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          keyboard: {
            enabled: true,
            onlyInViewport: true,
          },
          effect: 'slide',
          speed: 800,
          grabCursor: true,
          breakpoints: {
            640: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 40,
            },
          }
        });
      }
    };

    // Modal functionality
    const setupModal = () => {
      const modal = document.getElementById("myModal");
      const modalImg = document.getElementById("img01");
      const modalDescription = document.getElementById("imgDescription");
      const closeBtn = document.getElementsByClassName("close")[0];

      window.openModal = function (imgSrc, description) {
        if (modal && modalImg && modalDescription) {
          modal.style.display = "flex";
          modalImg.src = imgSrc;
          modalDescription.textContent = description;
          document.body.style.overflow = "hidden";
        }
      };

      const closeModal = () => {
        if (modal) {
          modal.style.display = "none";
          document.body.style.overflow = "auto";
        }
      };

      if (closeBtn) closeBtn.onclick = closeModal;
      modal?.addEventListener('click', e => {
        if (e.target === modal) closeModal();
      });

      document.addEventListener('keydown', e => {
        if (e.key === "Escape" && modal?.style.display === "flex") closeModal();
      });
    };

    initializeSwiper();
    setupModal();

    // Cleanup function
    return () => {
      document.removeEventListener('keydown', () => {});
      const modal = document.getElementById("myModal");
      if (modal) {
        modal.removeEventListener('click', () => {});
      }
    };
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newMode);
  };


  return (
    <>
         <Head>
        <title>Espace Publicitaire | SOMBATEKA</title>
        <meta name="description" content="Plateforme publicitaire de SOMBATEKA - Commerce Local à Portée de Clic" />
        <meta name="keywords" content="publicité, annonces, Congo-Brazzaville, marketing digital, visibilité" />
        <meta name="author" content="SOMBATEKA" />
        <link rel="shortcut icon" href="/favicon.jpg" />
      </Head>
      <Script src="https://unpkg.com/swiper@8/swiper-bundle.min.js" strategy="beforeInteractive" />
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className={`site-wrap${darkMode ? ' dark-mode' : ''}`}>
        <section className="hero">
          <div className="container">
            <h1>Espace Publicitaire</h1>
            <p>Augmentez votre visibilité avec nos solutions publicitaires premium</p>
          </div>
        </section>

        <section className="ad-gallery">
          <div className="container">
            <div className="swiper">
              <div className="swiper-wrapper">
                {[
                  { src: "/pub/d.jpg", desc: "DIESEL GUCCI CONGO TOUR." },
                  { src: "/pub/t.jpg", desc: "Tournoi de FUSTAL" },
                  { src: "/pub/1.jpg", desc: "SOMBA-TEKA - Achetez et Vendez au Congo-Brazzaville." },
                  { src: "/pub/2.jpg", desc: "SOMBA-TEKA - Achetez et Vendez au Congo-Brazzaville." },
                  { src: "/pub/3.jpg", desc: "SOMBA-TEKA - Achetez et Vendez au Congo-Brazzaville." },
                  { src: "/pub/your.jpg", desc: "Formations accessibles à tous niveaux..." },
                  { src: "/pub/mouk.jpg", desc: "Promotion bilan de santé. +242 05 672-32-60" },
                  { src: "/pub/osiane.jpg", desc: "..." },
                  { src: "/pub/gfdm.jpg", desc: "..." },
                  { src: "/pub/concert.jpg", desc: "..." },
                  { src: "/pub/promo.jpg", desc: "..." }
                ].map(({ src, desc }, i) => (
                  <div key={i} className="swiper-slide">
                    <img 
                      src={src} 
                      alt={`Publicité ${i + 1}`} 
                      onClick={() => window.openModal(src, desc)}
                      loading="lazy" // Add lazy loading
                    />
                  </div>
                ))}
              </div>
              <div className="swiper-pagination"></div>
              <div className="swiper-button-next"></div>
              <div className="swiper-button-prev"></div>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="container">
            <h2 className="cta-title">Intéressé par nos espaces publicitaires ?</h2>
            <p className="cta-description">
              Profitez de notre audience engagée pour promouvoir votre marque, produit ou service.
            </p>
            <div className="cta-buttons">
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                className="cta-button whatsapp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-whatsapp"></i> Contact WhatsApp
              </a>
            </div>
          </div>
        </section>

       <section className="pricing-section">
  <div className="container">
    <h2>Nos Offres Publicitaires</h2>
    <div className="pricing-cards">
      <div className="pricing-card">
        <h3>Basic</h3>
        <div className="price">1 999 FCFA<span></span></div>
        <ul>
          <li>1 bannière dans l'espace publicitaire</li>
          <li>Durée : 15 jours</li>
          <li>1 post sur nos réseaux</li>
          <li>2 affiches offertes</li>
        </ul>
      </div>
      <div className="pricing-card featured">
        <div className="popular-badge">Populaire</div>
        <h3>Premium</h3>
        <div className="price">8 499 FCFA<span></span></div>
        <ul>
          <li>2 bannières dans l'espace publicitaire</li>
          <li>Durée : 30 jours</li>
          <li>2 posts sur nos réseaux</li>
          <li>3 affiches et 2 montages vidéo offerts</li>
        </ul>
      </div>
      <div className="pricing-card">
        <h3>Événements & Concerts</h3>
        <div className="price">25 499 FCFA<span></span></div>
        <ul>
          <li>3 bannières dans l'espace publicitaire</li>
          <li>Durée: Jusqu'à la fin de l'événement</li>
          <li>Campagne sur nos réseaux sociaux</li>
          <li>Sponsoring de l'événement dans la communication (affiches, montages vidéo, badges, etc.)</li>
        </ul>
      </div>
    </div>
  </div>
</section>

        <Footer darkMode={darkMode} />

        <div id="myModal" className="modal">
          <span className="close">&times;</span>
          <img className="modal-content" id="img01" />
          <div className="modal-description" id="imgDescription"></div>
        </div>
      </div>

      <style jsx global>{`
        :root {
          --primary-color: #4CAF50;
          --primary-dark: #3e8e41;
          --secondary-color: #2196F3;
          --gray-light: #f5f5f5;
          --gray-dark: #333;
          --text-light: #f5f5f5;
          --text-dark: #333;
          --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          --transition: all 0.3s ease;
        }
        .dark-mode {
          --primary-color: #4CAF50;
          --primary-dark: #3e8e41;
          --secondary-color: #64B5F6;
          --gray-light: #3D3D3D;
          --gray-dark: #E0E0E0;
          --text-light: #F5F5F5;
          --text-dark: #F5F5F5;
          --shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        }
          
      `}</style>
     <style jsx>{`
        .site-wrap {
          font-family: 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          color: var(--text-dark);
          background: var(--light-color);
          min-height: 100vh;
          transition: var(--transition);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Hero Section */
        .hero {
          background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
          color: var(--text-light);
          padding: 80px 20px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url('/pub/pattern.svg') repeat;
          opacity: 0.1;
          z-index: 0;
        }

        .hero .container {
          position: relative;
          z-index: 1;
        }

        .hero h1 {
          font-size: 2.8rem;
          margin-bottom: 15px;
          font-weight: 700;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        }

        .hero p {
          font-size: 1.2rem;
          max-width: 600px;
          margin: 0 auto 30px;
          opacity: 0.9;
        }

        /* Gallery Section */
        .ad-gallery {
          padding: 60px 0;
          background: var(--light-color);
        }

        .swiper {
          width: 100%;
          height: auto;
          padding: 20px 0 40px;
        }

        .swiper-slide {
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 10px;
        }

        .swiper-slide img {
          max-width: 100%;
          height: auto;
          max-height: 400px;
          object-fit: contain;
          border-radius: 12px;
          box-shadow: var(--shadow);
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: 1px solid rgba(0,0,0,0.1);
        }

        .swiper-slide img:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }

        .swiper-pagination {
          bottom: 10px !important;
        }

        .swiper-pagination-bullet {
          background: var(--gray-dark);
          opacity: 0.6;
          width: 10px;
          height: 10px;
          margin: 0 8px !important;
        }

        .swiper-pagination-bullet-active {
          background: var(--primary-color);
          opacity: 1;
        }

        .swiper-button-next,
        .swiper-button-prev {
          color: var(--primary-color) !important;
          background: rgba(0,0,0,0.1);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          transition: var(--transition);
        }

        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background: rgba(0,0,0,0.2);
        }

        .swiper-button-next::after,
        .swiper-button-prev::after {
          font-size: 1.2rem !important;
        }

        /* CTA Section */
        .cta-section {
          background: var(--gray-light);
          text-align: center;
          padding: 80px 20px;
          border-radius: 12px;
          margin: 40px auto;
          max-width: 1200px;
        }

        .cta-title {
          font-size: 2rem;
          margin-bottom: 15px;
          color: var(--primary-color);
        }

        .cta-description {
          font-size: 1.1rem;
          margin-bottom: 30px;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
          color: var(--text-dark);
          opacity: 0.9;
        }

        .cta-buttons {
          display: flex;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .cta-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 14px 30px;
          font-size: 1rem;
          border-radius: 8px;
          text-decoration: none;
          transition: var(--transition);
          font-weight: 600;
          border: none;
          cursor: pointer;
        }

        .cta-button.whatsapp {
          background: #25D366;
          color: white;
        }

        .cta-button.email {
          background: var(--secondary-color);
          color: white;
        }

        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        /* Pricing Section */
        .pricing-section {
          padding: 60px 0;
          background: var(--light-color);
        }

        .pricing-section h2 {
          text-align: center;
          font-size: 2rem;
          margin-bottom: 40px;
          color: var(--primary-color);
        }

        .pricing-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
          padding: 0 20px;
        }

        .pricing-card {
          background: var(--gray-light);
          border-radius: 12px;
          padding: 30px;
          box-shadow: var(--shadow);
          position: relative;
          transition: var(--transition);
          border: 1px solid rgba(0,0,0,0.1);
        }

        .pricing-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.15);
        }

        .pricing-card.featured {
          border: 2px solid var(--primary-color);
        }

        .popular-badge {
          position: absolute;
          top: -10px;
          right: 20px;
          background: var(--primary-color);
          color: white;
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: bold;
        }

        .pricing-card h3 {
          font-size: 1.5rem;
          margin-bottom: 15px;
          color: var(--primary-color);
        }

        .price {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 20px;
          color: var(--text-dark);
        }

        .price span {
          font-size: 1rem;
          opacity: 0.7;
        }

        .pricing-card ul {
          list-style: none;
          padding: 0;
          margin-bottom: 30px;
        }

        .pricing-card ul li {
          padding: 8px 0;
          border-bottom: 1px dashed rgba(0,0,0,0.1);
          color: var(--text-dark);
        }

        .pricing-card ul li:last-child {
          border-bottom: none;
        }

        .pricing-button {
          width: 100%;
          padding: 12px;
          background: var(--primary-color);
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: bold;
          cursor: pointer;
          transition: var(--transition);
        }

        .pricing-button:hover {
          background: var(--primary-dark);
        }

        /* Modal */
        .modal {
          display: none;
          position: fixed;
          z-index: 9999;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.9);
          align-items: center;
          justify-content: center;
          flex-direction: column;
        }

        .modal-content {
          max-height: 80vh;
          max-width: 90vw;
          object-fit: contain;
          border-radius: 8px;
          animation: zoomIn 0.3s;
        }

        @keyframes zoomIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .modal-description {
          margin-top: 20px;
          color: var(--text-light);
          font-size: 1.2rem;
          text-align: center;
          max-width: 80%;
          padding: 10px 20px;
          background: rgba(0,0,0,0.7);
          border-radius: 8px;
        }

        .close {
          position: absolute;
          top: 30px;
          right: 30px;
          color: white;
          font-size: 2.5rem;
          cursor: pointer;
          z-index: 10000;
          transition: var(--transition);
        }

        .close:hover {
          color: var(--primary-color);
          transform: rotate(90deg);
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .hero h1 {
            font-size: 2.4rem;
          }
          
          .pricing-cards {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .hero {
            padding: 60px 20px;
          }
          
          .hero h1 {
            font-size: 2rem;
          }
          
          .hero p {
            font-size: 1rem;
          }
          
          .cta-buttons {
            flex-direction: column;
            gap: 15px;
          }
          
          .cta-button {
            width: 100%;
          }
          
          .swiper-slide img {
            max-height: 300px;
          }
          
          .modal-content {
            max-width: 95vw;
          }
        }

        @media (max-width: 480px) {
          .hero h1 {
            font-size: 1.8rem;
          }
          
          .cta-title {
            font-size: 1.5rem;
          }
          
          .pricing-cards {
            grid-template-columns: 1fr;
          }
          
          .modal-description {
            font-size: 1rem;
          }
          
          .close {
            top: 15px;
            right: 15px;
            font-size: 2rem;
          }
        }
      `}</style>
    </>
  )
};
export default AdPage;   

