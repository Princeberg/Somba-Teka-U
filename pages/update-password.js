import { useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '../lib/supabase';
import Header from '@/components/Header2';
import '../styles/login.css';

export default function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const router = useRouter();

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage({ text: 'Les mots de passe ne correspondent pas', type: 'error' });
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      setMessage({ text: 'Mot de passe mis à jour avec succès!', type: 'success' });
      setTimeout(() => router.push('/login'), 2000);
    } catch (error) {
      setMessage({ text: `Erreur: ${error.message}`, type: 'error' });
      console.error('Error updating password:', error);
    }
  };

  return (
    <>
      <Header />
      <div className="login-container">
        <div className="login-header">
          <h1 className="login-title">Mettre à jour votre mot de passe</h1>
          <p className="login-subtitle">Entrez votre nouveau mot de passe</p>
        </div>

        {message.text && (
          <div className={message.type === 'success' ? 'text-success' : 'text-error'}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="login-form">
          <div className="form-group">
            <label htmlFor="password" className="form-label">Nouveau mot de passe</label>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirmer le mot de passe</label>
            <input
              type="password"
              id="confirmPassword"
              className="form-input"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-button">Mettre à jour</button>
        </form>
      </div>
    </>
  );
}