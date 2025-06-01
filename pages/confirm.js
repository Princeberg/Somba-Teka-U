import Head from 'next/head';
import Link from 'next/link';

export default function Confirmation() {
  return (
    <>
      <Head>
        <title>Confirmation de demande | Somba-Teka</title>
        <meta name="description" content="Confirmation de votre demande d'ajout de produit" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </Head>

      <div className="confirmation-container">
        <div className="confirmation-icon">
          <i className="fas fa-check-circle" style={{color: '#4CAF50' }}></i>
        </div>
        <h1>Demande d&apos;ajout de produit envoyée</h1>

        <div className="whatsapp-info">
          <i className="fab fa-whatsapp" style={{ color: '#25D366' }}></i>
          <strong> Confirmation par WhatsApp</strong>
          <p className="mb-0">
            Vous recevrez une confirmation d&apos;ajout de votre produit sur votre numéro WhatsApp
            dans les plus brefs délais.
          </p>
        </div>

         <p>Notre équipe traitera votre demande rapidement.</p>

       
        <Link href="/" className="btn btn-success btn-lg">
          <i className="fas fa-arrow-left me-2"></i>
          Retour à l&apos;accueil
        </Link>
      </div>

      <style jsx>{`
        :root {
          --primary-color: #2c3e50;
          --secondary-color: #4CAF50;
          --light-color: #f8f9fa;
          --dark-color: #343a40;
        }

        body {
          background-color: var(--light-color);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          min-height: 100vh;
          display: flex;
          align-items: center;
        }

        .confirmation-container {
          max-width: 600px;
          margin: 3rem auto;
          padding: 2.5rem;
          background: white;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .confirmation-icon {
          font-size: 4rem;
          color: var(--secondary-color);
          margin-bottom: 1.5rem;
        }

        h1 {
          color: var(--primary-color);
          font-weight: 700;
          margin-bottom: 1.5rem;
          font-size: 2rem;
        }

        p {
          color: var(--dark-color);
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .btn-primary {
          background-color: var(--secondary-color);
          border-color: var(--secondary-color);
          padding: 0.6rem 1.5rem;
          font-weight: 500;
          transition: all 0.3s;
        }

        .btn-primary:hover {
          background-color: #c0392b;
          border-color: #c0392b;
          transform: translateY(-2px);
        }

        .whatsapp-info {
          background-color: #f1f8fe;
          border-left: 4px solid #25d366;
          padding: 1rem;
          margin: 2rem 0;
          text-align: left;
        }

        @media (max-width: 576px) {
          .confirmation-container {
            padding: 1.5rem;
            margin: 1rem;
          }

          h1 {
            font-size: 1.5rem;
          }

          .confirmation-icon {
            font-size: 3rem;
          }
        }
      `}</style>
    </>
  );
}
