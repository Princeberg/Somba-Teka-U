'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '@/lib/supabase';
import Header from '@/components/Header4';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'aos/dist/aos.css';
import useAuth from '@/lib/Auth';

const AdminViews = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  // Boost modal states
  const [showBoostModal, setShowBoostModal] = useState(false);
  const [boostProductId, setBoostProductId] = useState(null);
  const [boostOption, setBoostOption] = useState(null);
  const [boostPrice, setBoostPrice] = useState(0);
  const [boostEndDate, setBoostEndDate] = useState(null);

  const boostOptions = [
    { id: 1, label: '5 mois', months: 5, price: 4000 },
    { id: 2, label: '3 mois', months: 3, price: 1000 },
    { id: 3, label: '1 mois', months: 1, price: 500 },
    { id: 4, label: '2 semaines', weeks: 2, price: 200 },
  ];

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('./login');
      } else {
        fetchProducts(user.id);
      }
    }
  }, [user, loading]);

  const fetchProducts = async (sellerId) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('vues', { ascending: false })
      .eq('id_seller', sellerId);

    if (error) {
      console.error('Erreur lors de la récupération des produits:', error);
    } else {
      setProducts(data);
    }
  };

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer ce produit?');
    if (!confirmDelete) return;
    
    const { error } = await supabase.from('produits').delete().eq('id', id);
    if (error) {
      console.error('Erreur lors de la suppression du produit:', error);
    } else {
      setProducts(products.filter((product) => product.id !== id));
    }
  };

  // Boost functions
  const openBoostModal = (productId) => {
    setBoostProductId(productId);
    setBoostOption(null);
    setBoostPrice(0);
    setBoostEndDate(null);
    setShowBoostModal(true);
  };

  const calculateEndDate = (option) => {
    const now = new Date();
    if (option.months) {
      now.setMonth(now.getMonth() + option.months);
    } else if (option.weeks) {
      now.setDate(now.getDate() + option.weeks * 7);
    }
    return now.toISOString().split('T')[0];
  };

  const onBoostOptionChange = (optionId) => {
    const option = boostOptions.find(o => o.id === parseInt(optionId));
    if (option) {
      setBoostOption(option);
      setBoostPrice(option.price);
      setBoostEndDate(calculateEndDate(option));
    } else {
      setBoostOption(null);
      setBoostPrice(0);
      setBoostEndDate(null);
    }
  };

  const saveBoost = () => {
    if (!boostOption || !boostProductId) {
      return alert('Veuillez choisir une option de boost.');
    }

    sessionStorage.setItem('ProductId', boostProductId); 
    sessionStorage.setItem('boost', boostOption.months || boostOption.weeks); 
    sessionStorage.setItem('tarif', boostPrice);
    sessionStorage.setItem('BoostEnd', boostEndDate);

    router.push('/boutique/ActivationScreen');
  };

  // Check if product is boosted
  const isBoosted = (product) => {
    if (!product.BoostEnd) return false;
    const endDate = new Date(product.BoostEnd);
    return endDate > new Date();
  };

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  return (
    <>
      <Header />
      <div className="admin-views-container">
        <h1 className="page-title">Vue d'ensemble des produits</h1>
        <p className="page-subtitle">Gérez et boostez vos produits pour augmenter leur visibilité</p>

        {products.length === 0 ? (
          <div className="no-products">
            <img src="/empty-state.svg" alt="No products" className="empty-image" />
            <p>Vous n'avez aucun produit pour le moment</p>
            <button className="add-product-btn" onClick={() => router.push('/add-product')}>
              Ajouter un produit
            </button>
          </div>
        ) : (
          <>
            <div className="products-grid">
              {currentProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-images">
                    {[product.productPicture1, product.productPicture2, product.productPicture3]
                      .filter(Boolean)
                      .map((img, index) => (
                        <img key={index} src={img} alt={`Image ${index + 1}`} />
                      ))}
                  </div>

                  <div className="product-content">
                    <div className="product-header">
                      <h3 className="product-title">{product.productName}</h3>
                      <span className={`boost-status ${isBoosted(product) ? 'boosted' : 'not-boosted'}`}>
                        {isBoosted(product) ? 'Boosté' : 'Non boosté'}
                      </span>
                    </div>

                    <span className="product-category">{product.categorie}</span>
                    <p className="product-description">{product.description}</p>

                    <div className="product-meta">
                      <div className="meta-item">
                        <span className="meta-label">Prix:</span>
                        <span className="meta-value">{product.price} FCFA</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Vues:</span>
                        <span className="meta-value">{product.vues}</span>
                      </div>
                      {isBoosted(product) && (
                        <div className="meta-item">
                          <span className="meta-label">Fin du boost:</span>
                          <span className="meta-value">{new Date(product.BoostEnd).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    <div className="product-actions">
                      <button className="action-btn delete-btn" onClick={() => deleteProduct(product.id)}>
                        Supprimer
                      </button>
                      <button className="action-btn boost-btn" onClick={() => openBoostModal(product.id)}>
                        Booster
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  onClick={() => setCurrentPage(currentPage - 1)} 
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  &larr; Précédent
                </button>
                <span className="page-indicator">
                  Page {currentPage} sur {totalPages}
                </span>
                <button 
                  onClick={() => setCurrentPage(currentPage + 1)} 
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                >
                  Suivant &rarr;
                </button>
              </div>
            )}
          </>
        )}

        {/* Boost Modal */}
        {showBoostModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="modal-close" onClick={() => setShowBoostModal(false)}>
                &times;
              </button>
              <h2 className="modal-title">Boostez votre produit</h2>
              <p className="modal-subtitle">Choisissez la durée du boost pour augmenter la visibilité</p>

              <div className="form-group">
                <label htmlFor="boost-option" className="form-label">Option de boost</label>
                <select 
                  id="boost-option"
                  onChange={e => onBoostOptionChange(e.target.value)} 
                  value={boostOption?.id || ''}
                  className="form-select"
                >
                  <option value="">-- Sélectionnez une option --</option>
                  {boostOptions.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.label} - {option.price} FCFA
                    </option>
                  ))}
                </select>
              </div>

              {boostOption && (
                <div className="boost-summary">
                  <div className="summary-item">
                    <span className="summary-label">Durée:</span>
                    <span className="summary-value">{boostOption.label}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Prix:</span>
                    <span className="summary-value">{boostPrice} FCFA</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Fin du boost:</span>
                    <span className="summary-value">{new Date(boostEndDate).toLocaleDateString()}</span>
                  </div>
                </div>
              )}

              <div className="modal-actions">
                <button 
                  className="modal-btn primary-btn" 
                  onClick={saveBoost} 
                  disabled={!boostOption}
                >
                  Procéder au paiement
                </button>
                <button 
                  className="modal-btn secondary-btn" 
                  onClick={() => setShowBoostModal(false)}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`

        .page-title {
          font-size: 2rem;
          font-weight: 700;
          text-align: center;
          margin-bottom: 8px;
        }

        .page-subtitle {
          text-align: center;
          margin-bottom: 40px;
          font-size: 1.1rem;
        }

        .no-products {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          text-align: center;
          border-radius: 12px;
        }

        .empty-image {
          width: 200px;
          height: auto;
          margin-bottom: 20px;
          opacity: 0.7;
        }

        .add-product-btn {
          background-color: #3498db;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          margin-top: 20px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .add-product-btn:hover {
          background-color: #2980b9;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }

        .product-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }

        .product-images {
          display: flex;
          height: 180px;
          overflow: hidden;
          border-bottom: 1px solid #eee;
        }

        .product-images img {
          flex: 1;
          object-fit: cover;
          min-width: 0;
          height: 100%;
        }

        .product-content {
          padding: 16px;
        }

        .product-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }

        .product-title {
          font-size: 1.2rem;
          font-weight: 600;
          margin: 0;
          color: #2c3e50;
          flex: 1;
        }

        .boost-status {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 12px;
          margin-left: 8px;
        }

        .boost-status.boosted {
          background-color: #27ae60;
          color: white;
        }

        .boost-status.not-boosted {
          background-color: #e74c3c;
          color: white;
        }

        .product-category {
          display: inline-block;
          font-size: 0.8rem;
          color: #7f8c8d;
          margin-bottom: 8px;
          background: #f1f2f6;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .product-description {
          font-size: 0.9rem;
          color: #34495e;
          margin: 8px 0 16px;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .product-meta {
          margin-bottom: 16px;
        }

        .meta-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 6px;
        }

        .meta-label {
          font-weight: 600;
          color: #7f8c8d;
          font-size: 0.85rem;
        }

        .meta-value {
          color: #2c3e50;
          font-size: 0.85rem;
        }

        .product-actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          flex: 1;
          padding: 8px 12px;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .delete-btn {
          background-color: #e74c3c;
          color: white;
        }

        .delete-btn:hover {
          background-color: #c0392b;
        }

        .boost-btn {
          background-color: #3498db;
          color: white;
        }

        .boost-btn:hover {
          background-color: #2980b9;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 40px;
          gap: 16px;
        }

        .pagination-btn {
          padding: 8px 16px;
          background-color: #3498db;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .pagination-btn:disabled {
          background-color: #bdc3c7;
          cursor: not-allowed;
        }

        .pagination-btn:hover:not(:disabled) {
          background-color: #2980b9;
        }

        .page-indicator {
          font-size: 0.9rem;
          color: #7f8c8d;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          backdrop-filter: blur(5px);
          animation: fadeIn 0.3s;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          width: 100%;
          max-width: 500px;
          padding: 24px;
          position: relative;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #7f8c8d;
          padding: 4px;
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 8px;
          color: #2c3e50;
        }

        .modal-subtitle {
          font-size: 0.95rem;
          color: #7f8c8d;
          margin-bottom: 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #2c3e50;
          font-size: 0.9rem;
        }

        .form-select {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }

        .form-select:focus {
          border-color: #3498db;
          outline: none;
          box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
        }

        .boost-summary {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .summary-item:last-child {
          margin-bottom: 0;
        }

        .summary-label {
          font-weight: 600;
          color: #7f8c8d;
        }

        .summary-value {
          color: #2c3e50;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
        }

        .modal-btn {
          flex: 1;
          padding: 12px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .primary-btn {
          background-color: #27ae60;
          color: white;
          border: none;
        }

        .primary-btn:hover {
          background-color: #219653;
        }

        .primary-btn:disabled {
          background-color: #95a5a6;
          cursor: not-allowed;
        }

        .secondary-btn {
          background-color: white;
          color: #e74c3c;
          border: 1px solid #e74c3c;
        }

        .secondary-btn:hover {
          background-color: #fdf2f2;
        }

        /* Responsive Styles */
        @media (max-width: 768px) {
          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          }

          .admin-views-container {
            margin-top: 80px;
            padding: 0 15px;
          }

          .page-title {
            font-size: 1.7rem;
          }

          .product-images {
            height: 150px;
          }
        }

        @media (max-width: 576px) {
          .products-grid {
            grid-template-columns: 1fr;
          }

          .product-actions {
            flex-direction: column;
          }

          .pagination {
            flex-direction: column;
            gap: 12px;
          }

          .modal-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
};

export default AdminViews;