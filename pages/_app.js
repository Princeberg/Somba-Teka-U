import '@/styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Script from 'next/script';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-4ENBFLJM23"
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
      >
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-4ENBFLJM23');
        `}
      </Script>

      <Component {...pageProps} />
    </>
  );
}
