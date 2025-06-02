'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '@/lib/supabase';
import Header from '@/components/Header4';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'aos/dist/aos.css';
import '@/styles/view.module.css';
import useAuth from '@/lib/Auth';

const AdminViews = () => {
  const router = useRouter();
  const { user, loading } = useAuth(); // useAuth doit retourner { user, loading }
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  // États pour le modal boost
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
    const { error } = await supabase.from('produits').delete().eq('id', id);
    if (error) {
      console.error('Erreur lors de la suppression du produit:', error);
    } else {
      setProducts(products.filter((product) => product.id !== id));
    }
  };

  // --- Fonctions Boost ---

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
    return now.toISOString().split('T')[0]; // format YYYY-MM-DD
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



  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  return (
    <>
      <Header />
      <div className="container" style={{ marginTop: '80px' }}>
        <h1 className="page-title">Vue d&apos;ensemble des produits</h1>

        <div className="grid">
          {currentProducts.map((product) => (
            <div key={product.id} className="card">
              <h3 className="card-title">{product.productName}</h3>
              <span className="card-tag">{product.categorie}</span>
              <p className="card-desc">{product.description}</p>

              <div className="card-info">
                <div><strong>Prix:</strong> {product.price} FCFA</div>
                <div><strong>Nombre de vues:</strong> {product.vues}</div>
                <div><strong>Fin du Boost :</strong> {product.BoostEnd || 'Pas de Boost actif'}   </div>
                {product.boost_end_date && (
                  <div><strong>Boost actif jusqu&apos;au:</strong> {product.BoostEnd}</div>
                )}
              </div>

              <div className="card-images">
                {[product.productPicture1, product.productPicture2, product.productPicture3]
                  .filter(Boolean)
                  .map((img, index) => (
                    <img key={index} src={img} alt={`Image ${index + 1}`} />
                  ))}
              </div>

              <button className="delete-btn" onClick={() => deleteProduct(product.id)}>
                Supprimer
              </button>

              <button className="boost-btn" onClick={() => openBoostModal(product.id)}>
                Booster
              </button>
            </div>
          ))}
        </div>

        <div className="pagination">
          <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
            Précédent
          </button>
          <span>
            Page {currentPage} / {totalPages}
          </span>
          <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
            Suivant
          </button>
        </div>
      </div>

      {/* Modal Boost */}
      {showBoostModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Choisir la durée du Boost</h2>
            <select onChange={e => onBoostOptionChange(e.target.value)} value={boostOption?.id || ''}>
              <option value="">-- Sélectionnez une option --</option>
              {boostOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.label} - {option.price} FCFA
                </option>
              ))}
            </select>

            {boostOption && (
              <div style={{ marginTop: '10px' }}>
                <p><strong>Prix:</strong> {boostPrice} FCFA</p>
                <p><strong>Date de fin du boost:</strong> {boostEndDate}</p>
              </div>
            )}

            <button disabled={!boostOption} onClick={saveBoost} style={{ marginRight: '10px' }}>
              Paiement
            </button>
            <button onClick={() => setShowBoostModal(false)}>Annuler</button>
          </div>
        </div>
      )}

      {/* Styles du modal */}
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }
        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          width: 320px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
        select {
          width: 100%;
          padding: 8px;
          margin-top: 10px;
          font-size: 1rem;
        }
        button {
          padding: 8px 12px;
          font-size: 1rem;
          cursor: pointer;
        }
        .delete-btn {
          background-color: #e74c3c;
          color: white;
          border: none;
          margin-top: 10px;
          margin-right: 10px;
        }
        .boost-btn {
          background-color: #3498db;
          color: white;
          border: none;
          margin-top: 10px;
        }
      `}</style>

      <style jsx>{`
  .modal-overlay {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }

  .modal-content {
    background: #fff;
    padding: 24px;
    border-radius: 16px;
    width: 360px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .modal-content h2 {
    font-size: 1.4rem;
    font-weight: bold;
    margin-bottom: 12px;
    color: #333;
    text-align: center;
  }

  select {
    width: 100%;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 1rem;
    outline: none;
  }

  .modal-content p {
    margin: 6px 0;
    color: #555;
  }

  .modal-content button {
    padding: 10px 16px;
    font-size: 1rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .modal-content button:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  .modal-content button:first-of-type {
    background-color: #28a745;
    color: white;
  }

  .modal-content button:last-of-type {
    background-color: #e74c3c;
    color: white;
  }

  .delete-btn {
    background-color: #e74c3c;
    color: white;
    border: none;
    margin-top: 10px;
    margin-right: 10px;
    border-radius: 8px;
    padding: 8px 12px;
  }

  .boost-btn {
    background-color: #3498db;
    color: white;
    border: none;
    margin-top: 10px;
    border-radius: 8px;
    padding: 8px 12px;
  }
`}</style>

    </>
  );
};

export default AdminViews;
