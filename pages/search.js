import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import supabase from '../lib/supabase';
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
        .select('*')
        .eq('categorie', category)
        .order('Booster', { ascending: false });

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

      <div className="container py-4">
        <div className="text-center mb-4">
          <h1 className="fw-bold" style={{color:'black'}}>Produits Disponibles</h1>
          <p className="text-muted">
            N&apos;oubliez pas de cliquer sur l&apos;image pour plus d&apos;information
          </p>
        </div>

        {loading && (
          <div className="text-center my-5">
            <div
              className="spinner-border text-primary"
              style={{ width: '3rem', height: '3rem', borderWidth: '0.25em' }}
            >
              <span className="visually-hidden">Chargement...</span>
            </div>
            <p className="mt-2">Veuillez patienter...</p>
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center my-5">
            <i className="fas fa-box-open fa-3x text-secondary mb-3"></i>
            <h4>Aucun produit trouvé</h4>
            <p className="text-muted">Cette catégorie est vide pour le moment.</p>
          </div>
        )}
 <div className="back-button">
  <button onClick={() => router.back()}>
    <i className="fas fa-arrow-left"></i> Retour
  </button>
</div>
        <div className="row g-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="col-12 col-sm-6 col-md-4 col-lg-3"
              onClick={() => router.push(`/description?id=${product.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="card h-100 shadow-sm border-0 product-card-hover">
                <div className="ratio ratio-4x3">
                  <img
                    src={product.productPicture1 || 'https://via.placeholder.com/300?text=No+Image'}
                    alt={product.productName}
                    className="img-fluid rounded-top object-fit-cover"
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
                <div className="card-body">
                  <h5 className="card-title text-truncate">{product.productName}</h5>
                  <p className="text-muted small mb-1">{product.ville}</p>
                  <p className="card-text text-secondary small">
                    {product.description?.substring(0, 60)}...
                  </p>
                  <div className="fw-semibold text-danger">
                    {product.price ? `${product.price} FCFA` : 'Tarif indéterminé'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .product-card-hover:hover {
          transform: translateY(-5px);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        .object-fit-cover {
          object-fit: cover;
        }
        .text-truncate {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
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

      `}</style>
    </>
  );
}
