'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    sessionStorage.removeItem('authenticated');

    // Redirection après 2 secondes
    const timeout = setTimeout(() => {
      router.push('/');
    }, 2000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <h1 className="text-3xl font-bold mb-4 text-blue-600 dark:text-blue-400">
        Vous êtes maintenant déconnecté.
      </h1>
      <p className="text-gray-600 dark:text-gray-300">
        Redirection vers l&apos;accueil en cours...
      </p>
    </div>
  );
}
