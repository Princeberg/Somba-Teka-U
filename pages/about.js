import Head from 'next/head';
import Header from "@/components/Header2";
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '@/styles/about.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function About() {
  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: true });
  }, []);

  return (
    <>
      <Head>
        <title>À Propos - Somba-Teka | Plateforme e-commerce Congo-Brazzaville</title>
        <meta name="description" content="Plateforme professionnelle de mise en relation entre vendeurs et acheteurs au Congo-Brazzaville. Découvrez notre mission et notre équipe." />
        <meta name="keywords" content="e-commerce Congo, plateforme vente en ligne, marketplace Brazzaville, acheteurs vendeurs Congo" />
        <link rel="shortcut icon" href="/favicon.jpg" />
      </Head>
      <Header />

      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 mx-auto">
              <h2 className="section-title" style={{color: '#4CAF50'}}>Notre Histoire</h2>
              <p className="lead">Fondée en 2025 par Magic & Tech, Somba-Teka est née de la volonté de digitaliser et faciliter les échanges commerciaux au Congo-Brazzaville.</p>
              <p>Somba-Teka compte s&apos;imposer comme la plateforme de référence pour connecter les professionnels et particuliers souhaitant acheter ou vendre des produits et services.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mission-vision py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-6 mb-4 mb-md-0">
              <div className="about-card">
                <div className="icon-box" style={{background: '#4CAF50'}}>
                  <i className="fas fa-bullseye" style={{color: 'white'}} ></i>
                </div>
                <h3>Notre Mission</h3>
                <p>Faciliter les transactions commerciales en ligne en offrant une plateforme sécurisée, intuitive et accessible.</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="about-card">
                <div className="icon-box" style={{background: '#4CAF50'}}>
                  <i className="fas fa-eye" style={{color: 'white'}} ></i>
                </div>
                <h3>Notre Vision</h3>
                <p>Devenir le hub numérique incontournable pour le commerce en Afrique Centrale.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <h2 className="section-title" style={{color: '#4CAF50'}}>Nos Valeurs</h2>
              <ul className="values-list">
                <li><strong>Intégrité :</strong> Nous maintenons les plus hauts standards éthiques.</li>
                <li><strong>Innovation :</strong> Nous repoussons constamment les limites.</li>
                <li><strong>Accessibilité :</strong> Notre plateforme est conçue pour tous.</li>
                <li><strong>Service client :</strong> Nos utilisateurs sont au cœur de nos décisions.</li>
                <li><strong>Impact local :</strong> Le commerce numérique transforme l’économie.</li>
              </ul>
            </div>
            <div className="col-lg-6">
              <img
                src="https://images.unsplash.com/photo-1680878903102-92692799ef36?q=80&w=2069&auto=format&fit=crop"
                alt="Équipe Teka"
                className="img-fluid rounded shadow"
                width={600}
                height={400}
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <h2 className="section-title" style={{color: '#4CAF50'}}>Notre Équipe</h2>
              <p className="lead mb-5">Une équipe passionnée combinant expertise technologique et connaissance locale.</p>
            </div>
          </div>
          <div className="row">
            {[
              {
                name: "Prince Moussaki",
                role: "Fondateur & CEO de Magic & Tech",
                desc: "Ingénieur en technologie de l'information et Graphic Designer",
              },
              {
                name: "Sarah Nkounkou",
                role: "Responsable Marketing",
                desc: "Spécialiste en stratégie digitale et développement de marque.",
              },
              {
                name: "David Mboungou",
                role: "Responsable Technique",
                desc: "Ingénieur logiciel avec expertise en plateformes digitales.",
              }
            ].map((member, i) => (
              <div key={i} className="col-md-4 mb-4">
                <div className="about-card text-center">
                  <img
                    src="/images/profile-1.jpg"
                    alt={`Membre ${member.name}`}
                    width={120}
                    height={120}
                    className="rounded-circle mb-3"
                  />
                  <h4>{member.name} </h4>
                  <p style={{color: '#4CAF50'}}>{member.role}</p>
                  <p>{member.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <h2 className="section-title" >Contactez-nous</h2>
              <p className="lead mb-5">Nous sommes à votre disposition pour toute question ou partenariat.</p>
            </div>
          </div>
          <div className="row justify-content-center"  >
            <div className="col-lg-6">
              <div className="contact-info" style={{background: '#4CAF50'}}>
                <div className="contact-item">
                  <div className="contact-icon" style={{background: 'white'}}><i className="fas fa-envelope" style={{color: '#4CAF50'}}></i></div>
                  <div>
                    <h5 style={{color: 'white'}}>Email</h5>
                    <p><a href="mailto:${process.env.NEXT_PUBLIC_EMAIL}" className="btn btn-light">Envoyer un message</a></p>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon" style={{background: 'white'}}><i className="fab fa-whatsapp" style={{color: '#4CAF50'}} ></i></div>
                  <div>
                    <h5 style={{color: 'white'}} >WhatsApp</h5>
                    <p><a href="https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER} " className="btn btn-light">Envoyer un message</a></p>
                  </div>
                </div>
                {/* <div className="text-center mt-4">
                  <a href="https://t.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}" className="btn btn-primary">Envoyer un message</a>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
