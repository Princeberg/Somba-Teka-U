import { useState } from 'react';
import supabase from '../lib/supabase';
import Head from 'next/head';

export default function ResetRequest() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setMessage({ type: 'danger', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Un lien de réinitialisation a été envoyé à votre adresse e-mail.' });
    }
  };

  return (
    <>
      <Head><title>Réinitialiser le mot de passe</title></Head>
      <div className="auth-container">
        <h2>Réinitialisation de mot de passe</h2>
        <p>Entrez votre e-mail pour recevoir un lien de réinitialisation.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="email">Adresse e-mail</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="email@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Envoyer le lien</button>
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
          margin-bottom: 10px;
        }

        p {
          text-align: center;
          color: #555;
        }
      `}</style>
    </>
  );
}
