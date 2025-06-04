import '@/styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // ✅ CSS uniquement, pas de JS

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}