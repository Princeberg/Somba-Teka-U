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
      <div className="container" style={{ marginTop: '90px' }}>
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

     <style jsx>{`
  .modal-overlay {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    backdrop-filter: blur(4px);
    animation: fadeIn 0.3s ease forwards;
  }

  @keyframes fadeIn {
    from {opacity: 0;}
    to {opacity: 1;}
  }

  .modal-content {
    background: #fff;
    padding: 32px 28px;
    border-radius: 16px;
    width: 400px;
    max-width: 90vw;
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.25);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    display: flex;
    flex-direction: column;
    gap: 18px;
    transition: transform 0.25s ease;
  }

  .modal-content h2 {
    font-size: 1.6rem;
    font-weight: 700;
    color: #222;
    margin: 0 0 10px 0;
    text-align: center;
  }

  select {
    width: 100%;
    padding: 14px 12px;
    border-radius: 10px;
    border: 2px solid #ddd;
    font-size: 1.1rem;
    outline: none;
    transition: border-color 0.3s ease;
  }

  select:focus {
    border-color: #3498db;
    box-shadow: 0 0 8px #3498dbaa;
  }

  .modal-content p {
    font-size: 1.1rem;
    color: #444;
    margin: 0;
  }

  button {
    padding: 12px 18px;
    font-size: 1.1rem;
    font-weight: 600;
    border-radius: 12px;
    cursor: pointer;
    border: none;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
  }

  button:disabled {
    background: #ccc;
    cursor: not-allowed;
    box-shadow: none;
  }

  .modal-content button:first-of-type {
    background-color: #28a745;
    color: white;
    box-shadow: 0 4px 12px rgba(40, 167, 69, 0.6);
  }
  .modal-content button:first-of-type:hover:not(:disabled) {
    background-color: #218838;
    box-shadow: 0 6px 18px rgba(33, 136, 56, 0.8);
  }

  .modal-content button:last-of-type {
    background-color: #e74c3c;
    color: white;
    box-shadow: 0 4px 12px rgba(231, 76, 60, 0.6);
  }
  .modal-content button:last-of-type:hover {
    background-color: #c0392b;
    box-shadow: 0 6px 18px rgba(192, 57, 43, 0.8);
  }

  .delete-btn {
    background-color: #e74c3c;
    color: white;
    border: none;
    margin-top: 10px;
    margin-right: 10px;
    border-radius: 12px;
    padding: 10px 16px;
    font-weight: 600;
  }

  .boost-btn {
    background-color: #3498db;
    color: white;
    border: none;
    margin-top: 10px;
    border-radius: 12px;
    padding: 10px 16px;
    font-weight: 600;
  }
`}</style>


  <style jsx>{`
  .page-title {
    font-size: 2rem;
    font-weight: 600;
    text-align: center;
    margin-bottom: 30px;
    color: #333;
  }

  grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); /* smaller card width */
    gap: 16px;
  }

  .card {
    background: #fff;
    border-radius: 10px;
    padding: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    max-width: 300px;  /* smaller max width */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .card-title {
    font-size: 1.1rem; /* smaller title font */
    margin-bottom: 6px;
  }

  .card-tag {
    font-size: 0.8rem;
    color: #666;
    margin-bottom: 6px;
  }

  .card-desc {
    font-size: 0.85rem;
    margin-bottom: 10px;
    flex-grow: 1;
  }

  .card-info > div {
    font-size: 0.8rem;
    margin-bottom: 4px;
  }

  .card-images img {
    width: 80px;  
    height: 60px;
    object-fit: cover;
    border-radius: 6px;
    margin-right: 6px;
  }

  .delete-btn,
  .boost-btn {
    width: 100%;
    padding: 10px 16px;
    font-size: 1rem;
    font-weight: 500;
    border-radius: 8px;
    border: none;
    margin-top: 8px;
    transition: background 0.2s ease;
  }

  .delete-btn {
    background-color: #dc3545;
    color: white;
  }

  .delete-btn:hover {
    background-color: #c82333;
  }

  .boost-btn {
    background-color: #007bff;
    color: white;
  }

  .boost-btn:hover {
    background-color: #0056b3;
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 30px;
    gap: 12px;
  }

  .pagination button {
    padding: 8px 14px;
    font-size: 1rem;
    border-radius: 8px;
    border: none;
    background-color: #6c63ff;
    color: white;
    cursor: pointer;
  }

  .pagination button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  .pagination span {
    font-weight: 500;
    font-size: 1rem;
  }
`}</style>

    </>
  );
};

export default AdminViews;
