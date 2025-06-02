'use client'; 

import React from 'react';
import Head from 'next/head';
import Link from "next/link";

const TermsPage = () => {
  React.useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  return (
    <>
      <Head>
        <title>Conditions d&apos;Utilisation | SOMBA TEKA</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="SOMBA TEKA" />
        <meta name="description" content="Conditions d'utilisation de la plateforme SOMBA TEKA" />
        <meta name="keywords" content="conditions d'utilisation, SOMBA TEKA, e-commerce, Congo" />
        <link rel="shortcut icon" href="/favicon.jpg" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cardo:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <style jsx>{`
        :root {
          --secondary-color: #2c3e50;
          --accent-color: #e74c3c;
          --light-color: #f8f9fa;
          --dark-color: #343a40;
          --border-radius: 8px;
          --box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          --transition: all 0.3s ease;
        }

        body {
          font-family: 'Inter', sans-serif;
          background-color: #f5f7fa;
          color: #333;
          line-height: 1.6;
        }

        .container {
          max-width: 800px;
          margin: 40px auto;
          padding: 0 15px;
        }

        .content-container {
          background-color: white;
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
          padding: 30px;
          margin-bottom: 30px;
        }

        h1 {
          font-family: 'Cardo', serif;
          color: var(--secondary-color);
          margin-bottom: 25px;
          font-weight: 700;
          text-align: center;
          position: relative;
          padding-bottom: 15px;
        }

        h1::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 3px;
          background-color: var(--accent-color);
        }

        h2 {
          font-family: 'Cardo', serif;
          color: var(--secondary-color);
          margin-bottom: 20px;
          font-weight: 600; 
        }
      a
      {
          text-decoration: none; 
          }

        .terms-content h3 {
          font-family: 'Cardo', serif;
          color: var(--secondary-color);
          margin-bottom: 15px;
          font-weight: 600;
        }

        ul {
          margin-left: 20px;
        }

        li {
          margin-bottom: 10px;
          line-height: 1.5;
        }

        a {
          color: var(--accent-color);
        }

        @media (max-width: 768px) {
          .container {
            margin: 20px auto;
          }

          .content-container {
            padding: 20px;
          }

          h1 {
            font-size: 24px;
          }
        }

        @media (max-width: 576px) {
          .container {
            margin: 15px auto;
          }

          .content-container {
            padding: 15px;
          }
        }
      `}</style>

      <header className="header py-3 bg-dark text-white">
        <div className="container d-flex justify-content-between align-items-center">
          <div>
            <i className="fas fa-file-text me-2"></i> Conditions d&apos;Utilisation
          </div>
        </div>
      </header>

      <main className="container">
        <div className="content-container">
          <h1>Conditions d&apos;Utilisation</h1>

          <div className="terms-content">
            <h2>1. Introduction</h2>
            <p>Ces conditions d&apos;utilisation régissent l&apos;utilisation de la plateforme SOMBA TEKA...</p>

            <h2>2. Définitions</h2>
            <ul>
              <li>Plateforme : SOMBA TEKA et tous ses services associés</li>
              <li>Utilisateur : Toute personne utilisant la plateforme</li>
              <li>Vendeur : Utilisateur souhaitant vendre des produits</li>
              <li>Produit : Article ou service proposé sur la plateforme</li>
            </ul>

            <h2>3. Utilisation de la Plateforme</h2>
            <ul>
              <li>Vous devez avoir au moins 18 ans pour utiliser la plateforme</li>
              <li>Vous devez fournir des informations exactes et à jour</li>
              <li>Vous êtes responsable de la sécurité de vos informations de connexion</li>
              <li>Vous devez utiliser la plateforme conformément aux lois en vigueur</li>
            </ul>

            <h2>4. Publication des Produits</h2>
            <ul>
              <li>Les produits doivent être décrits de manière exacte et honnête</li>
              <li>Les images doivent être réelles et représentatives du produit</li>
              <li>Les prix doivent être clairs et en Francs CFA</li>
              <li>Les catégories doivent être appropriées au produit</li>
            </ul>

            <h2>5. Responsabilités</h2>
            <ul>
              <li>SOMBA TEKA n&apos;est pas responsable des transactions entre utilisateurs</li>
              <li>Les vendeurs sont responsables de leurs produits et descriptions</li>
              <li>Les utilisateurs sont responsables de leurs actions sur la plateforme</li>
              <li>SOMBA TEKA se réserve le droit de modifier ou supprimer tout contenu inapproprié</li>
            </ul>

            <h2>6. Propriété Intellectuelle</h2>
            <ul>
              <li>Tous les contenus de la plateforme sont protégés par le droit d&apos;auteur</li>
              <li>Les marques SOMBA TEKA sont la propriété exclusive de la société</li>
              <li>Les utilisateurs conservent les droits sur leurs contenus publiés</li>
            </ul>

            <h2>7. Confidentialité</h2>
            <p>SOMBA TEKA respecte la confidentialité des données personnelles et se conforme aux normes de protection des données.</p>

            <h2>8. Modifications</h2>
            <p>Ces conditions peuvent être modifiées à tout moment. Il est de votre responsabilité de les consulter régulièrement.</p>

            <h2>9. Droit Applicable</h2>
            <p>Ces conditions sont régies par les lois de la République du Congo.</p>

            <h2>10. Contact</h2>
<p>
  <Link href={`mailto:${process.env.NEXT_PUBLIC_EMAIL}`} target="_blank" rel="noopener noreferrer">
    <i className="fas fa-envelope me-2"></i> Email
  </Link>
</p>
<p>
  <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
    <i className="fab fa-whatsapp me-2"></i> WhatsApp
  </a>
</p>

          </div>
        </div>
      </main>
    </>
  );
};

export default TermsPage;
