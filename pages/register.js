import { useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '../lib/supabase';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/register.css';

export default function RegisterSeller() {
  const [formData, setFormData] = useState({
    shopName: '',
    sellerName: '',
    WhatsApp: '',
    ville: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const router = useRouter();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const {
      shopName,
      sellerName,
      WhatsApp,
      ville,
      email,
      password,
      confirmPassword,
    } = formData;

   
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Les mots de passe ne correspondent pas." });
      return;
    }

    try {
    
      const { data: existingSellers, error: checkError } = await supabase
        .from('sellers')
        .select('email')
        .eq('email', email);

      if (checkError) throw checkError;

      if (existingSellers.length > 0) {
        alert("Un compte avec cet e-mail existe déjà.");
        return;
      }

      // Crée l'utilisateur avec Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      const userId = authData?.user?.id;

      if (!userId) {
        alert("Veuillez confirmer votre adresse email pour finaliser l'inscription.");
        return;
      }

      const { error: profileError } = await supabase
  .from('sellers')
  .insert([{
    id_user: userId,
    email,
    shop_name: shopName,
    statut: 0,
    WhatsappURL: `https://wa.me/${WhatsApp.replace(/\s+/g, '')}`,
    SellerName: sellerName,
    Ville: ville,
    created_at: new Date().toISOString(),
  }]);

      if (profileError) throw profileError;

      alert("Inscription réussie ! Veuillez vérifier votre email.");
      router.push('/login');

    } catch (error) {
      console.error('Erreur lors de l’inscription :', error);
      alert(`Erreur : ${error.message || "Une erreur est survenue."}`);
    }
  };

  return (
    
    <div className="register-container container py-5">
      <div className="mb-4" onClick={() => router.back()} style={{ cursor: 'pointer', color: 'var(--accent-color)' }}>
        <i className="fas fa-arrow-left"></i> Retour
      </div>

      <div className="register-header text-center mb-4">
        <h1 className="register-title">Créer votre boutique</h1>
        <p className="register-subtitle">Remplissez les informations pour commencer</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="shopName" className="form-label">Nom de la boutique</label>
            <input type="text" id="shopName" className="form-control" value={formData.shopName} onChange={handleChange} placeholder="Veuillez saisir le nom de votre Boutique" required />
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="sellerName" className="form-label">Nom du vendeur</label>
            <input type="text" id="sellerName" className="form-control" value={formData.sellerName} onChange={handleChange} placeholder=" Veuillez saisir votre Nom "  required />
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="WhatsApp" className="form-label">Contact WhatsApp</label>
            <div className="input-group">
              <span className="input-group-text"><i className="fab fa-whatsapp"></i></span>
              <input type="text" id="WhatsApp" className="form-control" value={formData.WhatsApp} onChange={handleChange} placeholder="+242061234568" required />
            </div>
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="ville" className="form-label">Ville</label>
            <select id="ville" className="form-control" value={formData.ville} onChange={handleChange} required>
              <option value="">Sélectionner votre ville de résidence </option>
              <option value="Brazzaville">Brazzaville</option>
              <option value="Pointe-Noire">Pointe-Noire</option>
              <option value="Dolisie">Dolisie</option>
              <option value="Ouesso">Ouesso</option>
              <option value="Madingou">Madingou</option>
              <option value="Oyo">Oyo</option>
              <option value="Ewo">Ewo</option>
              <option value="Nkayi">Nkayi</option>
              <option value="Autre">Autre</option>
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="email" className="form-label">Adresse électronique</label>
            <input type="email" id="email" className="form-control" value={formData.email} onChange={handleChange} placeholder="email@gmail.com" required />
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="password" className="form-label">Mot de passe</label>
            <input type="password" id="password" className="form-control" value={formData.password} onChange={handleChange}  placeholder="Veuillez saisir un mot de passe" required minLength={6} />
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirmer le mot de passe</label>
            <input type="password" id="confirmPassword" className="form-control" value={formData.confirmPassword} onChange={handleChange}  placeholder="Veuillez confirmer votre mot de passe" required minLength={6} />
            {errors.confirmPassword && <div className="text-danger">{errors.confirmPassword}</div>}
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-100">S'inscrire</button>

        <div className="text-center mt-3">
          Déjà un compte ? <a href="/login">Se connecter</a>
        </div>
      </form>
    </div>
  );
}
