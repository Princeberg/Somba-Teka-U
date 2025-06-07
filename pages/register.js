import { useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '../lib/supabase';
import Header from '@/components/Header2';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

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
  const [modalType, setModalType] = useState(null);
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

    const { sellerName, WhatsApp, SellerPhone, BirthDate, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Les mots de passe ne correspondent pas." });
      setIsSubmitting(false);
      return;
    }

    try {
      const { data: existingSellers, error: checkError } = await supabase
        .from('sellers')
        .select('email')
        .eq('email', email);

      if (checkError) throw new Error("Erreur lors de la vérification de l'existence du vendeur");

      if (existingSellers.length > 0) {
        setModalMessage("Un compte avec cet e-mail existe déjà.");
        setModalType('error');
        setIsSubmitting(false);
        return;
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
      if (authError) throw new Error(authError.message || "Erreur lors de la création du compte");

      const userId = authData?.user?.id;
      if (!userId) {
        setModalMessage("Veuillez confirmer votre adresse email pour finaliser l'inscription.");
        setModalType('success');
        setIsSubmitting(false);
        return;
      }

      const { error: profileError } = await supabase
        .from('sellers')
        .insert([{
          id_user: userId,
          email,
          WhatsappURL: `https://wa.me/${WhatsApp}`,
          sellerName,
          BirthDate,
          sellerContact: SellerPhone,
          created_at: new Date().toISOString(),
        }]);

      if (profileError) {
        await supabase.auth.admin.deleteUser(userId);
        throw new Error(profileError.message || "Erreur lors de la création du profil vendeur");
      }

      setModalMessage("Inscription réussie ! Veuillez vérifier votre email.");
      setModalType('success');
      setTimeout(() => router.push('/login'), 3000);

    } catch (error) {
      setModalMessage(error.message || "Une erreur inattendue est survenue");
      setModalType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <Header/>
    <div className="container py-5 px-3">
      <div className="mb-4 d-flex align-items-center">
        <button
          className="btn btn-outline-secondary me-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="me-1" size={18} />
          Retour
        </button>
        <h2 className="mb-0">Créer un compte vendeur</h2>
      </div>

      <div className="card shadow-sm p-4">
        <form onSubmit={handleSubmit}>
  <div className="row">
    <div className="col-md-6 mb-3">
      <label htmlFor="sellerName" className="form-label">Nom du vendeur</label>
      <input type="text" id="sellerName" className="form-control" value={formData.sellerName} onChange={handleChange} placeholder='Entrez le nom du vendeur' required />
    </div>

    <div className="col-md-6 mb-3">
      <label htmlFor="SellerPhone" className="form-label">Téléphone</label>
      <div className="input-group">
        <span className="input-group-text"><i className="fas fa-phone"></i></span>
        <input type="tel" id="SellerPhone" className="form-control" value={formData.SellerPhone} onChange={handleChange} placeholder='Entrez votre numéro de téléphone' required />
      </div>
    </div>

    <div className="col-md-6 mb-3">
      <label htmlFor="WhatsApp" className="form-label">Contact WhatsApp</label>
      <div className="input-group">
        <span className="input-group-text"><i className="fab fa-whatsapp"></i></span>
        <input type="tel" id="WhatsApp" className="form-control" value={formData.WhatsApp} onChange={handleChange} placeholder='Numéro WhatsApp (ex: +33612345678)' required />
      </div>
    </div>

    <div className="col-md-6 mb-3">
      <label htmlFor="email" className="form-label">Email</label>
      <input type="email" id="email" className="form-control" value={formData.email} onChange={handleChange} placeholder='Votre adresse e-mail' required />
    </div>

    <div className="col-md-6 mb-3">
      <label htmlFor="BirthDate" className="form-label">Date de naissance</label>
      <input type="date" id="BirthDate" className="form-control" value={formData.BirthDate} onChange={handleChange} required placeholder='Sélectionnez votre date de naissance' />
    </div>

    <div className="col-md-6 mb-3">
      <label htmlFor="password" className="form-label">Mot de passe</label>
      <input type="password" id="password" className="form-control" value={formData.password} onChange={handleChange} required minLength={6} placeholder='Au moins 6 caractères' />
    </div>

    <div className="col-md-6 mb-3">
      <label htmlFor="confirmPassword" className="form-label">Confirmer le mot de passe</label>
      <input type="password" id="confirmPassword" className="form-control" value={formData.confirmPassword} onChange={handleChange} required minLength={6} placeholder='Répétez le mot de passe' />
      {errors.confirmPassword && <small className="text-danger">{errors.confirmPassword}</small>}
    </div>
  </div>

  <button type="submit" className="btn btn-danger w-70" disabled={isSubmitting}>
    {isSubmitting ? 'Traitement...' : 'Créer maintenant'}
  </button>

  <div className="text-center mt-3">
    <span>Déjà un compte ? </span>
    <Link href="/login" className="text-decoration-underline">Se connecter</Link>
  </div>
</form>

      </div>

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
              <button className="btn btn-sm" onClick={handleCloseModal}
                style={{
                  backgroundColor: modalType === 'success' ? 'green' : 'red',
                  color: 'white'
                }}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
