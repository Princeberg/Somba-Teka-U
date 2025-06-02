'use client';

import { useEffect, useState } from 'react';
import supabase from '@/lib/supabase';
import Header from '@/components/Header3';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'aos/dist/aos.css';
import '@/styles/view.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminViews = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  useEffect(() => {
  const fetchProducts = async () => {
    try {
      const { data: productsData, error: productError } = await supabase
        .from('products')
        .select('*')
        .order('Booster', { ascending: false });

      if (productError) throw productError;

      const productsWithSellerInfo = await Promise.all(
        productsData.map(async (product) => {
          let { sellerName, sellerContact, WhatsappURL } = product;

          const needsSellerFetch =
            !sellerName?.trim() || !sellerContact?.trim() || !WhatsappURL?.trim();

          if (needsSellerFetch && product.id_seller) {
            const { data: seller, error: sellerError } = await supabase
              .from('sellers')
              .select('sellerName, sellerContact, WhatsappURL')
              .eq('id_user', product.id_seller)
              .single();

            if (sellerError) {
              console.warn(`Erreur lors de la récupération du vendeur pour le produit ${product.id}`, sellerError);
            }

            sellerName = seller?.sellerName || sellerName || '';
            sellerContact = seller?.sellerContact || sellerContact || '';
            WhatsappURL = seller?.WhatsappURL || WhatsappURL || '';
          }

          return {
            ...product,
            sellerName,
            sellerContact,
            WhatsappURL,
          };
        })
      );

      setProducts(productsWithSellerInfo);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    }
  };

  fetchProducts();
}, []);

  const deleteProduct = async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      console.error('Erreur lors de la suppression du produit:', error);
    } else {
      setProducts((prev) => prev.filter((product) => product.id !== id));
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
      <h1 className="page-title">Vue d&apos;ensemble des produits</h1>
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
              <div><strong>{product.vues || '0'} Vues </strong></div>
              <div>Boost: <strong>{product.Booster|| 'Aucun Boost'}  </strong></div>
              <div>Fin du Boost: <strong>{product.BoostEnd || 'Aucune date'}  </strong></div>
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
