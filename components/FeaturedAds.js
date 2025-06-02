'use client';

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Link from "next/link";
import "swiper/css/pagination";

export default function FeaturedAds() {
  const [modalData, setModalData] = useState({ visible: false, src: "", description: "" });

  const openModal = (imgSrc, description) => {
    setModalData({ visible: true, src: imgSrc, description });
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setModalData({ visible: false, src: "", description: "" });
    document.body.style.overflow = "auto";
  };

  return (
    <section className="featured-ads" style={{ padding: "20px 0", position: "relative" }}>
      <h2 className="section-title" style={{ color: "#333", textAlign: "center", marginBottom: "20px" }}>Publicités à la une</h2>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={true}
        slidesPerView={1}
        spaceBetween={20}
        centeredSlides={true}
        style={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}
      >
        {["concert.jpg", "d.jpg", "osiane.jpg", "t.jpg", "1.jpg"].map((img, index) => (
          <SwiperSlide key={index}>
            <img
              src={`/pub/${img}`}
              alt={`Publicité ${index + 1}`}
              style={{ width: "100%", height: "auto", cursor: "pointer" }}
              onClick={() =>
                openModal(
                  `/pub/${img}`,
                  img === "1.jpg"
                    ? "SOMBA-TEKA La plateforme de commerce Local."
                    : `Description de la publicité ${index + 1}`
                )
              }
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
        <Link
          href="/ad" 
          className="request-btn"
          style={{
            padding: "12px 24px",
            backgroundColor: " #4CAF50",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
            fontWeight: "bold",
            textAlign: "center",
            transition: "background-color 0.3s",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
            display: "inline-block"
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(25, 25, 40, 0.85)"}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = " #4CAF50"}
        >
          Voir plus d'annonces publicitaires
        </Link>
      </div>

      {modalData.visible && (
        <div 
          id="myModal" 
          className="modal"
          style={{
            display: "block",
            position: "fixed",
            zIndex: 1000,
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.9)",
            overflow: "auto"
          }}
        >
          <span 
            className="close" 
            onClick={closeModal}
            style={{
              position: "absolute",
              top: "20px",
              right: "35px",
              color: "#f1f1f1",
              fontSize: "40px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            &times;
          </span>
          <img 
            className="modal-content" 
            src={modalData.src} 
            alt="Modal" 
            style={{
              display: "block",
              margin: "60px auto",
              maxWidth: "80%",
              maxHeight: "80%"
            }}
          />
          <div 
            className="modal-description"
            style={{
              textAlign: "center",
              color: "#fff",
              padding: "10px 0",
              fontSize: "18px",
              maxWidth: "80%",
              margin: "0 auto"
            }}
          >
            {modalData.description}
          </div>
        </div>
      )}

      <style jsx>{`
        .featured-ads {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        
        @media (max-width: 750px) {
          .modal-content {
            max-width: 95% !important;
          }
        }
      `}</style>
    </section>
  );
}