import { useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '../lib/supabase';
import Header from '@/components/Header2';
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState(null);
  const [modalError, setModalError] = useState(null);
  const [loginError, setLoginError] = useState(null); // New state for login form errors
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(null); // Reset error state

    if (!email || !password) {
      setLoginError('Veuillez remplir tous les champs');
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setLoginError('Mot de passe incorrect');
        } else if (error.message.includes('Email not confirmed')) {
          setLoginError('Veuillez vérifier votre email avant de vous connecter');
        } else if (error.message.includes('No account')) {
          setLoginError("Pas de compte trouvé avec cet email");
        } else {
          setLoginError("Erreur de connexion. Veuillez réessayer.");
        }
        return;
      }

      if (email === 'princebergborja@gmail.com') {
        router.push('/admin/menu');
      } else {
        router.push('/boutique/menu');
      }
    } catch (err) {
      setLoginError('Une erreur inattendue est survenue');
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setResetStatus(null);
    setModalError(null);
    
    if (!resetEmail) {
      setModalError('Veuillez entrer votre adresse email');
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
      setModalError('Erreur lors de l\'envoi du lien. Vérifiez votre email.');
    }
  };

  return (
    <>
      <Header />
      <div className="login-container">
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

          {/* Display login errors */}
          {loginError && (
            <div className="error-message">
              {loginError}
            </div>
          )}

          <div className="forgot-password">
            <Link href="/reset-password" onClick={(e) => {
              e.preventDefault();
              setResetEmail(email);
              setShowResetModal(true);
            }}>
              Mot de passe oublié ?
            </Link>
          </div>

          <button type="submit" className="login-button">Se connecter</button>

          <div className="signup-link">
            Pas encore de compte ? <Link href="/register">S&apos;inscrire</Link> 
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
                
                {/* Display modal errors */}
                {modalError && (
                  <div className="error-message">
                    {modalError}
                  </div>
                )}
                
                {resetStatus === 'success' && (
                  <p className="text-success">Un lien de réinitialisation a été envoyé à votre email.</p>
                )}
                
                <div className="modal-buttons">
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={() => {
                      setShowResetModal(false);
                      setResetStatus(null);
                      setModalError(null);
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
      <Footer/>
      <style jsx>{`
        .login-container {
          max-width: 420px;
          margin: 3rem auto 6rem;
          padding: 2rem;
          background: white;
          border-radius: 8px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.1);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .login-title {
          font-size: 2rem;
          font-weight: 700;
          color: #4CAF50;
          margin-bottom: 0.3rem;
        }
        .login-subtitle {
          font-size: 1rem;
          color: #555;
        }

        form.login-form {
          display: flex;
          flex-direction: column;
        }

        .form-group {
          margin-bottom: 1.3rem;
        }
        label.form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #333;
        }
        input.form-input {
          width: 100%;
          padding: 0.65rem 1rem;
          border: 2px solid #ddd;
          border-radius: 6px;
          font-size: 1rem;
          transition: border-color 0.3s ease;
        }
        input.form-input:focus {
          outline: none;
          border-color: #4CAF50;
          box-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
        }

        .error-message {
          color: #D32F2F;
          background-color: #fde8e8;
          padding: 0.75rem 1rem;
          border-radius: 6px;
          margin-bottom: 1rem;
          font-weight: 500;
          text-align: center;
        }

        .forgot-password {
          text-align: right;
          margin-bottom: 1.8rem;
        }
        .forgot-password a {
          color: #4CAF50;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .forgot-password a:hover {
          color: #388E3C;
          text-decoration: underline;
        }

        button.login-button {
          background-color: #4CAF50;
          color: white;
          padding: 0.75rem 0;
          font-size: 1.15rem;
          font-weight: 700;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s ease;
          margin-bottom: 1.5rem;
        }
        button.login-button:hover {
          background-color: #388E3C;
        }

        .signup-link {
          text-align: center;
          font-size: 0.95rem;
          color: #555;
        }
        .signup-link a {
          color: #4CAF50;
          font-weight: 600;
          text-decoration: none;
        }
        .signup-link a:hover {
          text-decoration: underline;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right:0;
          bottom: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }
        .modal-content {
          background: white;
          padding: 2rem 2.5rem;
          border-radius: 12px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          text-align: center;
        }
        .modal-content h3 {
          color: #4CAF50;
          margin-bottom: 1rem;
        }
        .modal-content p {
          margin-bottom: 1.5rem;
          color: #333;
        }
        .modal-content input.form-input {
          margin-bottom: 1rem;
        }

        .text-success {
          color: #388E3C;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .modal-buttons {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
        }
        .cancel-button, .reset-button {
          flex: 1;
          padding: 0.65rem 0;
          font-weight: 600;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.3s ease;
        }
        .cancel-button {
          background-color: #ccc;
          color: #444;
        }
        .cancel-button:hover {
          background-color: #b3b3b3;
        }
        .reset-button {
          background-color: #4CAF50;
          color: white;
        }
        .reset-button:hover {
          background-color: #388E3C;
        }

        /* Responsive */
        @media (max-width: 480px) {
          .login-container {
            margin: 2rem 1rem 4rem;
            padding: 1.5rem;
          }
          button.login-button {
            font-size: 1rem;
          }
        }
      `}</style>
    </>
  );
}