import { useState, useEffect } from 'react';
import supabase from '../lib/supabase';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Supabase initialise la session automatiquement après clic sur lien
    (async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (!session || error) {
        setMessage({ type: 'danger', text: "Session invalide. Veuillez réessayer via le lien de l'e-mail." });
      }
    })();
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'danger', text: 'Les mots de passe ne correspondent pas.' });
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setMessage({ type: 'danger', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Mot de passe mis à jour avec succès ! Redirection...' });
      setTimeout(() => router.push('/login'), 2000);
    }
  };

  return (
    <>
      <Head><title>Nouveau mot de passe</title></Head>
      <div className="auth-container">
        <h2>Définir un nouveau mot de passe</h2>
        <form onSubmit={handleReset}>
          <div className="form-group mb-3">
            <label htmlFor="newPassword">Nouveau mot de passe</label>
            <input
              type="password"
              className="form-control"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100">Mettre à jour</button>
        </form>
        {message && (
          <div className={`alert alert-${message.type} mt-3`} role="alert">
            {message.text}
          </div>
        )}
      </div>

      <style jsx>{`
        .auth-container {
          max-width: 400px;
          margin: 80px auto;
          padding: 30px;
          border: 1px solid #ddd;
          border-radius: 12px;
          background-color: #fff;
        }

        h2 {
          text-align: center;
          margin-bottom: 20px;
        }
      `}</style>
    </>
  );
}
