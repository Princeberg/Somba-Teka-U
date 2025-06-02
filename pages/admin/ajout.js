'use client';

import { useEffect, useState } from 'react';
import supabase from '@/lib/supabase';
import Header from '@/components/Header3';
import { Inter, Poppins } from 'next/font/google';
import 'aos/dist/aos.css';
import '@/styles/ajout.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins'
});

export default function Ajout() {
  const [allRequests, setAllRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 5;
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const { data: requests, error, count } = await supabase
        .from('requests')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (error) throw error;

      setAllRequests(requests || []);
      setTotalItems(count || 0);
    } catch (error) {
      console.error("Erreur lors de la récupération des données: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette demande ?")) return;
    try {
      const { error } = await supabase
        .from('requests')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      alert("Demande supprimée avec succès !");
      fetchRequests();
    } catch (error) {
      alert("Erreur lors de la suppression de la demande.");
      console.error(error);
    }
  };

  const approveProduct = async (productId) => {
  if (!confirm("Êtes-vous sûr de vouloir approuver ce produit ?")) return;
  try {
    // Récupérer la demande
    const {  error: fetchError } = await supabase
      .from('requests')
      .select('*')
      .eq('id', productId)
      .single();

    if (fetchError) throw fetchError;

    // Nettoyer l'objet à insérer
    const productToInsert = { ...rest };

    // Supprimer id_sellers si non défini (ou vide)
    if (productToInsert.id_sellers === undefined) {
      delete productToInsert.id_sellers;
    }

    // Insérer dans la table products
    const { error: insertError } = await supabase
      .from('products')
      .insert([productToInsert]);

    if (insertError) throw insertError;

    // Supprimer la demande après approbation
    const { error: deleteError } = await supabase
      .from('requests')
      .delete()
      .eq('id', productId);

    if (deleteError) throw deleteError;

    alert("Produit approuvé avec succès !");
    fetchRequests();
  } catch (error) {
    alert("Erreur lors de l'approbation du produit : " + error.message);
    console.error(error);
  }
};


  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = allRequests.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <>
      <style jsx global>{`
        :root {
          --font-inter: ${inter.style.fontFamily};
          --font-poppins: ${poppins.style.fontFamily};
        }
      `}</style>

      <Header />

      <div className={`container py-4 ${inter.variable} ${poppins.variable}`} style={{ marginTop: '80px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h5 fw-semibold text-dark" style={{ fontFamily: 'var(--font-poppins)' }}>
            <i className="fas fa-box-open me-2 text-primary"></i>
            Demandes de Produits
          </h1>
          <span className="badge bg-primary text-white px-3 py-2 rounded-pill">
            Total: {totalItems}
          </span>
        </div>

        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
          </div>
        ) : currentItems.length > 0 ? (
          <div className="row g-3">
            {currentItems.map((product) => {
              const dateTime = new Date(product.dateTime || product.created_at).toLocaleString('fr-FR');
              const hasImages = product.productPicture1 || product.productPicture2 || product.productPicture3;

              return (
                <div key={product.id} className="col-12 col-md-6 col-lg-4">
                  <div className="card shadow-sm border-0 rounded-3 h-100">
                    <div className="card-body p-3 d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="h6 text-primary fw-bold mb-0">{product.productName}</h5>
                        <div className="d-flex gap-1">
                          <button
                            onClick={() => approveProduct(product.id)}
                            className="btn btn-outline-success btn-sm rounded-circle"
                            title="Approuver"
                          >
                            <i className="fas fa-check"></i>
                          </button>
                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="btn btn-outline-danger btn-sm rounded-circle"
                            title="Supprimer"
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </div>

                      <div className="mb-2">
                        <span className="badge bg-light text-secondary me-1">{product.categorie}</span>
                        <span className="badge bg-light text-secondary">{product.ville}</span>
                      </div>

                      <ul className="list-unstyled small text-muted mb-2">
                        <li><i className="fas fa-tag me-1"></i> {product.price} FCFA</li>
                        <li><i className="fas fa-user me-1"></i> {product.sellerName || 'Inconnu'}</li>
                        <li><i className="far fa-clock me-1"></i> {dateTime}</li>
                      </ul>

                      {product.description && (
                        <p className="text-muted small line-clamp-2">{product.description}</p>
                      )}

                      {hasImages && (
                        <div className="d-flex gap-2 overflow-auto mt-2 pb-1 scrollbar-hidden">
                          {[product.productPicture1, product.productPicture2, product.productPicture3].map(
                            (src, index) =>
                              src && (
                                <img
                                  key={index}
                                  src={src}
                                  alt="Produit"
                                  className="rounded border object-cover"
                                  style={{ height: '70px', width: '70px' }}
                                />
                              )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-5">
            <i className="fas fa-inbox fa-2x text-muted mb-3"></i>
            <p className="text-muted small">Aucune demande de produit trouvée</p>
          </div>
        )}

        {totalPages > 1 && (
          <nav className="mt-4">
            <ul className="pagination pagination-sm justify-content-center">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  disabled={currentPage === 1}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
              </li>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(pageNum)}>
                      {pageNum}
                    </button>
                  </li>
                );
              })}

              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={currentPage === totalPages}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .object-cover {
          object-fit: cover;
        }

        .scrollbar-hidden::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hidden {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .page-item.active .page-link {
          background-color: #198754;
          border-color: #198754;
          color: white;
        }

        .page-link {
          font-family: var(--font-poppins);
        }

        @media (max-width: 768px) {
          .card-body {
            padding: 1rem;
          }

          .card h5 {
            font-size: 1rem;
          }

          .btn-sm {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </>
  );
}
