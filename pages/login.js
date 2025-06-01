import { useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '../lib/supabase';
import Header from '@/components/Header2';
import '../styles/login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          alert('Mot de passe incorrect');
        } else if (error.message.includes('No account')) {
          alert("Pas de compte trouvé avec cet email");
        } else {
          alert("Erreur de connexion: " + error.message);
        }
        return;
      }

      if (email === 'princebergborja@gmail.com') {
        router.push('/admin/menu');
      } else {
        router.push('/boutique/menu');
      }
    } catch (err) {
      console.error('Erreur de connexion:', err);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    if (!resetEmail) {
      setResetStatus('error');
      alert('Veuillez entrer votre adresse email');
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) {
        throw error;
      }

      setResetStatus('success');
      setTimeout(() => {
        setShowResetModal(false);
        setResetStatus(null);
      }, 3000);
    } catch (error) {
      console.error('Error sending reset email:', error);
      setResetStatus('error');
    }
  };

  return (
    <>
      <Header />
      <div className="login-container">
        <div className="mb-4" onClick={() => router.back()} style={{ cursor: 'pointer', color: ' #4CAF50' }}>
          <i className="fas fa-arrow-left"></i> Retour
        </div>
        <div className="login-header">
          <h1 className="login-title">Content de vous revoir</h1>
          <p className="login-subtitle">Connectez-vous pour continuer</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Adresse email</label>
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Mot de passe</label>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value.trim())}
              required
            />
          </div>

          <div className="forgot-password">
            <a href="/reset-password" onClick={(e) => {
              e.preventDefault();
              setResetEmail(email);
              setShowResetModal(true);
            }}>
              Mot de passe oublié ?
            </a>
          </div>

          <button type="submit" className="login-button">Se connecter</button>

          <div className="signup-link">
            Pas encore de compte ? <a href="/register">S'inscrire</a> 
          </div>
        </form>

        {/* Password Reset Modal */}
        {showResetModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Réinitialiser le mot de passe</h3>
              <p>Entrez votre adresse email pour recevoir un lien de réinitialisation</p>
              
              <form onSubmit={handlePasswordReset}>
                <input
                  type="email"
                  className="form-input"
                  placeholder="votre@email.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value.trim())}
                  required
                />
                
                {resetStatus === 'success' && (
                  <p className="text-success">Un lien de réinitialisation a été envoyé à votre email.</p>
                )}
                {resetStatus === 'error' && (
                  <p className="text-error">Une erreur est survenue. Veuillez réessayer.</p>
                )}
                
                <div className="modal-buttons">
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={() => {
                      setShowResetModal(false);
                      setResetStatus(null);
                    }}
                  >
                    Annuler
                  </button>
                  <button type="submit" className="reset-button">
                    Envoyer le lien
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}