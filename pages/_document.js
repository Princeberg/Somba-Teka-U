import { Html, Head, Main, NextScript } from 'next/document';
export default function Document() {
  return (
    <Html lang="fr">
      <Head>

        {/* Global favicon */}
        <link rel="icon" href="/favicon.jpg" />
       
        {/* Font Awesome */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-papN4fwwk3B5rC+QZZ4Gy8T+zH5fAvy0svVv3t4ZgYo4ZJmG2S1ylE23o8c9wF3xzblLkX8T+y0lm2vILXXAfA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />

        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Playfair+Display:wght@400;500;700&display=swap"
          rel="stylesheet"
        />

        {/* Swiper CSS */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/swiper@8/swiper-bundle.min.css"
        />

        <link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
/>
 <link
          href="https://fonts.googleapis.com/css2?family=Cardo:wght@400;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
         <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cardo&family=Inter:wght@300;400;600&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
       
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
