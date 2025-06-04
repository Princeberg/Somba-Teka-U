import { useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '../lib/supabase';
import Link from 'next/link';

export default function RegisterSeller() {
  const [formData, setFormData] = useState({
    sellerName: '',
    WhatsApp: '',
    SellerPhone: '',
    BirthDate: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState(null); // 'success' or 'error' or null (closed)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleCloseModal = () => setModalType(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const {
      sellerName,
      WhatsApp,
      SellerPhone,
      BirthDate,
      email,
      password,
      confirmPassword,
    } = formData;

    // Basic validation
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Les mots de passe ne correspondent pas." });
      setIsSubmitting(false);
      return;
    }

    try {
      // Check if seller already exists
      const { data: existingSellers, error: checkError } = await supabase
        .from('sellers')
        .select('email')
        .eq('email', email);

      if (checkError) {
        throw new Error("Erreur lors de la vérification de l'existence du vendeur");
      }

      if (existingSellers.length > 0) {
        setModalMessage("Un compte avec cet e-mail existe déjà.");
        setModalType('error');
        setIsSubmitting(false);
        return;
      }

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        throw new Error(authError.message || "Erreur lors de la création du compte");
      }

      const userId = authData?.user?.id;

      if (!userId) {
        setModalMessage("Veuillez confirmer votre adresse email pour finaliser l'inscription.");
        setModalType('success');
        setIsSubmitting(false);
        return;
      }

      // Create seller profile
      const { error: profileError } = await supabase
        .from('sellers')
        .insert([{
          id_user: userId,
          email,
          WhatsappURL: `https://wa.me/${WhatsApp.replace(/\s+/g, '')}`,
          sellerName,
          BirthDate,
          sellerContact: SellerPhone,
          created_at: new Date().toISOString(),
        }]);

      if (profileError) {
        // Attempt to delete the auth user if profile creation fails
        await supabase.auth.admin.deleteUser(userId);
        throw new Error(profileError.message || "Erreur lors de la création du profil vendeur");
      }

      setModalMessage("Inscription réussie ! Veuillez vérifier votre email.");
      setModalType('success');

      setTimeout(() => router.push('/login'), 3000);

    } catch (error) {
      setModalMessage(error.message || "Une erreur inattendue est survenue lors de l'inscription");
      setModalType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container container py-5">
      <div className="register-header text-center mb-4">
        <h1 className="register-title">Créer votre compte de vendeur</h1>
        <p className="register-subtitle">Remplissez les informations pour commencer</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="sellerName" className="form-label">Nom du vendeur</label>
            <input type="text" id="sellerName" className="form-control" value={formData.sellerName} onChange={handleChange} required />
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="SellerPhone" className="form-label">Numéro de téléphone</label>
            <div className="input-group">
              <span className="input-group-text"><i className="fas fa-phone"></i></span>
              <input type="text" id="SellerPhone" className="form-control" value={formData.SellerPhone} onChange={handleChange} required />
            </div>
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="WhatsApp" className="form-label">Contact WhatsApp</label>
            <div className="input-group">
              <span className="input-group-text"><i className="fab fa-whatsapp"></i></span>
              <input type="text" id="WhatsApp" className="form-control" value={formData.WhatsApp} onChange={handleChange} required />
            </div>
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="email" className="form-label">Adresse électronique</label>
            <input type="email" id="email" className="form-control" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="BirthDate" className="form-label">Date de naissance</label>
            <input type="date" id="BirthDate" className="form-control" value={formData.BirthDate} onChange={handleChange} required />
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="password" className="form-label">Mot de passe</label>
            <input type="password" id="password" className="form-control" value={formData.password} onChange={handleChange} required minLength={6} />
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirmer le mot de passe</label>
            <input type="password" id="confirmPassword" className="form-control" value={formData.confirmPassword} onChange={handleChange} required minLength={6} />
            {errors.confirmPassword && <div className="text-danger">{errors.confirmPassword}</div>}
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
          {isSubmitting ? 'Traitement...' : 'Créer maintenant'}
        </button>

        <div className="text-center mt-3">
          Déjà un compte ? <Link href="/login">Se connecter</Link>
        </div>
      </form>

      {/* Modal */}
      {modalType && (
        <div className="modal-backdrop" onClick={handleCloseModal} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 1050,
        }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{
            backgroundColor: 'white', padding: '20px', borderRadius: '8px',
            maxWidth: '400px', width: '90%',
            border: modalType === 'success' ? '2px solid green' : '2px solid red',
          }}>
            <h5 style={{ color: modalType === 'success' ? 'green' : 'red', marginBottom: '15px' }}>
              {modalType === 'success' ? 'Succès' : 'Erreur'}
            </h5>
            <p>{modalMessage}</p>
            <div className="d-flex justify-content-end">
              <button 
                className="btn btn-secondary mt-3" 
                onClick={handleCloseModal}
                style={{
                  backgroundColor: modalType === 'success' ? 'green' : 'red',
                  color: 'white',
                  border: 'none'
                }}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}