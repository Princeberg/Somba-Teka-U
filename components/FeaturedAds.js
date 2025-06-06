'use client';

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Link from "next/link";
import "swiper/css/pagination";
import { FiArrowRight } from "react-icons/fi";

export default function FeaturedAds() {
  const [modalData, setModalData] = useState({ visible: false, src: "", description: "" });
  const [isHovering, setIsHovering] = useState(false);

  const openModal = (imgSrc, description) => {
    setModalData({ visible: true, src: imgSrc, description });
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setModalData({ visible: false, src: "", description: "" });
    document.body.style.overflow = "auto";
  };

  return (
    <section className="featured-ads">
      <h2 className="section-title">Publicités à la une</h2>

      <div className="swiper-container">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          loop={true}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation={true}
          slidesPerView={1}
          spaceBetween={20}
          centeredSlides={true}
        >
          {["concert.jpg", "d.jpg", "osiane.jpg", "t.jpg", "1.jpg"].map((img, index) => (
            <SwiperSlide key={index}>
              <div className="slide-content">
                <img
                  src={`/pub/${img}`}
                  alt={`Publicité ${index + 1}`}
                  onClick={() =>
                    openModal(
                      `/pub/${img}`,
                      img === "1.jpg"
                        ? "SOMBA-TEKA La plateforme de commerce Local."
                        : `Description de la publicité ${index + 1}`
                    )
                  }
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="btn-container">
        <Link 
          href="/ad" 
          className="btn btn-danger"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <span>Voir plus de publicités</span> 
          <div className={`hover-effect ${isHovering ? 'active' : ''}`}></div>
          <FiArrowRight className="arrow-icon" />
        </Link>
      </div>

      {/* Modal */}
      {modalData.visible && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-image-container">
              <img 
                src={modalData.src} 
                alt="En grand" 
                className="modal-image"
              />
            </div>
            {modalData.description && (
              <p className="modal-description">{modalData.description}</p>
            )}
            <button className="modal-close-btn" onClick={closeModal}>
              &times;
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .featured-ads {
          width: 100%;
          padding: 3rem 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          border-radius: 16px;
          margin: 2rem auto;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
          max-width: 900px; 
        }

       .section-title {
  color: var(--text-color);
  text-align: center;
  margin-bottom: 2rem;
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  width: 100%;
  font-weight: 700;
  position: relative;
  padding-bottom: 1rem;
  line-height: 1.2;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: var(--accent-color);
  border-radius: 2px;
}

        .swiper-container {
          width: 100%;
          padding: 0 1rem;
          margin-bottom: 2rem;
        }

        .slide-content {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 1rem;
          transition: all 0.3s ease;
        }

        .slide-content:hover {
          transform: translateY(-5px);
        }

        .slide-content img {
          width: 100%;
          max-width: 600px;
          height: auto;
          cursor: pointer;
          border-radius: 12px;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .slide-content img:hover {
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
        }

        .btn-container {
          display: flex;
          justify-content: center;
          margin-top: 2rem;
          width: 100%;
        }

        .btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.8rem 2rem;
          border-radius: 50px;
          font-weight: 600;
          text-decoration: none;
          overflow: hidden;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
        }

        .btn-danger {
          background: linear-gradient(to right, #ff4d4d, #f9cb28);
          color: white;
        }

        .btn span {
          position: relative;
          z-index: 2;
        }

        .hover-effect {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to right, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.3));
          transform: translateX(-100%);
          transition: transform 0.5s ease;
          z-index: 1;
        }

        .hover-effect.active {
          transform: translateX(100%);
        }

        .arrow-icon {
          margin-left: 0.5rem;
          transition: transform 0.3s ease;
        }

        .btn:hover .arrow-icon {
          transform: translateX(3px);
        }

        /* Modal styles */
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 1rem;
          box-sizing: border-box;
        }

        .modal-content {
          background-color: #fff;
          padding: 2rem;
          border-radius: 12px;
          max-width: 90vw;
          max-height: 90vh;
          width: auto;
          height: auto;
          overflow: auto;
          text-align: center;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .modal-image-container {
          max-width: 100%;
          max-height: calc(90vh - 120px);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .modal-image {
          max-width: 100%;
          max-height: 100%;
          height: auto;
          width: auto;
          object-fit: contain;
          border-radius: 8px;
        }

        .modal-description {
          margin-top: 1rem;
          font-size: 1rem;
          color: #333;
          max-width: 100%;
          padding: 0 1rem;
        }

        .modal-close-btn {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #333;
          padding: 0.5rem;
        }

        .modal-close-btn:hover {
          color: #000;
        }

        @media (max-width: 768px) {
          .featured-ads {
            padding: 2rem 1rem;
            margin: 1rem auto;
          }

          .modal-content {
            padding: 1.5rem;
          }
          
          .modal-image-container {
            max-height: calc(70vh - 80px);
          }
        }

        @media (max-width: 480px) {
          .section-title {
            font-size: 1.5rem;
          }

          .modal-content {
            padding: 1rem;
            max-width: 95vw;
          }
          
          .modal-description {
            font-size: 0.9rem;
          }
        }
          
      `}</style>
    </section>
  );
}