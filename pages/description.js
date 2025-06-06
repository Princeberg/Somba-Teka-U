import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Image from 'next/image';
import supabase from '../lib/supabase';
import Header from '@/components/Header2';

export default function ProductDescription() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [theme, setTheme] = useState('light');
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Handle theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.body.setAttribute('data-theme', savedTheme);
  }, []);

  // Fetch product data
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const { data: product, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (productError) throw productError;
        if (!product) {
          setError('Produit non trouvé');
          return;
        }

        let sellerInfo = {
          sellerName: product.sellerName,
          sellerContact: product.sellerContact,
          WhatsappURL: product.WhatsappURL
        };

        if (!sellerInfo.sellerName || !sellerInfo.sellerContact || !sellerInfo.WhatsappURL) {
          const { data: seller, error: sellerError } = await supabase
            .from('sellers')
            .select('sellerName, sellerContact, WhatsappURL')
            .eq('id_user', product.id_seller)
            .single(); 

          if (sellerError) throw sellerError;

          sellerInfo = {
            sellerName: sellerInfo.sellerName || seller?.sellerName || '',
            sellerContact: sellerInfo.sellerContact || seller?.sellerContact || '',
            WhatsappURL: sellerInfo.WhatsappURL || seller?.WhatsappURL || ''
          };
        }

        const finalProduct = {
          ...product,
          ...sellerInfo
        };

        setProduct(finalProduct);
        await incrementViews(product.id, product.vues || 0);
      } catch (err) {
        console.error('Erreur lors du chargement du produit:', err);
        setError('Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const incrementViews = async (productId, currentViews) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ vues: currentViews + 1 })
        .eq('id', productId);
      if (error) console.error("Erreur lors de l'incrémentation des vues:", error);
    } catch (e) {
      console.error("Erreur inattendue:", e);
    }
  };

  const openModal = (index) => {
    setSelectedImage(index);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = 'auto';
  };

  const navigateImage = (direction) => {
    const newIndex = direction === 'next' 
      ? (selectedImage + 1) % productImages.length 
      : (selectedImage - 1 + productImages.length) % productImages.length;
    setSelectedImage(newIndex);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showModal) {
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowRight') navigateImage('next');
        if (e.key === 'ArrowLeft') navigateImage('prev');
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showModal, selectedImage]);

  const productImages = product ? [
    product.productPicture1,
    product.productPicture2,
    product.productPicture3
  ].filter(Boolean) : [];

  return (
    <>
      <Head>
        <title>{product?.productName || 'Détails du Produit'}</title>
        <meta name="author" content="SOMBA TEKA" />
        <meta name="description" content={product?.description || "Détails du produit"} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content={theme === 'dark' ? '#1a1a2e' : '#ffffff'} />
      </Head>

      <Header />

      <main className="product-page-container">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Chargement en cours...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <i className="fas fa-exclamation-triangle"></i>
            <h1>{error}</h1>
            <button onClick={() => router.back()} className="back-button">
              <i className="fas fa-arrow-left"></i> Retour
            </button>
          </div>
        ) : product ? (
          <>
            <div className="product-gallery-section">
              {productImages.length > 0 ? (
                <>
                  <div className="main-image-wrapper" onClick={() => openModal(0)}>
                    <Image
                      src={productImages[0]}
                      alt={`${product.productName} - Vue principale`}
                      fill
                      className="main-product-image"
                      style={{ objectFit: 'cover' }}
                      priority
                      quality={85}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    {productImages.length > 1 && (
                      <div className="image-count-indicator">
                        <i className="fas fa-images"></i> {productImages.length}
                      </div>
                    )}
                  </div>
                  
                  {productImages.length > 1 && (
                    <div className="thumbnail-gallery">
                      {productImages.map((img, index) => (
                        <div 
                          key={index} 
                          className={`thumbnail-frame ${index === 0 ? 'active' : ''}`}
                          onClick={() => openModal(index)}
                        >
                          <Image
                            src={img}
                            alt={`${product.productName} - Vue ${index + 1}`}
                            fill
                            className="thumbnail-image"
                            style={{ objectFit: 'cover' }}
                            sizes="80px"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="no-image-available">
                  <i className="fas fa-image"></i>
                  <span>Aucune image disponible</span>
                </div>
              )}
            </div>

            <div className="product-info-section">
              <div className="product-header-area">
                <div>
                  <button onClick={() => router.back()} className="back-button">
                    <i className="fas fa-arrow-left"></i> {isMobile ? '' : 'Retour'}
                  </button>
                  <h1 className="product-title">{product.productName}</h1>
                  <div className="product-meta-info">
                    <span className="location-info">
                      <i className="fas fa-map-marker-alt"></i> {product.ville || "Non spécifié"}
                    </span>
                  </div>
                </div>
                
                <div className="price-display">
                  <div className="price-amount">
                    {product.price === 0 || product.price == null
                      ? 'Tarif indéterminé'
                      : `${product.price.toLocaleString()} FCFA`}
                  </div>
                  <span className="price-tag">Prix</span>
                </div>
              </div>

              <div className="description-section">
                <h3 className="section-heading">
                  <i className="fas fa-align-left"></i> Description
                </h3>
                <p className="description-text">{product.description || "Aucune description disponible."}</p>
              </div>

              <div className="seller-info-area">
                <h3 className="section-heading">
                  <i className="fas fa-info-circle"></i> Informations du vendeur
                </h3>
                
                <div className="seller-details-card">
                  <div className="detail-item">
                    <i className="fas fa-user-tie"></i>
                    <div>
                      <div className="detail-label">Vendeur</div>
                      <div className="detail-value">{product.sellerName || "Non spécifié"}</div>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <i className="fas fa-phone"></i>
                    <div>
                      <div className="detail-label">Contact</div>
                      <div className="detail-value">{product.sellerContact || "Non spécifié"}</div>
                    </div>
                  </div>
                </div>

                <div className="action-buttons-container">
                  {product.WhatsappURL && (
                    <a href={product.WhatsappURL} className="whatsapp-action-btn" target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-whatsapp"></i> {isMobile ? 'WhatsApp' : 'Contacter via WhatsApp'}
                    </a>
                  )}
                  {product.sellerContact && (
                    <a href={`tel:${product.sellerContact.replace(/\s/g, '')}`} className="call-action-btn">
                      <i className="fas fa-phone"></i> {isMobile ? 'Appeler' : 'Appeler le vendeur'}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </main>

      {showModal && productImages.length > 0 && (
        <div className="fullscreen-image-modal" onClick={closeModal}>
          <button className="modal-close-button" onClick={closeModal}>
            <i className="fas fa-times"></i>
          </button>
          <button 
            className="modal-navigation-button prev" 
            onClick={(e) => { e.stopPropagation(); navigateImage('prev'); }}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          
          <div className="modal-image-container" onClick={e => e.stopPropagation()}>
            <Image
              src={productImages[selectedImage]}
              alt={`${product.productName} - Vue ${selectedImage + 1}`}
              fill
              style={{ objectFit: 'contain' }}
              quality={100}
              priority
              sizes="100vw"
            />
          </div>
          
          <button 
            className="modal-navigation-button next" 
            onClick={(e) => { e.stopPropagation(); navigateImage('next'); }}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
          
          <div className="image-position-indicator">
            {selectedImage + 1} / {productImages.length}
          </div>
        </div>
      )}

      <style jsx>{`
        /* Base styles */
        :root {
          --accent-color: #4CAF50;
          --text-color: #333;
          --text-light: #666;
          --card-bg: rgba(255, 255, 255, 0.05);
          --border-color: rgba(255, 255, 255, 0.1);
          --whatsapp-green: #25D366;
          --call-blue: #457b9d;
          --error-red: #ff6b6b;
          --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
          --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
          --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.1);
          --transition: all 0.3s ease;
        }

        [data-theme="dark"] {
          --text-color: #f0f0f0;
          --text-light: #b0b0b0;
          --card-bg: rgba(30, 30, 30, 0.8);
          --border-color: rgba(255, 255, 255, 0.1);
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.6;
          color: var(--text-color);
          background-color: var(--background-color);
          transition: background-color 0.3s ease;
        }

        /* Layout */
        .product-page-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem;
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        /* Loading state */
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
          gap: 1rem;
          text-align: center;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 5px solid rgba(76, 175, 80, 0.2);
          border-radius: 50%;
          border-top-color: var(--accent-color);
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Error state */
        .error-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
          gap: 1.5rem;
          text-align: center;
        }

        .error-state i {
          font-size: 3rem;
          color: var(--error-red);
        }

        .error-state h1 {
          font-size: 1.5rem;
          color: var(--text-color);
        }

        /* Gallery section */
        .product-gallery-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .main-image-wrapper {
          position: relative;
          width: 80%;
          aspect-ratio: 1/1;
          border-radius: 12px;
          overflow: hidden;
          cursor: zoom-in;
          transition: var(--transition);
          background: var(--card-bg);
        }

        .main-image-wrapper:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-lg);
        }

        .main-product-image {
          transition: transform 0.3s ease;
        }

        .main-image-wrapper:hover .main-product-image {
          transform: scale(1.02);
        }

        .image-count-indicator {
          position: absolute;
          bottom: 1rem;
          right: 1rem;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        /* Thumbnail gallery */
        .thumbnail-gallery {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
          gap: 0.8rem;
        }

        .thumbnail-frame {
          position: relative;
          aspect-ratio: 1/1;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          transition: var(--transition);
          border: 2px solid transparent;
          opacity: 0.8;
        }

        .thumbnail-frame:hover, 
        .thumbnail-frame.active {
          opacity: 1;
          border-color: var(--accent-color);
          transform: translateY(-2px);
        }

        .thumbnail-image {
          transition: transform 0.3s ease;
        }

        .thumbnail-frame:hover .thumbnail-image {
          transform: scale(1.05);
        }

        /* No image placeholder */
        .no-image-available {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          aspect-ratio: 1/1;
          background: var(--card-bg);
          border-radius: 12px;
          color: var(--text-light);
          font-size: 1.2rem;
          gap: 1rem;
        }

        .no-image-available i {
          font-size: 3rem;
          opacity: 0.5;
        }

        /* Product info section */
        .product-info-section {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        /* Product header */
        .product-header-area {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .back-button {
          background: none;
          border: none;
          color: var(--text-color);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          font-size: 1rem;
          padding: 0.5rem 0;
          transition: color 0.3s ease;
        }

        .back-button:hover {
          color: var(--accent-color);
        }

        .product-title {
          font-size: 1.8rem;
          margin: 0 0 0.5rem 0;
          color: var(--text-color);
          line-height: 1.3;
        }

        .product-meta-info {
          display: flex;
          gap: 1.5rem;
          color: var(--text-light);
          font-size: 0.9rem;
          margin-top: 0.5rem;
          flex-wrap: wrap;
        }

        .product-meta-info i {
          margin-right: 0.3rem;
        }

        /* Price display */
        .price-display {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          align-items: flex-start;
        }

        .price-amount {
          font-size: 1.8rem;
          font-weight: bold;
          color: var(--accent-color);
          white-space: nowrap;
        }

        .price-tag {
          background: var(--call-blue);
          color: white;
          padding: 0.2rem 1rem;
          border-radius: 4px;
          font-size: 0.8rem;
        }

        /* Description section */
        .description-section {
          line-height: 1.6;
        }

        .section-heading {
          font-size: 1.3rem;
          margin: 0 0 1rem 0;
          color: var(--text-color);
          display: flex;
          align-items: center;
          gap: 0.7rem;
        }

        .section-heading i {
          color: var(--accent-color);
        }

        .description-text {
          color: var(--text-color);
          white-space: pre-line;
        }

        /* Seller info */
        .seller-info-area {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .seller-details-card {
          background: var(--card-bg);
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          border: 1px solid var(--border-color);
        }

        .detail-item {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .detail-item i {
          font-size: 1.2rem;
          color: var(--accent-color);
          min-width: 24px;
        }

        .detail-label {
          font-weight: bold;
          font-size: 0.9rem;
          color: var(--text-light);
          margin-bottom: 0.2rem;
        }

        .detail-value {
          color: var(--text-color);
          font-size: 1.1rem;
          word-break: break-word;
        }

        /* Action buttons */
        .action-buttons-container {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .whatsapp-action-btn, 
        .call-action-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.8rem;
          padding: 1rem;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          transition: var(--transition);
          flex: 1;
          min-width: 120px;
          text-align: center;
        }

        .whatsapp-action-btn {
          background:  #128C7E;
          color: white;
        }

        .whatsapp-action-btn:hover {
          background: #128C7E;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(37, 211, 102, 0.3);
        }

        .call-action-btn {
          background:  #3a6a8a;
          color: white;
        }

        .call-action-btn:hover {
          background: #3a6a8a;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(69, 123, 157, 0.3);
        }

        /* Image modal */
        .fullscreen-image-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          cursor: zoom-out;
        }

        .modal-close-button {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: none;
          border: none;
          color: white;
          font-size: 1.8rem;
          cursor: pointer;
          z-index: 1001;
          transition: transform 0.3s ease;
          padding: 0.5rem;
        }

        .modal-close-button:hover {
          transform: scale(1.2);
        }

        .modal-image-container {
          position: relative;
          width: 95%;
          height: 80%;
          max-width: 1200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-navigation-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0, 0, 0, 0.5);
          border: none;
          color: white;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          cursor: pointer;
          z-index: 1001;
          transition: var(--transition);
        }

        .modal-navigation-button:hover {
          background: rgba(0, 0, 0, 0.8);
          transform: translateY(-50%) scale(1.1);
        }

        .modal-navigation-button.prev {
          left: 1rem;
        }

        .modal-navigation-button.next {
          right: 1rem;
        }

        .image-position-indicator {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 0.5rem 1.5rem;
          border-radius: 20px;
          font-size: 1rem;
        }

        /* Responsive adjustments */
        @media (min-width: 640px) {
          .product-page-container {
            padding: 1.5rem;
          }

          .product-title {
            font-size: 2rem;
          }

          .action-buttons-container {
            flex-direction: row;
          }

          .whatsapp-action-btn, 
          .call-action-btn {
            padding: 1rem 1.5rem;
          }
        }

        @media (min-width: 768px) {
          .product-page-container {
            grid-template-columns: 1fr 1fr;
            padding: 2rem;
            gap: 3rem;
          }

          .product-header-area {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-start;
          }

          .price-display {
            align-items: flex-end;
          }

          .thumbnail-gallery {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .product-page-container {
            max-width: 1400px;
          }

          .product-title {
            font-size: 2.2rem;
          }

          .price-amount {
            font-size: 2rem;
          }
        }

        /* Mobile-specific adjustments */
        @media (max-width: 480px) {
          .product-page-container {
            padding: 0.5rem;
          }

          .product-title {
            font-size: 1.5rem;
          }

          .price-amount {
            font-size: 1.5rem;
          }

          .section-heading {
            font-size: 1.2rem;
          }

          .modal-image-container {
            height: 70%;
          }

          .modal-navigation-button {
            width: 40px;
            height: 40px;
            font-size: 1.2rem;
          }

          .image-position-indicator {
            bottom: 1rem;
            font-size: 0.9rem;
          }
        }

        /* Very small devices */
        @media (max-width: 360px) {
          .product-meta-info {
            flex-direction: column;
            gap: 0.5rem;
          }

          .action-buttons-container {
            flex-direction: column;
          }

          .whatsapp-action-btn, 
          .call-action-btn {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}