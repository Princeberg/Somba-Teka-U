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
  const [modalImage, setModalImage] = useState('');
  const [showModal, setShowModal] = useState(false);


  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.body.setAttribute('data-theme', savedTheme);
  }, []);

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

      // Fusionner dans un seul objet
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

  const openModal = (imgSrc) => {
    setModalImage(imgSrc);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = 'auto';
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showModal && e.key === 'Escape') closeModal();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showModal]);

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
      </Head>

      <Header />

      <main className="container main-content">
        {loading ? (
          <div className="product-info">
            <h1 className="product-title">Chargement en cours...</h1>
          </div>
        ) : error ? (
          <div className="product-info">
            <h1 className="product-title">{error}</h1>
          </div>
        ) : product ? (
          <>
            <div className="product-images-container">
              {productImages.length > 0 ? (
                <div className="image-grid">
                  {productImages.map((img, index) => (
                    <div key={index} className="image-item" onClick={() => openModal(img)}>
                      <Image
                        src={img}
                        alt={`${product.productName} - Vue ${index + 1}`}
                        fill
                        className="product-image"
                        style={{ objectFit: 'cover' }}
                        priority={index === 0}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-image-placeholder">
                  <i className="fas fa-image"></i>
                  <span>Aucune image disponible</span>
                </div>
              )}
            </div>

            <div className="product-info">
              <div className="product-header">
                <h1 className="product-title">{product.productName}</h1>
                    <div className="back-button">
  <button onClick={() => router.back()}>
    <i className="fas fa-arrow-left"></i> Retour
  </button>
</div>
                <div className="product-price">
                  {product.price === 0 || product.price == null
                    ? 'Tarif indéterminé'
                    : `${product.price} FCFA`} <span className="price-badge">Prix</span>
                </div>
              </div>

              <div className="seller-info">
                <h3 className="info-title"><i className="fas fa-info-circle"></i> Détails du produit</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <i className="fas fa-align-left"></i>
                    <div className="info-text">
                      <span className="info-label">Description</span>
                      <span className="info-value">{product.description || "Aucune description disponible."}</span>
                    </div>
                  </div>

                 <div className="info-item">
  <i className="fas fa-user-tie"></i>
  <div className="info-text">
    <span className="info-label">Vendeur</span>
    <span className="info-value">{product.sellerName || "Non spécifié"}</span>
  </div>
</div>

<div className="info-item">
  <i className="fas fa-phone"></i>
  <div className="info-text">
    <span className="info-label">Contact</span>
    <span className="info-value">{product.sellerContact || "Non spécifié"}</span>
  </div>
</div>


                  <div className="info-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <div className="info-text">
                      <span className="info-label">Localisation</span>
                      <span className="info-value">{product.ville || "Non spécifié"}</span>
                    </div>
                  </div>
                </div>

                <div className="action-buttons">
                  {product.WhatsappURL && (
                    <a href={product.WhatsappURL} className="whatsapp-btn" target="_blank" rel="noopener noreferrer">
                      <i className="fab fa-whatsapp"></i> WhatsApp
                    </a>
                  )}
                  {product.sellerContact && (
                    <a href={`tel:${product.sellerContact.replace(/\s/g, '')}`} className="call-btn">
                      <i className="fas fa-phone"></i> Appeler
                    </a>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </main>

      {showModal && (
        <div id="imageModal" className="modal show" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <span className="close" onClick={closeModal}>&times;</span>
          <img className="modal-content" src={modalImage} alt="Zoomed product" />
        </div>
      )}

      <style jsx>{`
        .product-images-container {
          margin-bottom: 2rem;
        }

        .image-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }

        .image-item {
          position: relative;
          width: 100%;
          padding-top: 75%; /* 4:3 ratio */
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
        }

        .product-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 80%;
          height: auto;
        }

       .image-item:hover .product-image {
          transform: scale(1.05);
          box-shadow: 0 10px 20px #4CAF50;
        }

        .no-image-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 300px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: rgba(255, 255, 255, 0.5);
          font-size: 1.2rem;
        }

        .no-image-placeholder i {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .product-info {
          background: white;
          backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .product-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .product-title {
          font-size: 1.8rem;
          margin: 0;
          color: var(--text-color);
        }

        .product-price {
          font-size: 1.5rem;
          font-weight: bold;
          color: var(--accent-color);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .price-badge {
          font-size: 0.8rem;
          background: #457b9d;
          color: white;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }

        .back-button button {
          background: none;
          border: none;
          color: var(--text-color);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          font-size: 1rem;
          padding: 0.5rem 0;
        }

        .back-button button:hover {
          color: var(--accent-color);
        }

        .seller-info {
          margin-top: 2rem;
        }

        .info-title {
          font-size: 1.3rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-color);
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .info-item {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .info-item i {
          font-size: 1.2rem;
          color: var(--accent-color);
          margin-top: 0.2rem;
        }

        .info-text {
          display: flex;
          flex-direction: column;
        }

        .info-label {
          font-weight: bold;
          margin-bottom: 0.3rem;
          color: var(--text-color);
        }

        .info-value {
          color: var(--text-light);
          line-height: 1.5;
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .whatsapp-btn, .call-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.8rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .whatsapp-btn {
          background: #25D366;
          color: white;
        }

        .whatsapp-btn:hover {
          background: #128C7E;
          transform: translateY(-2px);
        }

        .call-btn {
          background: #457b9d;
          color: white;
        }

        .call-btn:hover {
          opacity: 0.9;
          transform: translateY(-2px);
        }

        .modal {
          display: flex;
          position: fixed;
          z-index: 1000;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.9);
          align-items: center;
          justify-content: center;
        }

        .modal-content {
          max-width: 40%;
          max-height: auto;
          border-radius: 12px;
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
        }

        .close {
          position: absolute;
          top: 20px;
          right: 30px;
          color: #ffffff;
          font-size: 2rem;
          font-weight: bold;
          cursor: pointer;
          z-index: 1001;
        }

        .close:hover {
          color: #ccc;
        }

        @media (max-width: 768px) {
          .image-grid {
            grid-template-columns: 1fr;
          }

          .product-header {
            flex-direction: column;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }

          .action-buttons {
            flex-direction: column;
          }

          .whatsapp-btn, .call-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
}
