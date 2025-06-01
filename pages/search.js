import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import supabase from '../lib/supabase';
import '../styles/search.css';
import Header from '@/components/Header2';

export default function Search() {
  const router = useRouter();
  const { category } = router.query;

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (category) {
      document.title = `${category} | Somba-Teka`;
      fetchProductsByCategory();
    }
  }, [category]);

  async function fetchProductsByCategory() {
    setLoading(true);
    setProducts([]);

    try {
      const { data: productsData, error } = await supabase
        .from('products')
        .select('id, productName, price, productPicture1, categorie, ville, vues, created_at')
        .eq('categorie', category)
        .order('vues', { ascending: false });

      if (error) throw error;

      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <style jsx>{`
        :root {
          --secondary-color: #f8f9fc;
          --dark-bg: #121212;
          --card-bg: #ffffff;
          --text-dark: #343a40;
          --text-light: #f8f9fa;
          --accent-color: #4CAF50;
          --border-color: #dddfeb;
        }

        body {
          background-color: var(--dark-bg);
          color: var(--text-light);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .product-card {
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s;
          background: #ffffff;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #eaeaea;
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .product-card:hover {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          transform: translateY(-6px);
          border-color: #4CAF50;
        }

        .product-image {
          position: relative;
          width: 100%;
          height: 250px;
          object-fit: cover;
          padding: 15px;
        }

        .product-info {
          padding: 18px;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }

        .product-ville {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #4CAF50;
        }

        .product-name {
          font-size: 1.05rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: var(--text-dark);
        }

        .product-price {
          font-size: 1.2rem;
          font-weight: 700;
          color: #4CAF50;
          margin-top: auto;
          padding-top: 8px;
        }

        .product-vues {
          font-size: 0.9rem;
          color: #6c757d;
          margin-top: 8px;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .product-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: #6c757d;
          margin-top: 0.75rem;
          border-top: 1px solid #f0f0f0;
          padding-top: 10px;
        }

        .info-text {
          color: #adb5bd;
          font-size: 0.9rem;
          margin-bottom: 1rem;
          text-align: center;
        }

        .loading-spinner {
          text-align: center;
          padding: 2rem;
        }

        .no-products {
          text-align: center;
          padding: 2rem;
          color: #adb5bd;
          font-size: 1.1rem;
        }

        @media (min-width: 576px) {
          .product-col {
            flex: 0 0 50%;
            max-width: 50%;
          }
        }

        @media (min-width: 768px) {
          .product-col {
            flex: 0 0 33.333%;
            max-width: 33.333%;
            padding: 12px;
          }
        }

        @media (min-width: 992px) {
          .product-col {
            flex: 0 0 25%;
            max-width: 25%;
          }
        }

        @media (min-width: 1200px) {
          .product-col {
            flex: 0 0 20%;
            max-width: 20%;
          }
        }

        .product-col {
          animation: fadeIn 0.5s ease forwards;
          opacity: 0;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="container">
        <div className="row" style={{ textAlign: 'center' }}>
          <div className="col-12">
            <h1>Produits Disponibles</h1>
            <p className="info-text">N&apos;oubliez pas de cliquer sur l&apos;image pour plus d&apos;information</p>
          </div>
        </div>
      </div>

      <div className="container text-center">
        {loading && (
          <div className="loading-spinner">
            <div
              className="spinner-border text-primary"
              style={{ display: 'inline-block', width: '3rem', height: '3rem', borderWidth: '0.25em' }}
            >
              <span className="sr-only">Chargement...</span>
            </div>
            <p className="mt-2">Veuillez patienter...</p>
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="no-products">
            <i className="fas fa-box-open fa-3x mb-3"></i>
            <h4>Aucun produit trouvé</h4>
            <p>Cette catégorie est vide pour le moment.</p>
          </div>
        )}

        <div className="product-grid">
  {products.map((product) => (
    <div className="product-card" key={product.id} onClick={() => router.push(`/description?id=${product.id}`)}>
      <div className="product-image-container">
        <img
          src={product.productPicture1 || 'https://via.placeholder.com/300?text=No+Image'}
          alt={product.productName}
          className="product-image"
        />
      </div>
      <div className="product-info">
        <div className="product-name">{product.productName}</div>
        <div className="product-ville">{product.ville}</div>
        <div className="product-vues">
          <i className="fas fa-eye"></i> {product.vues || 0} vues
        </div>
        <div className="product-price">
          {product.price ? `${product.price} FCFA` : 'Tarif indéterminé'}
        </div>
      </div>
    </div>
  ))}
</div>

      </div>
    </>
  );
}
