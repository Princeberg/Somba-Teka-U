'use client';

import { useEffect, useState } from 'react';
import supabase from '@/lib/supabase';
import '@/styles/vendeur.css';
import Header from '@/components/Header3';
import 'aos/dist/aos.css';
import '@/styles/ajout.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Vendeur() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSellers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sellers')
        .select('id_user, shop_name, email, statut, TypeAbonnement, DernierPayement')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSellers(data || []);
    } catch (err) {
      console.error('Erreur lors de la récupération des vendeurs :', err);
      alert("Erreur lors de la récupération des données.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const toggleStatus = async (id_user, currentStatus) => {
    try {
      const { error } = await supabase
        .from('sellers')
        .update({ statut: !currentStatus })
        .eq('id_user', id_user);

      if (error) throw error;

      setSellers((prev) =>
        prev.map((seller) =>
          seller.id_user === id_user ? { ...seller, statut: !currentStatus } : seller
        )
      );
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut :', err);
      alert("Erreur lors de la mise à jour du statut.");
    }
  };

  const deleteSeller = async (id_user) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce vendeur ?")) return;

    try {
      const { error } = await supabase
        .from('sellers')
        .delete()
        .eq('id_user', id_user);

      if (error) throw error;

      setSellers((prev) => prev.filter((seller) => seller.id_user !== id_user));
      alert("Vendeur supprimé.");
    } catch (err) {
      console.error('Erreur lors de la suppression du vendeur :', err);
      alert("Erreur lors de la suppression.");
    }
  };

  return (

    <>
    <Header/>
    <div className="seller-container" style={{marginTop:'80px'}}>
      <h1 className="seller-title">Gestion des Vendeurs</h1>

      {loading ? (
        <p className="text-center">Chargement...</p>
      ) : sellers.length === 0 ? (
        <p className="text-center text-muted">Aucun vendeur trouvé.</p>
      ) : (
        <div className="table-responsive">
          <table className="table seller-table">
            <thead>
              <tr>
                <th>Nom du Magasin</th>
                <th>Email</th>
                <th>Type Abonnement</th>
                <th>Dernier Paiement</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((seller) => (
                <tr key={seller.id_user}>
                  <td>{seller.shop_name}</td>
                  <td>{seller.email}</td>
                  <td>{seller.TypeAbonnement}</td>
                  <td>{seller.DernierPayement || '-'}</td>
                  <td>
                    {seller.statut ? (
                      <span className="status-active">Actif</span>
                    ) : (
                      <span className="status-inactive">Inactif</span>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => toggleStatus(seller.id_user, seller.statut)}
                      className={`btn ${seller.statut ? 'btn-outline-success' : 'btn-outline-secondary'} btn-sm`}
                    >
                      {seller.statut ? 'Désactiver' : 'Activer'}
                    </button>
                    <button
                      onClick={() => deleteSeller(seller.id_user)}
                      className="btn btn-danger btn-sm ms-2"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </>
  );
}