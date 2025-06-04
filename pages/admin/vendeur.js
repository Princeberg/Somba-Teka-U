'use client';

import { useEffect, useState } from 'react';
import supabase from '@/lib/supabase';
import Header from '@/components/Header3';
import 'bootstrap/dist/css/bootstrap.min.css';
import { 
  FiUser, 
  FiTrash2, 
  FiMail, 
  FiPhone, 
  FiMessageSquare, 
  FiCalendar,
  FiLoader,
  FiAlertCircle
} from 'react-icons/fi';
import { 
  Modal, 
  Button, 
  Badge, 
  Spinner, 
  Alert, 
  Table,
  Tooltip,
  OverlayTrigger
} from 'react-bootstrap';
import styles from '@/styles/Vendeur.module.css';

export default function Vendeur() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sellerToDelete, setSellerToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchSellers = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('sellers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSellers(data || []);
    } catch (err) {
      console.error('Error fetching sellers:', err);
      setError("Failed to load sellers. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const handleDeleteClick = (seller) => {
    setSellerToDelete(seller);
    setShowDeleteModal(true);
  };

  const deleteSeller = async () => {
    if (!sellerToDelete) return;
    
    try {
      setDeleteLoading(true);
      const { error } = await supabase
        .from('sellers')
        .delete()
        .eq('id_user', sellerToDelete.id_user);

      if (error) throw error;

      setSellers(prev => prev.filter(seller => seller.id_user !== sellerToDelete.id_user));
      setShowDeleteModal(false);
    } catch (err) {
      console.error('Error deleting seller:', err);
      setError("Failed to delete seller. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <>
      <Header />
      <div className={`container ${styles.sellerContainer}`}>
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>
            <FiUser className="me-2" />
            Seller Management
            <Badge bg="secondary" className="ms-2">
              {sellers.length} {sellers.length === 1 ? 'Seller' : 'Sellers'}
            </Badge>
          </h1>
        </div>

        {error && (
          <Alert variant="danger" className="mt-3">
            <FiAlertCircle className="me-2" />
            {error}
          </Alert>
        )}

        {loading ? (
          <div className={styles.loadingState}>
            <Spinner animation="border" variant="primary" />
            <span className="ms-2">Loading sellers...</span>
          </div>
        ) : sellers.length === 0 ? (
          <div className={styles.emptyState}>
            <img src="/empty-sellers.svg" alt="No sellers" width={200} />
            <h4>No Sellers Found</h4>
            <p className="text-muted">There are currently no sellers registered in the system.</p>
            <Button variant="primary" onClick={fetchSellers}>
              Refresh
            </Button>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <Table striped bordered hover responsive className={styles.sellerTable}>
              <thead>
                <tr>
                  <th>Seller</th>
                  <th>Contact</th>
                  <th>Birth Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sellers.map((seller) => (
                  <tr key={seller.id_user}>
                    <td>
                      <div className={styles.sellerInfo}>
                        <div className={styles.sellerName}>
                          <strong>{seller.sellerName}</strong>
                        </div>
                        <div className={styles.sellerEmail}>
                          <FiMail className="me-1" />
                          <a href={`mailto:${seller.email}`} className={styles.contactLink}>
                            {seller.email}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.contactInfo}>
                        <div className="mb-1">
                          <FiPhone className="me-1" />
                          <a href={`tel:${seller.sellerContact}`} className={styles.contactLink}>
                            {seller.sellerContact}
                          </a>
                        </div>
                        <div>
                          <FiMessageSquare className="me-1" />
                          <a 
                            href={seller.WhatsappURL} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={styles.contactLink}
                          >
                            Message on WhatsApp
                          </a>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.dateInfo}>
                        <FiCalendar className="me-1" />
                        {formatDate(seller.BirthDate)}
                      </div>
                    </td>
                    <td>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Delete this seller</Tooltip>}
                      >
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteClick(seller)}
                          className={styles.deleteBtn}
                        >
                          <FiTrash2 />
                        </Button>
                      </OverlayTrigger>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete seller <strong>{sellerToDelete?.sellerName}</strong>? 
            This action cannot be undone and will remove all associated data.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={deleteSeller}
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  {' Deleting...'}
                </>
              ) : 'Delete Seller'}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}