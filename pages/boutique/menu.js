import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '@/lib/supabase';
import Head from 'next/head';
import Link from 'next/link';
import Header from '@/components/Header4';
import 'aos/dist/aos.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function AdminMenu() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeProducts: 0,
    activeSellers: 0,
  });

  const fetchStats = async (sellerId) => {
    try {
      const { count: activeProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('id_seller', sellerId);

      setStats({
        activeProducts: activeProducts || 0,
        activeSellers: 1,
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques :', error);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        router.push('/');
      } else {
        const user = data.user;
        setUserEmail(user.email);
        await fetchStats(user.id); 
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="loading-screen d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Vendeur</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="author" content="SOMBATEKA" />
        <meta name="description" content="Tableau de bord administrateur SOMBATEKA" />
        <meta name="keywords" content="admin, dashboard, ecommerce" />
        <link rel="shortcut icon" href="/favicon.jpg" />
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cardo:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Font Awesome */} 
        
      </Head>

      <div className="site-wrap">
        <Header/>

        <main className="container admin-container"  >
          {/* Admin Header with Stats */}
          <div className="admin-header">
            <div className="header-content">
              <h1>Tableau de bord Vendeur</h1>
              <p>Somba-Teka</p>
            </div>
            <div className="user-info">
              <div className="user-avatar">
                <i className="fas fa-user-shield"></i>
              </div>
              <div className="user-details">
                <span className="">{userEmail}</span>
               <Link    style={{ textDecoration:'none', color: 'white' }}
  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
  target="_blank"
  rel="noopener noreferrer"
  className="assistance-btn"
>
  <i className="fas fa-headset"></i> Besoin d'assistance
</Link>
              </div>
            </div>
          </div>

          {/* Stats Cards Row - Centered and Responsive */}
          <div className="row stats-row justify-content-center">
            <div className="col-lg-3 col-md-6 mb-4">
              <div className="stat-card stat-card-success">
                <div className="stat-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div className="stat-content">
                  <h3>{stats.activeProducts}</h3>
                  <p> Total de vos produits </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="section-title">
            <h3>Actions rapides</h3>
            <div className="divider"></div>
          </div>

          <div className="row quick-actions justify-content-center">
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="card card-primary h-100" onClick={() => router.push('/boutique/demande')}>
                <div className="card-body">
                  <div className="card-icon">
                    <i className="fas fa-plus-circle"></i>
                  </div>
                  <h5 className="card-title">Ajouter un produit</h5>
                  <p className="card-text">Ajouter des nouveaux produits </p>
                  <div className="card-footer">
                    <button className="btn btn-admin btn-admin-primary">
                      Accéder <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 mb-4">
              <div className="card card-success h-100" onClick={() => router.push('/boutique/view')}>
                <div className="card-body">
                  <div className="card-icon">
                    <i className="fas fa-boxes"></i>
                  </div>
                  <h5 className="card-title">Gestion des produits</h5>
                  <p className="card-text"> Booster et modifier tous vos produits disponibles sur la platforme. </p>
                  <div className="card-footer">
                    <button className="btn btn-admin btn-admin-primary">
                      Accéder <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

      <style jsx>{`
        
        .loading-screen {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color:  #4CAF50;
        }
        
        .admin-container {
          margin-top: 80px;
          max-width: 1200px;
          padding-bottom: 3rem;
        }
        
        .admin-header {
          background: linear-gradient(135deg,   #4CAF50 80%);
          box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15);
          padding: 1.5rem 2rem;
          margin-bottom: 2rem;
          border-radius: 0.35rem;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
        }
        
        .header-content h1 {
          font-family: 'Cardo', serif;
          font-weight: 700;
          margin-bottom: 0.5rem;
          font-size: 1.8rem;
        }
        
        .header-content p {
          opacity: 0.9;
          margin-bottom: 0;
          font-size: 0.9rem;
        }
        
        .user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .user-avatar {
          width: 40px;
          height: 40px;
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }
        
        .user-details {
          display: flex;
          flex-direction: column;
        }
        
        .user-email {
          font-size: 0.85rem;
          opacity: 0.9;
        }
        
        .logout-btn {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }
        
        .logout-btn:hover {
          background: red; 
        }
        
        /* Stats Cards */
        .stats-row {
          margin-bottom: 2rem;
        }
        
        .stat-card {
          border-radius: 0.35rem;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.1);
          transition: transform 0.3s ease;
          height: 100%;
          min-height: 120px;
        }
        
        .stat-card:hover {
          transform: translateY(-5px);
        }
        
        .stat-card-primary {
          background-color: var(--primary-light);
          border-left: 4px solid var(--primary-color);
        }
        
        .stat-card-success {
          background-color: var(--secondary-light);
          border-left: 4px solid var(--secondary-color);
        }
        
        .stat-card-warning {
          background-color: var(--warning-light);
          border-left: 4px solid var(--warning-color);
        }
        
        .stat-card-danger {
          background-color: var(--danger-light);
          border-left: 4px solid var(--danger-color);
        }
        
        .stat-icon {
          font-size: 1.5rem;
          margin-right: 1rem;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .stat-card-primary .stat-icon {
          background-color: rgba(78, 115, 223, 0.1);
          color: var(--primary-color);
        }
        
        .stat-card-success .stat-icon {
          background-color: rgba(28, 200, 138, 0.1);
          color: var(--secondary-color);
        }
        
        .stat-card-warning .stat-icon {
          background-color: rgba(246, 194, 62, 0.1);
          color: var(--warning-color);
        }
        
        .stat-card-danger .stat-icon {
          background-color: rgba(231, 74, 59, 0.1);
          color: var(--danger-color);
        }
        
        .stat-content h3 {
          font-size: 1.5rem;
          margin-bottom: 0.25rem;
          font-weight: 700;
        }
        
        .stat-content p {
          font-size: 0.8rem;
          margin-bottom: 0;
          color: var(--dark-color);
          opacity: 0.8;
        }
        
        /* Section Title */
        .section-title {
          margin-bottom: 1.5rem;
          position: relative;
          text-align: center;
        }
        
        .section-title h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--dark-color);
        }
        
        .divider {
          height: 2px;
          background: linear-gradient(90deg, var(--primary-color) 0%, rgba(0,0,0,0.1) 100%);
          width: 100px;
          margin: 0 auto;
        }
        
        /* Quick Actions Cards */
        .card {
          border: none;
          border-radius: 0.5rem;
          box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          height: 100%;
          cursor: pointer;
          overflow: hidden;
        }
        
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 0.5rem 1.5rem 0 rgba(58, 59, 69, 0.2);
        }
        
        .card-body {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          height: 100%;
          text-align: center;
          align-items: center;
        }
        
        .card-icon {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: var(--primary-color);
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(78, 115, 223, 0.1);
        }
        
        .card-primary .card-icon {
          color: var(--primary-color);
          background-color: rgba(78, 115, 223, 0.1);
        }
        
        .card-success .card-icon {
          color: var(--secondary-color);
          background-color: rgba(28, 200, 138, 0.1);
        }
        
        .card-warning .card-icon {
          color: var(--warning-color);
          background-color: rgba(246, 194, 62, 0.1);
        }
        
        .card-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }
        
        .card-text {
          font-size: 0.9rem;
          color: var(--dark-color);
          opacity: 0.8;
          margin-bottom: 1.5rem;
          flex-grow: 1;
        }
        
        .card-footer {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0;
          background: transparent;
          border-top: none;
          width: 100%;
        }
        
        .btn-admin {
          padding: 0.5rem 1rem;
          font-weight: 500;
          border-radius: 0.35rem;
          transition: all 0.3s;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .btn-admin-primary {
          background:transparent ;
          color: black;
        }
        
        .btn-admin-primary:hover {
          background-color:#4CAF50 ;
          border-color:#4CAF50 ;
          transform: translateX(3px);
          color: white; 
        }
        
        @media (max-width: 992px) {
          .admin-header {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }
          
          .user-info {
            justify-content: center;
          }
        }
        
        @media (max-width: 768px) {
          .admin-container {
            margin-top: 60px;
          }
          
          .stat-card {
            flex-direction: column;
            text-align: center;
          }
          
          .stat-icon {
            margin-right: 0;
            margin-bottom: 1rem;
          }
          
          .card-footer {
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .btn-admin {
            width: 100%;
            justify-content: center;
          }
        }
          .assistance-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: #25d366;
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.assistance-btn:hover {
  background-color: #1ebc59;
  color: white;
}

      `}</style>
    </>
  );
}