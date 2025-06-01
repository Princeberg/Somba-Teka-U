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
        .select('*')
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
                <th>Nom du vendeur</th>
                <th>Téléphone</th>
                <th>Whatsapp</th>
                 <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((seller) => (
                <tr key={seller.id_user}>
                  <td>{seller.SellerName}</td>
                   <td>
  <a href={`tel:${seller.SellerPhone}`} target="_blank" rel="noopener noreferrer">
    {seller.SellerPhone}
  </a>
</td>

<td>
  <a href={seller.WhatsappURL} target="_blank" rel="noopener noreferrer">
    Laisser un méssage
  </a>
</td>

<td>
  <a href={`mailto:${seller.email}`} target="_blank" rel="noopener noreferrer">
    {seller.email}
  </a>
</td>
              
                  <td>
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