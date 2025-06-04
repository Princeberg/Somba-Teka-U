// ... (importe les mêmes dépendances)
import { useEffect } from 'react';
import Head from 'next/head';
import Header from "@/components/Header2";
import Footer from "@/components/Footer";
import Script from 'next/script';

const AdPage = () => {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Swiper) {
      new window.Swiper('.swiper', {
        loop: true,
        autoplay: {
          delay: 1000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          dynamicBullets: true,
        },
        keyboard: {
          enabled: true,
          onlyInViewport: true,
        },
        effect: 'slide',
        speed: 800,
        grabCursor: true,
      });
    }

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

    document.addEventListener('contextmenu', e => e.preventDefault());
  }, []);

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
      <Header />

      <div className="site-wrap">
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
                  { src: "/pub/your.jpg", desc: "Formations accessibles à tous niveaux..." },
                  { src: "/pub/mouk.jpg", desc: "Promotion bilan de santé. +242 05 672-32-60" },
                  { src: "/pub/osiane.jpg", desc: "..." },
                  { src: "/pub/gfdm.jpg", desc: "..." },
                  { src: "/pub/concert.jpg", desc: "..." },
                  { src: "/pub/promo.jpg", desc: "..." }
                ].map(({ src, desc }, i) => (
                  <div key={i} className="swiper-slide">
                    <img src={src} alt={`Publicité ${i + 1}`} onClick={() => window.openModal(src, desc)} />
                  </div>
                ))}
              </div>
              <div className="swiper-pagination"></div>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="container">
            <h2 className="cta-title">Intéressé par nos espaces publicitaires ?</h2>
            <p className="cta-description">
              Profitez de notre audience engagée pour promouvoir votre marque, produit ou service.
            </p>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
              className="cta-button"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-whatsapp"></i> Demander un espace
            </a>
          </div>
        </section>
          <Footer />

        <div id="myModal" className="modal">
          <span className="close">&times;</span>
          <img className="modal-content" id="img01" />
          <div className="modal-description" id="imgDescription"></div>
        </div>
      </div>
    

      <style jsx>{`
        .site-wrap {
          font-family: 'Segoe UI', sans-serif;
          color: #333;
          background: #f9f9f9;
        }
        .hero {
          background: linear-gradient(120deg, #1f4037, #99f2c8);
          color: white;
          padding: 60px 20px;
          text-align: center;
        }
        .hero h1 {
          font-size: 2.8rem;
          margin-bottom: 15px;
        }
        .hero p {
          font-size: 1.2rem;
          max-width: 600px;
          margin: 0 auto;
        }

        .ad-gallery {
          padding: 40px 0;
        }
        .swiper {
          width: 100%;
          height: auto;
          padding: 20px 0;
        }
        .swiper-slide {
          text-align: center;
        }
        .swiper-slide img {
          width: 100%;
          height: auto;
          width: 600px; 
          object-fit: cover;
          border-radius: 12px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
          cursor: pointer;
          transition: transform 0.3s;
        }
        .swiper-slide img:hover {
          transform: scale(1.03);
        }

        .cta-section {
          background: #fff;
          text-align: center;
          padding: 60px 20px;
        }
        .cta-title {
          font-size: 2rem;
          margin-bottom: 15px;
          color: #4CAF50;
        }
        .cta-description {
          font-size: 1.1rem;
          margin-bottom: 25px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        .cta-button {
          display: inline-block;
          background: #25D366;
          color: white;
          padding: 14px 30px;
          font-size: 1rem;
          border-radius: 8px;
          text-decoration: none;
          transition: background 0.3s;
        }
        .cta-button:hover {
          background: #1ebd5d;
        }

        .modal {
          display: none;
          position: fixed;
          z-index: 9999;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.8);
          align-items: center;
          justify-content: center;
          flex-direction: column;
        }
        .modal-content {
         height: auto;
          width: 500px; 
          border-radius: 12px;
          box-shadow: 0 0 30px rgba(0,0,0,0.4);
        }
        .modal-description {
          margin-top: 20px;
          color: #fff;
          font-size: 1.1rem;
          text-align: center;
        }
        .close {
          position: absolute;
          top: 20px;
          right: 30px;
          color: white;
          font-size: 2rem;
          cursor: pointer;
          z-index: 10000;
        }

        @media (max-width: 768px) {
          .hero h1 {
            font-size: 2rem;
          }
          .swiper-slide img {
            max-height: auto; 
            max-width:500px; 
          }
          .cta-title {
            font-size: 1.5rem;
          }
          .cta-description {
            font-size: 1rem;
          }
        }
      `}</style>
    </>
  );
};

export default AdPage;
