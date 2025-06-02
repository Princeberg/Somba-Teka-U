import { useEffect } from 'react';
import Head from 'next/head';
import Header from "@/components/Header2";
import '@/styles/ad.css';
import Script from 'next/script';

const AdPage = () => {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Swiper) {
      new window.Swiper('.swiper', {
        loop: true,
        autoplay: {
          delay: 900,
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
        speed: 300,
        grabCursor: true,
      });
    }

    // Modal logic
    const modal = document.getElementById("myModal");
    const modalImg = document.getElementById("img01");
    const modalDescription = document.getElementById("imgDescription");
    const closeBtn = document.getElementsByClassName("close")[0];

    window.openModal = function (imgSrc, description) {
      if (modal && modalImg && modalDescription) {
        modal.style.display = "block";
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

    if (closeBtn) {
      closeBtn.onclick = closeModal;
    }
    modal?.addEventListener('click', e => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', e => {
      if (e.key === "Escape" && modal?.style.display === "block") {
        closeModal();
      }
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
            <p>Augmentez votre visibilité et atteignez votre public cible avec nos solutions publicitaires premium</p>
          </div>
        </section>

        <section className="ad-gallery">
          <div className="container">
            <div className="swiper">
              <div className="swiper-wrapper">
                {[
                  { src: "/pub/d.jpg", desc: "DIESEL GUCCI CONGO TOUR." },
                  { src: "/pub/t.jpg", desc: "Tournoi de FUSTAL" },
                  { src: "/pub/1.jpg", desc: "SOMBA-TEKA La platforme de commerce Local. Achetez et Vendez en toute tranquillité au Congo-Brazzaville." },
                  { src: "/pub/your.jpg", desc: "Nos formations sont conçues pour tous les niveaux..." },
                  { src: "/pub/mouk.jpg", desc: "Promotion bilan de santé. Contact: +242 05 672-32-60" },
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
            <h2 className="cta-title" style={{color: '#4CAF50'}}>Intéressé par nos espaces publicitaires ?</h2>
            <p className="cta-description">
              Profitez de notre audience engagée pour promouvoir votre marque, produit ou service.
              Contactez-nous dès aujourd&apos;hui pour discuter des options disponibles.
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

        {/* Modal */}
        <div id="myModal" className="modal">
          <span className="close">&times;</span>
          <img className="modal-content" id="img01" />
          <div className="modal-description" id="imgDescription"></div>
        </div>
      </div>
    </>
  );
};

export default AdPage;
