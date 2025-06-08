import { useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '../lib/supabase';
import Header from '@/components/Header2';

export default function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const router = useRouter();

  const getPasswordStrength = (pwd) => {
    if (!pwd) return '';
    if (pwd.length < 6) return 'Faible';
    if (pwd.match(/[A-Z]/) && pwd.match(/[0-9]/) && pwd.length >= 8) return 'Fort';
    return 'Moyen';
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage({ text: 'Les mots de passe ne correspondent pas', type: 'error' });
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      setMessage({ text: 'Mot de passe mis à jour avec succès!', type: 'success' });
      setTimeout(() => router.push('/login'), 2000);
    } catch (error) {
      setMessage({ text: `Erreur: ${error.message}`, type: 'error' });
      console.error('Error updating password:', error);
    }
  };

  // Close modal function
  const closeModal = () => setMessage({ text: '', type: '' });

  return (
    <>
      <Header />
      <div className="container">
        <div className="form-wrapper">
          <h1 className="title">Mettre à jour votre mot de passe</h1>
          <p className="subtitle">Entrez votre nouveau mot de passe</p>

          {/* You can still keep inline messages if you want, or remove this */}
          {/* {message.text && (
            <div className={message.type === 'success' ? 'text-success' : 'text-error'}>
              {message.text}
            </div>
          )} */}

          <form onSubmit={handleUpdatePassword} className="form">
            <div className="form-group">
              <label htmlFor="password" className="form-label">Nouveau mot de passe</label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {password && (
                <small
                  className={`password-strength ${
                    getPasswordStrength(password) === 'Fort'
                      ? 'strong'
                      : getPasswordStrength(password) === 'Moyen'
                      ? 'medium'
                      : 'weak'
                  }`}
                >
                  Force du mot de passe : {getPasswordStrength(password)}
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirmer le mot de passe</label>
              <div className="input-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  className="form-input"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="toggle-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" className="submit-btn">Mettre à jour</button>
          </form>
        </div>
      </div>

      {/* Modal */}
      {message.text && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal} aria-label="Fermer la fenêtre">
              &times;
            </button>
            <p className={message.type === 'success' ? 'modal-success' : 'modal-error'}>
              {message.text}
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        .container {
          min-height: 80vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 1rem;
        }
        .form-wrapper {
          background: white;
          padding: 2rem 2.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          max-width: 400px;
          width: 100%;
          box-sizing: border-box;
        }
        .title {
          margin-bottom: 0.25rem;
          font-size: 1.8rem;
          font-weight: 600;
          color: #222;
          text-align: center;
        }
        .subtitle {
          margin-bottom: 1.5rem;
          font-size: 1rem;
          color: #555;
          text-align: center;
        }
        .form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
        }
        .form-label {
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #333;
        }
        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .form-input {
          width: 100%;
          padding: 0.6rem 1rem;
          padding-right: 3rem;
          font-size: 1rem;
          border: 1.5px solid #ccc;
          border-radius: 5px;
          transition: border-color 0.3s ease;
        }
        .form-input:focus {
          border-color: #0070f3;
          outline: none;
        }
        .toggle-btn {
          position: absolute;
          right: 10px;
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 1.2rem;
          user-select: none;
          padding: 0;
          line-height: 1;
          color: #555;
        }
        .password-strength {
          margin-top: 0.25rem;
          font-weight: 600;
          font-size: 0.85rem;
          user-select: none;
        }
        .strong {
          color: green;
        }
        .medium {
          color: orange;
        }
        .weak {
          color: red;
        }
        .submit-btn {
          padding: 0.75rem;
          font-size: 1.1rem;
          font-weight: 600;
          color: white;
          background-color: #0070f3;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .submit-btn:hover {
          background-color: #005bb5;
        }

        /* Modal styles */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }
        .modal {
          background: white;
          padding: 1.5rem 2rem;
          border-radius: 10px;
          max-width: 350px;
          width: 90%;
          box-shadow: 0 4px 20px rgba(0,0,0,0.25);
          position: relative;
          text-align: center;
        }
        .close-btn {
          position: absolute;
          top: 10px;
          right: 12px;
          background: transparent;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #666;
          font-weight: bold;
        }
        .modal-error {
          color: #e00;
          font-weight: 600;
          font-size: 1rem;
        }
        .modal-success {
          color: #090;
          font-weight: 600;
          font-size: 1rem;
        }

        /* Responsive */
        @media (max-width: 480px) {
          .form-wrapper {
            padding: 1.5rem 1.5rem;
            max-width: 100%;
          }
          .title {
            font-size: 1.5rem;
          }
          .submit-btn {
            font-size: 1rem;
          }
          .modal {
            padding: 1rem 1.25rem;
          }
        }
      `}</style>
    </>
  );
}
