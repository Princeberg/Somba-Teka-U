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
  { name: 'Mode', icon: 'fa-tshirt' },
  { name: 'Construction', icon: 'fa-hammer' },
  { name: 'Produits Alimentaires', icon: 'fa-apple-whole' },
  { name: 'Décoration intérieure', icon: 'fa-couch' },
  { name: 'Offre de Service', icon: 'fa-hands-helping' },
  { name: 'Autre', icon: 'fa-ellipsis-h' },
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
          <h1 className="product-title" style= {{color: " #4CAF50"}}>{product.categorie}</h1>
          <p className="product-description" style= {{color: "black"}}>{product.description?.substring(0, 10)}...</p>
          <p style= {{color: " #4CAF50"}} > <strong> {product.ville || 'Localisation inconnue'} </strong> </p>

        </div>
      </div>

      <style jsx>{`
        .product-col {
          padding: 8px;
          flex: 0 0 50%;
          max-width: 50%;
        }
        
        .product-card {
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          background: #ffffff;
          cursor: pointer;
          height: 100%;
          display: flex;
          flex-direction: column;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          border: 1px solid #f0f0f0;
          position: relative;
        }

        .product-card:hover {
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
          transform: translateY(-4px);
          border-color:  #4CAF50;
        }

        .product-image-container {
          position: relative;
          width: 100%;
          background: #f9f9f9;
        }

        .image-wrapper {
          position: relative;
          padding-top: 100%; /* 1:1 Aspect Ratio */
          overflow: hidden;
        }

        .product-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 20px;
          transition: transform 0.3s ease;
        }

        .product-card:hover .product-image {
          transform: scale(1.03);
        }

        .price-badge {
          position: absolute;
          bottom: 12px;
          left: 12px;
          background:  #4CAF50;
          color: white;
          padding: 6px 12px;
          border-radius: 4px;
          font-weight: 600;
          font-size: 0.85rem;
          z-index: 2;
          font-family: 'Inter', sans-serif;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .product-details {
          padding: 16px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .product-title {
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          font-size: 0.95rem;
          color: #333;
          margin: 0 0 8px 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 2.8em;
          line-height: 1.4;
        }

        .product-meta {
          margin-top: auto;
          display: flex;
          align-items: center;
        }

        .location {
          font-family: 'Inter', sans-serif;
          color:  #4CAF50;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* Responsive adjustments */
        @media (min-width: 576px) {
          .product-col {
            flex: 0 0 33.333%;
            max-width: 33.333%;
          }
        }

        @media (min-width: 768px) {
          .product-col {
            flex: 0 0 25%;
            max-width: 25%;
            padding: 10px;
          }
          
          .product-title {
            font-size: 1rem;
          }
        }

        @media (min-width: 992px) {
          .product-col {
            flex: 0 0 20%;
            max-width: 20%;
          }
        }

        @media (min-width: 1200px) {
          .product-col {
            flex: 0 0 16.666%;
            max-width: 16.666%;
          }
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
      </Head>

      <Header />

      <div id="categoriesContainer">
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
          >
            <i className={`fas ${icon}`} aria-hidden="true"></i> {name}
          </div>
        ))}
      </div>

      <div className="container text-center">
        {loading ? (
          <div className="spinner" />
        ) : (
          <div className="row">
            {products.length === 0 ? (
              <p>Aucun produit disponible pour le moment.</p>
            ) : (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        )}
      </div>

      <main>
        <FeaturedAds />
      </main>
                <Footer />
      
      <Script src="https://unpkg.com/swiper@8/swiper-bundle.min.js" strategy="beforeInteractive" />
      <Script src="/scripts/main.js" strategy="afterInteractive" />

      <style jsx global>{`
        body {
          background:  #f8f9fa;
          min-height: 100vh;
          margin: 0;
          font-family: 'Inter', sans-serif;
          color: white;
        }
        
        h2.section-title {
          font-family: 'Cardo', serif;
          font-weight: 700;
          color: white;
          font-size: 2rem;
          margin: 3rem auto 1.5rem;
          text-align: center;
          max-width: 900px;
          position: relative;
          display: inline-block;
          padding: 0 20px;
        }
        
        h2.section-title:after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 50px;
          height: 3px;
          background: var(--accent-color);
          border-radius: 3px;
        }
        
        #categoriesContainer {
          max-width: 900px;
          margin: 40px auto;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 15px;
          z-index: 2;
          position: relative;
        }
        
        .category-item {
          background: #4CAF50; 
          border-radius: 30px;
          padding: 12px 20px;
          cursor: pointer;
          color: white;
          font-family: 'Cardo', serif;
          font-size: 1rem;
          display: flex;
          align-items: center;
          gap: 10px;
          user-select: none;
          transition: all 0.3s ease;
          z-index: 2;
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(5px);
        }
        
        .category-item:hover {
          background:  rgba(25, 25, 40, 0.85); 
          color: white;
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        
        .spinner {
          margin: 60px auto;
          border: 6px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
          border-top-color: var(--accent-color);
          position: relative;
          z-index: 2;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto 60px;
          position: relative;
          z-index: 2;
          padding: 0 15px;
        }
        
        .row {
          display: flex;
          flex-wrap: wrap;
          margin: 0 -10px;
        }
        
        @media (max-width: 768px) {
          h2.section-title {
            font-size: 1.5rem;
          }
          
          .category-item {
            padding: 10px 15px;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </>
  );
}