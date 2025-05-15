'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [login, setLogin] = useState('');
  const [haslo, setHaslo] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined' || !window.google) return;

    window.google.accounts.id.initialize({
      client_id: '558046348358-3bps0omr4ov6nvrsfphj7lsq25c5rvc6.apps.googleusercontent.com',
      callback: handleGoogleLogin,
    });

    window.google.accounts.id.renderButton(
      document.getElementById('google-button')!,
      { theme: 'outline', size: 'large' }
    );
  }, []);

  const handleGoogleLogin = async (response: any) => {
    const res = await fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential: response.credential }),
    });
    
    if (!res.ok) {
      setError('Google login failed');
      return;
    }

    const { token, refreshToken } = await res.json();
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    router.push('/');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, haslo }),
    });

    if (!res.ok) {
      setError('Nieprawidłowy login lub hasło');
      return;
    }

    const { token, refreshToken } = await res.json();
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Zaloguj się</h2>

        <input
          type="text"
          placeholder="Login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-3"
          required
        />
        <input
          type="password"
          placeholder="Hasło"
          value={haslo}
          onChange={(e) => setHaslo(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-3"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Zaloguj
        </button>

        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
      </form>

      <div className="mt-6" id="google-button"></div>
    </div>
  );
}
