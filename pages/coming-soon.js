import { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '@/components/Header2';

export default function ComingSoon() {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const launchDate = new Date(2026, 1, 1).getTime();

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate - now;

      setDays(Math.floor(distance / (1000 * 60 * 60 * 24)));
      setHours(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
      setMinutes(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
      setSeconds(Math.floor((distance % (1000 * 60)) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the email to your backend
    console.log('Email submitted:', email);
    setSubscribed(true);
    setEmail('');
  };

  return (
    <>
      <Head>
        <title>Bientôt Disponible</title>
      </Head>
      <Header />

      <div className="coming-soon-container">
        <div className="content">
          <div className="logo">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>  </span>
          </div>

          <h1> Coming Soon </h1>
          <p className="subtitle"> Un espace où vous pouvez créer et gérer votre boutique en ligne comme un pro. </p>
          <div className="countdown">
            {/* <div className="countdown-item">
              <span className="number">{days}</span>
              <span className="label">Jours restants </span>
            </div> */}
          </div>

         

          <div className="social-links">
            <a href="#" aria-label="Facebook">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href="#" aria-label="Instagram">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="2"/>
                <path d="M16 11.37C16.1234 12.2022 15.9813 13.0522 15.5938 13.799C15.2063 14.5458 14.5931 15.1514 13.8416 15.5297C13.0901 15.9079 12.2384 16.0396 11.4078 15.9059C10.5772 15.7723 9.80976 15.3801 9.21484 14.7852C8.61992 14.1902 8.22773 13.4228 8.09406 12.5922C7.9604 11.7616 8.09206 10.9099 8.47032 10.1584C8.84858 9.40685 9.45418 8.79374 10.201 8.40624C10.9478 8.01874 11.7978 7.87658 12.63 8C13.4789 8.12588 14.2649 8.52146 14.8717 9.1283C15.4785 9.73515 15.8741 10.5211 16 11.37Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17.5 6.5H17.51" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>

          </div>
        </div>

        <div className="animated-background">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>

      <style jsx>{`
        :root {
          --primary: #6c5ce7;
          --primary-light: #a29bfe;
          --secondary: #00cec9;
          --text: #2d3436;
          --text-light: #636e72;
          --background: #f9f9f9;
          --white: #ffffff;
          --shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
           .dark {
          --primary-bg: rgba(15, 15, 25, 0.95);
          --secondary-bg:rgba(15, 15, 25, 0.95);
          --text-color: #f0f0f0;
          --text-muted: #a0a0a0;
          --accent-color: #5cb85c;
          --border-color: rgba(255, 255, 255, 0.1);
          --card-bg:rgba(0, 0, 0, 0.1);
          --container-bg: rgba(0, 0, 0, 0.1);
          --hover-bg: rgba(255, 255, 255, 0.05);
          --shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
          --coming-soon-container: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .coming-soon-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--background);
          position: relative;
          overflow: hidden;
          padding: 2rem;
        }

        .content {
          text-align: center;
          max-width: 600px;
          z-index: 2;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          padding: 3rem;
          border-radius: 20px;
          box-shadow: var(--shadow);
        }

        .logo {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 2rem;
          color: var(--primary);
          font-weight: 700;
          font-size: 1.5rem;
        }

        .logo svg {
          margin-right: 0.5rem;
        }

        h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: var(--text);
          font-weight: 800;
        }

        .subtitle {
          font-size: 1.1rem;
          color: var(--text-light);
          margin-bottom: 2.5rem;
          line-height: 1.6;
        }

        .countdown {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 2.5rem 0;
          gap: 0.5rem;
        }

        .countdown-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: var(--white);
          padding: 1rem 1.5rem;
          border-radius: 12px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        }

        .countdown-separator {
          font-size: 1.5rem;
          font-weight: bold;
          color: var(--primary);
          padding: 0 0.5rem;
        }

        .number {
          font-size: 2rem;
          font-weight: 700;
          color: var(--primary);
        }

        .label {
          font-size: 0.8rem;
          color: var(--text-light);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-top: 0.3rem;
        }

        .newsletter-form {
          display: flex;
          max-width: 450px;
          margin: 0 auto 2rem;
          border-radius: 50px;
          overflow: hidden;
          box-shadow: 0 5px 20px rgba(108, 92, 231, 0.2);
        }

        .newsletter-form input {
          flex: 1;
          padding: 1rem 1.5rem;
          border: none;
          outline: none;
          font-size: 1rem;
        }

        .newsletter-form button {
          background: var(--primary);
          color: white;
          border: none;
          padding: 0 2rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .newsletter-form button:hover {
          background: var(--primary-light);
        }

        .success-message {
          background: var(--secondary);
          color: white;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 2rem;
          font-weight: 500;
        }

        .social-links {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .social-links a {
          color: var(--text-light);
          transition: all 0.3s ease;
        }

        .social-links a:hover {
          color: var(--primary);
          transform: translateY(-3px);
        }

        .animated-background {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          z-index: 1;
        }

        .shape {
          position: absolute;
          border-radius: 50%;
          opacity: 0.1;
          animation: float 15s infinite ease-in-out;
        }

        .shape-1 {
          width: 300px;
          height: 300px;
          background: var(--primary);
          top: -50px;
          left: -50px;
          animation-delay: 0s;
        }

        .shape-2 {
          width: 200px;
          height: 200px;
          background: var(--secondary);
          bottom: -30px;
          right: 20%;
          animation-delay: 2s;
        }

        .shape-3 {
          width: 150px;
          height: 150px;
          background: var(--primary-light);
          top: 30%;
          right: -30px;
          animation-delay: 4s;
        }

        .shape-4 {
          width: 100px;
          height: 100px;
          background: var(--secondary);
          bottom: 20%;
          left: 10%;
          animation-delay: 6s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @media (max-width: 768px) {
          .content {
            padding: 2rem 1.5rem;
          }

          h1 {
            font-size: 2rem;
          }

          .countdown {
            gap: 0.3rem;
          }

          .countdown-item {
            padding: 0.8rem 1rem;
          }

          .number {
            font-size: 1.5rem;
          }

          .newsletter-form {
            flex-direction: column;
            border-radius: 12px;
          }

          .newsletter-form input,
          .newsletter-form button {
            width: 100%;
            padding: 1rem;
            text-align: center;
          }
        }
      `}</style>
    </>
  );
}