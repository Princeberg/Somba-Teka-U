import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';

const TermsOfUse = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Conditions d'Utilisation | SOMBA TEKA</title>
        <meta name="description" content="Conditions d'utilisation de la plateforme SOMBA TEKA" />
        <meta name="keywords" content="conditions d'utilisation, SOMBA TEKA, e-commerce, Congo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="/favicon.jpg" />
      </Head>

      <div className="min-h-screen flex flex-col">
        {/* Header */}
        
        <button onClick={() => router.back()} className="back-button">
              <i className="fas fa-arrow-left"></i> Retour
            </button>

        {/* Main Content */}
        <main className="flex-grow container mx-auto px-4 md:px-6 py-8 max-w-4xl">
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            <div className="prose prose-blue max-w-none">
              <section className="mb-8">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">1. Introduction</h2>
                <p className="text-gray-700">
                  Ces conditions d'utilisation régissent l'utilisation de la plateforme SOMBA TEKA. 
                  En utilisant nos services, vous acceptez d'être lié par ces conditions.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">2. Définitions</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>Plateforme</strong> : SOMBA TEKA et tous ses services associés</li>
                  <li><strong>Utilisateur</strong> : Toute personne utilisant la plateforme</li>
                  <li><strong>Vendeur</strong> : Utilisateur souhaitant vendre des produits</li>
                  <li><strong>Produit</strong> : Article ou service proposé sur la plateforme</li>
                  <li><strong>Booster</strong> : Option payante pour mettre un produit en avant</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">3. Utilisation de la Plateforme</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Vous devez avoir au moins 18 ans pour utiliser la plateforme</li>
                  <li>Vous devez fournir des informations exactes et à jour</li>
                  <li>Vous êtes responsable de la sécurité de vos informations de connexion</li>
                  <li>Vous devez utiliser la plateforme conformément aux lois en vigueur</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">4. Publication des Produits</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Les produits doivent être décrits de manière exacte et honnête</li>
                  <li>Les images doivent être réelles et représentatives du produit</li>
                  <li>Les prix doivent être clairs et en Francs CFA</li>
                  <li>Les catégories doivent être appropriées au produit</li>
                  <li className="flex items-start">
                    <span className="inline-flex items-center text-yellow-500 mr-2">★</span>
                    <span>
                      <strong>Option Booster</strong> : Les vendeurs peuvent payer pour mettre leurs produits en avant 
                      pendant une période déterminée. Les produits boostés apparaissent 
                      en tête des résultats de recherche et dans des emplacements privilégiés.
                    </span>
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">5. Responsabilités</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>SOMBA TEKA n'est pas responsable des transactions entre utilisateurs</li>
                  <li>Les vendeurs sont responsables de leurs produits et descriptions</li>
                  <li>Les utilisateurs sont responsables de leurs actions sur la plateforme</li>
                  <li>SOMBA TEKA se réserve le droit de modifier ou supprimer tout contenu inapproprié</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">6. Propriété Intellectuelle</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Tous les contenus de la plateforme sont protégés par le droit d'auteur</li>
                  <li>Les marques "SOMBA TEKA" sont la propriété exclusive de la société</li>
                  <li>Les utilisateurs conservent les droits sur leurs contenus publiés</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">7. Confidentialité</h2>
                <p className="text-gray-700">
                  SOMBA TEKA respecte la confidentialité des données personnelles et se conforme aux normes de protection des données.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">8. Modifications</h2>
                <p className="text-gray-700">
                  Ces conditions d'utilisation peuvent être modifiées à tout moment. Il est de votre responsabilité de les consulter régulièrement.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">9. Droit Applicable</h2>
                <p className="text-gray-700">
                  Ces conditions sont régies et interprétées conformément aux lois de la République du Congo.
                </p>
              </section>

              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">10. Contact</h2>
                <p className="text-gray-700">
                  Pour toute question ou préoccupation concernant ces conditions, veuillez nous contacter.
                </p>
              </section>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 py-4 mt-8">
          <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} SOMBA TEKA. Tous droits réservés.
          </div>
        </footer>
      </div>
    </>
  );
};

export default TermsOfUse;