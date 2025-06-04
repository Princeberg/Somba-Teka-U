'use client';

import { useEffect, useState } from 'react';
import supabase from '@/lib/supabase';
import Header from '@/components/Header3';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'aos/dist/aos.css';
import { Modal, Button, Spinner, Badge, Alert } from 'react-bootstrap';
import { FiTrash2, FiChevronLeft, FiChevronRight, FiEye, FiDollarSign, FiUser, FiPhone, FiClock } from 'react-icons/fi';
import styles from '@/styles/AdminViews.module.css';

const AdminViews = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const productsPerPage = 8;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
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
                console.warn(`Error fetching seller for product ${product.id}`, sellerError);
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
        console.error('Error loading products:', error);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const deleteProduct = async () => {
    if (!productToDelete) return;
    
    try {
      setDeleteLoading(true);
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productToDelete.id);
      
      if (error) throw error;
      
      setProducts(prev => prev.filter(product => product.id !== productToDelete.id));
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Failed to delete product. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className={`container ${styles.adminContainer}`}>
        <h1 className={styles.pageTitle}>
          <span>Product Management Dashboard</span>
          <Badge bg="secondary" className="ms-2">{products.length} Products</Badge>
        </h1>

        {products.length === 0 ? (
          <div className={styles.emptyState}>
            <img src="/empty-state.svg" alt="No products" width={200} />
            <h3>No products found</h3>
            <p>There are currently no products to display.</p>
          </div>
        ) : (
          <>
            <div className={styles.grid}>
              {currentProducts.map((product) => (
                <div key={product.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>{product.productName}</h3>
                    <Badge bg={product.Booster ? 'warning' : 'secondary'} className="mb-2">
                      {product.Booster ? 'Boosted' : 'Standard'}
                    </Badge>
                  </div>
                  
                  <Badge bg="info" className={styles.categoryBadge}>
                    {product.categorie}
                  </Badge>
                  
                  <div className={styles.cardImages}>
                    {[product.productPicture1, product.productPicture2, product.productPicture3]
                      .filter(Boolean)
                      .map((img, index) => (
                        <img 
                          key={index} 
                          src={img} 
                          alt={`Product ${index + 1}`} 
                          className={styles.productImage}
                          loading="lazy"
                        />
                      ))}
                  </div>
                  
                  <p className={styles.cardDesc}>{product.description}</p>
                  
                  <div className={styles.cardInfo}>
                    <div className={styles.infoItem}>
                      <FiUser className={styles.infoIcon} />
                      <span>{product.sellerName || 'Unknown Seller'}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <FiPhone className={styles.infoIcon} />
                      <span>{product.sellerContact || 'N/A'}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <FiDollarSign className={styles.infoIcon} />
                      <span>{product.price} FCFA</span>
                    </div>
                    <div className={styles.infoItem}>
                      <FiEye className={styles.infoIcon} />
                      <span>{product.vues || '0'} Views</span>
                    </div>
                    {product.Booster && (
                      <div className={styles.infoItem}>
                        <FiClock className={styles.infoIcon} />
                        <span>Boost ends: {formatDate(product.BoostEnd)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className={styles.cardFooter}>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleDeleteClick(product)}
                      className={styles.deleteBtn}
                    >
                      <FiTrash2 className="me-1" /> Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.pagination}>
              <Button 
                variant="outline-primary" 
                onClick={() => setCurrentPage(currentPage - 1)} 
                disabled={currentPage === 1}
                className={styles.paginationBtn}
              >
                <FiChevronLeft /> Previous
              </Button>
              
              <span className={styles.pageInfo}>
                Page {currentPage} of {totalPages}
              </span>
              
              <Button 
                variant="outline-primary" 
                onClick={() => setCurrentPage(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className={styles.paginationBtn}
              >
                Next <FiChevronRight />
              </Button>
            </div>
          </>
        )}

        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete <strong>{productToDelete?.productName}</strong>? This action cannot be undone.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={deleteProduct}
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  {' Deleting...'}
                </>
              ) : 'Delete'}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default AdminViews;