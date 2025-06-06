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
  const [loginError, setLoginError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoading(true);

    if (!email || !password) {
      setLoginError('Veuillez remplir tous les champs');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        let errorMessage = "Erreur de connexion. Veuillez réessayer.";
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Mot de passe incorrect';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Veuillez vérifier votre email avant de vous connecter';
        } else if (error.message.includes('No account')) {
          errorMessage = "Pas de compte trouvé avec cet email";
        }
        
        setLoginError(errorMessage);
        setIsLoading(false);
        return;
      }

      if (email === 'princebergborja@gmail.com') {
        router.push('/admin/menu');
      } else {
        router.push('/boutique/menu');
      }
    } catch (err) {
      setLoginError('Une erreur inattendue est survenue');
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setResetStatus(null);
    setModalError(null);
    setIsResetLoading(true);
    
    if (!resetEmail) {
      setModalError('Veuillez entrer votre adresse email');
      setIsResetLoading(false);
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
      setModalError(error.message || 'Erreur lors de l\'envoi du lien. Vérifiez votre email.');
    } finally {
      setIsResetLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <h1 className="login-title">Content de vous revoir</h1>
            <p className="login-subtitle">Connectez-vous pour continuer</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Adresse email</label>
              <div className="input-with-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
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
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Mot de passe</label>
              <div className="input-with-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
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
            </div>

            {loginError && (
              <div className="error-message">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D32F2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>{loginError}</span>
              </div>
            )}

            <div className="form-options">
              <div className="remember-me">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Se souvenir de moi</label>
              </div>
              <div className="forgot-password">
                <Link href="#" onClick={(e) => {
                  e.preventDefault();
                  setResetEmail(email);
                  setShowResetModal(true);
                }}>
                  Mot de passe oublié ?
                </Link>
              </div>
            </div>

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? (
                <>
                  <svg className="spinner" viewBox="0 0 50 50">
                    <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                  </svg>
                  Connexion...
                </>
              ) : 'Se connecter'}
            </button>

            <div className="divider">
              <span>OU</span>
            </div>

            <div className="signup-link">
              Pas encore de compte ? <Link href="/register">S'inscrire</Link>
            </div>
          </form>
        </div>

        {/* Password Reset Modal */}
        {showResetModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button 
                className="modal-close"
                onClick={() => {
                  setShowResetModal(false);
                  setResetStatus(null);
                  setModalError(null);
                }}
              >
                &times;
              </button>
              <div className="modal-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 2H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7l-2 3v1h8v-1l-2-3h7a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"></path>
                  <line x1="12" y1="11" x2="12" y2="17"></line>
                  <line x1="12" y1="7" x2="12.01" y2="7"></line>
                </svg>
              </div>
              <h3>Réinitialiser le mot de passe</h3>
              <p>Entrez votre adresse email pour recevoir un lien de réinitialisation</p>
              
              <form onSubmit={handlePasswordReset} className="modal-form">
                <div className="form-group">
                  <div className="input-with-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="votre@email.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value.trim())}
                      required
                    />
                  </div>
                </div>
                
                {modalError && (
                  <div className="error-message">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D32F2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <span>{modalError}</span>
                  </div>
                )}
                
                {resetStatus === 'success' && (
                  <div className="success-message">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#388E3C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span>Un lien de réinitialisation a été envoyé à votre email.</span>
                  </div>
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
                    disabled={isResetLoading}
                  >
                    Annuler
                  </button>
                  <button type="submit" className="reset-button" disabled={isResetLoading}>
                    {isResetLoading ? (
                      <>
                        <svg className="spinner" viewBox="0 0 50 50">
                          <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                        </svg>
                        Envoi...
                      </>
                    ) : 'Envoyer le lien'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <Footer />
      
      <style jsx>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: calc(100vh - 120px);
          padding: 2rem 1rem;
        }

        .login-card {
          width: 100%;
          max-width: 480px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          padding: 2.5rem;
          transition: all 0.3s ease;
        }

        .login-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .login-icon {
          margin-bottom: 1rem;
        }

        .login-title {
          font-size: 1.8rem;
          font-weight: 700;
          color: #4CAF50;
          margin-bottom: 0.5rem;
        }

        .login-subtitle {
          font-size: 1rem;
          color: #666;
          margin-bottom: 0;
        }

        .login-form {
          display: flex;
          flex-direction: column;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #333;
          font-size: 0.95rem;
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-with-icon svg {
          position: absolute;
          left: 14px;
          z-index: 1;
        }

        .form-input {
          width: 100%;
          padding: 0.8rem 1rem 0.8rem 42px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background-color: #f9f9f9;
        }

        .form-input:focus {
          outline: none;
          border-color: #4CAF50;
          box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
          background-color: white;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #D32F2F;
          background-color: #fde8e8;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .success-message {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #388E3C;
          background-color: #e8f5e9;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
        }

        .remember-me {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .remember-me input {
          accent-color: #4CAF50;
        }

        .remember-me label {
          color: #555;
          cursor: pointer;
        }

        .forgot-password a {
          color: #4CAF50;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .forgot-password a:hover {
          color: #388E3C;
          text-decoration: underline;
        }

        .login-button {
          background-color: #4CAF50;
          color: white;
          padding: 0.9rem;
          font-size: 1rem;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 1.5rem;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
        }

        .login-button:hover {
          background-color: #388E3C;
          transform: translateY(-1px);
        }

        .login-button:disabled {
          background-color: #81C784;
          cursor: not-allowed;
          transform: none;
        }

        .divider {
          display: flex;
          align-items: center;
          margin-bottom: 1.5rem;
          color: #999;
          font-size: 0.9rem;
        }

        .divider::before,
        .divider::after {
          content: "";
          flex: 1;
          border-bottom: 1px solid #ddd;
        }

        .divider span {
          padding: 0 1rem;
        }

        .signup-link {
          text-align: center;
          font-size: 0.95rem;
          color: #666;
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
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(3px);
        }

        .modal-content {
          position: relative;
          background: white;
          padding: 2.5rem;
          border-radius: 12px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
          text-align: center;
          animation: modalFadeIn 0.3s ease;
        }

        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #777;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .modal-close:hover {
          color: #333;
        }

        .modal-icon {
          margin-bottom: 1.5rem;
        }

        .modal-content h3 {
          color: #4CAF50;
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }

        .modal-content p {
          margin-bottom: 2rem;
          color: #666;
          font-size: 0.95rem;
        }

        .modal-form .form-group {
          margin-bottom: 1.5rem;
        }

        .modal-buttons {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .cancel-button, .reset-button {
          flex: 1;
          padding: 0.8rem;
          font-weight: 600;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
        }

        .cancel-button {
          background-color: #f1f1f1;
          color: #555;
        }

        .cancel-button:hover {
          background-color: #e0e0e0;
        }

        .cancel-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .reset-button {
          background-color: #4CAF50;
          color: white;
        }

        .reset-button:hover {
          background-color: #388E3C;
        }

        .reset-button:disabled {
          background-color: #81C784;
          cursor: not-allowed;
        }

        /* Spinner Animation */
        .spinner {
          animation: rotate 1.5s linear infinite;
          height: 20px;
          width: 20px;
        }

        .spinner .path {
          stroke: white;
          stroke-linecap: round;
          animation: dash 1.5s ease-in-out infinite;
        }

        @keyframes rotate {
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes dash {
          0% {
            stroke-dasharray: 1, 150;
            stroke-dashoffset: 0;
          }
          50% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -35;
          }
          100% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -124;
          }
        }

        /* Responsive Adjustments */
        @media (max-width: 640px) {
          .login-card {
            padding: 2rem 1.5rem;
          }
          
          .login-title {
            font-size: 1.6rem;
          }
          
          .form-options {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          
          .modal-content {
            padding: 2rem 1.5rem;
            margin: 0 1rem;
          }
        }

        @media (max-width: 480px) {
          .login-container {
            padding: 1rem;
          }
          
          .login-card {
            padding: 1.5rem 1.25rem;
          }
          
          .modal-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
}