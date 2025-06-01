'use client';

import { useEffect, useState } from 'react';
import supabase from '@/lib/supabase';
import Header from '@/components/Header3';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'aos/dist/aos.css';
import '@/styles/view.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminViews = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (error) {
        console.error('Erreur lors de la récupération des produits:', error);
      } else {
        setProducts(data);
      }
    };
    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      console.error('Erreur lors de la suppression du produit:', error);
    } else {
      setProducts(products.filter((product) => product.id !== id));
    }
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  return (
    <>
    <Header/>
    <div className="container" style={{marginTop:'80px'}}>
      <h1 className="page-title">Vue d'ensemble des produits</h1>
      <div className="grid">
        {currentProducts.map((product) => (
          <div key={product.id} className="card">
            <h3 className="card-title">{product.productName}</h3>
            <span className="card-tag">{product.categorie}</span>
            <p className="card-desc">{product.description}</p>

            <div className="card-info">
              <div><strong>Vendeur:</strong> {product.sellerName}</div>
              <div><strong>Contact:</strong> {product.sellerContact}</div>
              <div><strong>Prix:</strong> {product.price} FCFA</div>
              <div><strong>{product.vues} Vues </strong></div>
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
    </>
  );
};

export default AdminViews; 
