import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '../lib/supabase'; 
import Header from '@/components/Header2';
import Head from "next/head";
import FeaturedAds from "@/components/FeaturedAds";
import Footer from "@/components/Footer";
import Script from "next/script";

const categories = [
  { name: 'Véhicule', icon: 'fa-car' },
  { name: 'Parcelle', icon: 'fa-house' },
  { name: 'Appartement', icon: 'fa-building' },
  { name: 'Maison', icon: 'fa-house' },
  { name: 'Appareil Electronique', icon: 'fa-tv' },
  { name: 'Mode', icon: 'fa-shirt' }, 
  { name: 'Construction', icon: 'fa-hammer' },
  { name: 'Produits Alimentaires', icon: 'fa-apple-whole' },
  { name: 'Bien-être', icon: 'fa-spa' }, 
  { name: 'Livre', icon: 'fa-book' },
  { name: 'Décoration intérieure', icon: 'fa-couch' },
  { name: 'Offre de Service', icon: 'fa-handshake' },
  { name: 'Autre', icon: 'fa-ellipsis' },
];


function ProductCard({ product }) {
  const router = useRouter();

  return (
    <div className="product-col">
      <div
        className="product-card"
        onClick={() => router.push(`/description?id=${product.id}`)}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') router.push(`/description?id=${product.id}`);
        }}
      >
        <div className="product-image-container">
          <div className="image-wrapper">
            <img 
              src={product.productPicture1 || '/placeholder-image.jpg'} 
              alt={product.productName || 'Produit'} 
              className="product-image"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder-image.jpg';
              }}
            />
          </div>
          <div className="price-badge">
            {product.price === 0 || product.price === null || product.price === undefined
              ? 'Tarif indéterminé'
              : `${product.price.toLocaleString()} FCFA`}
          </div>
        </div>
        <div className="product-details">
          <h3 className="product-title">{product.productName}</h3>
          <h4 className="product-category">{product.categorie}</h4>
          <p className="product-description">{product.description?.substring(0, 80)}{product.description && product.description.length > 80 ? '...' : ''}</p>
          <p className="product-location"><strong>{product.ville || 'Localisation inconnue'}</strong></p>
        </div>
      </div>

      <style jsx>{`
        .product-col {
          padding: 12px;
          flex: 0 0 100%;
          max-width: 100%;
          display: flex;
          justify-content: center;
        }
        
        @media (min-width: 576px) {
          .product-col {
            flex: 0 0 50%;
            max-width: 50%;
          }
        }

        @media (min-width: 992px) {
          .product-col {
            flex: 0 0 33.333%;
            max-width: 33.333%;
          }
        }

        .product-card {
          border-radius: 16px;
          overflow: hidden;
          background: #fff;
          cursor: pointer;
          height: 100%;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          border: 1px solid #e0e0e0;
          position: relative;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          max-width: 320px;
          width: 100%;
        }

        .product-card:hover {
          box-shadow: 0 10px 24px rgba(0,0,0,0.18);
          transform: translateY(-6px);
          border-color: #4CAF50;
        }

        .product-image-container {
          position: relative;
          width: 100%;
          background: #fafafa;
          border-bottom: 1px solid #e0e0e0;
        }

        .image-wrapper {
          position: relative;
          padding-top: 75%; /* 4:3 Aspect Ratio */
          overflow: hidden;
        }

        .product-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .product-card:hover .product-image {
          transform: scale(1.05);
        }

        .price-badge {
          position: absolute;
          bottom: 12px;
          left: 12px;
          background: #4CAF50;
          color: white;
          padding: 8px 14px;
          border-radius: 6px;
          font-weight: 700;
          font-size: 0.95rem;
          font-family: 'Inter', sans-serif;
          box-shadow: 0 3px 6px rgba(0,0,0,0.15);
          user-select: none;
          pointer-events: none;
        }

        .product-details {
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          color: #333;
        }

        .product-title {
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 1.2rem;
          margin: 0 0 6px 0;
          line-height: 1.3;
          color: #222;
        }

        .product-category {
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 1rem;
          margin: 0 0 10px 0;
          color: #4CAF50;
        }

        .product-description {
          font-family: 'Inter', sans-serif;
          font-size: 0.9rem;
          line-height: 1.4;
          flex-grow: 1;
          color: #555;
          margin: 0 0 12px 0;
          min-height: 56px;
        }

        .product-location {
          font-family: 'Inter', sans-serif;
          font-size: 0.9rem;
          color: #4CAF50;
          margin: 0;
          user-select: none;
        }
      `}</style>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('Booster', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching products:', error);
      } else {
        setProducts(data || []);
      }

      setLoading(false);
    }
    fetchProducts();
  }, []);

  function handleCategoryClick(categoryName) {
    router.push(`/search?category=${encodeURIComponent(categoryName)}`);
  }

  return (
    <>
      <Head>
        <title>SOMBA TEKA - Marché Local Congo-Brazzaville</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="shortcut icon" href="/favicon.jpg" />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          rel="stylesheet"
        />
      </Head>

      <Header />

      <section id="categoriesContainer" aria-label="Catégories de produits">
        {categories.map(({ name, icon }) => (
          <div
            key={name}
            className="category-item"
            onClick={() => handleCategoryClick(name)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleCategoryClick(name);
            }}
            aria-label={`Catégorie ${name}`}
          >
            <i className={`fas ${icon}`} aria-hidden="true"></i>
            <span>{name}</span>
          </div>
        ))}
      </section>

      <main className="container" aria-live="polite" aria-busy={loading}>
        {loading ? (
          <div className="spinner" aria-label="Chargement en cours" />
        ) : (
          <div className="row">
            {products.length === 0 ? (
              <p className="no-products">Aucun produit disponible pour le moment.</p>
            ) : (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        )}
      </main>

      <FeaturedAds />

      <Footer />

      <Script src="https://unpkg.com/swiper@8/swiper-bundle.min.js" strategy="beforeInteractive" />
      <Script src="/scripts/main.js" strategy="afterInteractive" />
<style jsx global>{`
  #categoriesContainer {
    max-width: 100%;
    margin: 30px auto 40px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
    z-index: 2;
    padding: 0 10px;
  }

  .category-item {
    background: #4CAF50;
    border-radius: 32px;
    padding: 10px 18px;
    cursor: pointer;
    color: white;
    font-family: 'Cardo', serif;
    font-size: 1rem;
    display: flex;
    align-items: center;
    gap: 12px;
    user-select: none;
    transition: all 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 2px 4px rgba(76, 175, 80, 0.2);
    white-space: nowrap;
  }

  .category-item:hover,
  .category-item:focus-visible {
    background: rgba(25, 25, 40, 0.9);
    color: #4CAF50;
    border-color: #4CAF50;
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.5);
    outline-color: #4CAF50;
    transform: translateY(-2px);
  }

  .category-item i {
    font-size: 1.2rem;
    width: 24px;
    text-align: center;
  }

  .spinner {
    margin: 50px auto;
    border: 6px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    width: 48px;
    height: 48px;
    animation: spin 1s linear infinite;
    border-top-color: #4CAF50;
    position: relative;
    z-index: 2;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .container {
    max-width: 1200px;
    margin: 0 auto 50px;
    position: relative;
    z-index: 2;
    padding: 0 20px;
  }

  .row {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 16px;
    margin: 0 -10px;
  }

  .no-products {
    font-family: 'Inter', sans-serif;
    font-size: 1.1rem;
    color: #777;
    text-align: center;
    width: 100%;
    padding: 30px 0;
  }

  @media (max-width: 576px) {
    .category-item {
      font-size: 0.95rem;
      padding: 8px 14px;
      gap: 10px;
    }

    .category-item i {
      font-size: 1rem;
      width: 20px;
    }
  }
`}</style>

    </>
  );
}