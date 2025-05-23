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
    //console.log("in login page",res.status)
    if (!res.ok) {
      setError('Google login failed');
      return;
    }

    const { token, refreshToken } = await res.json();
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    //router.push('/');
    window.location.reload()
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
    //router.push('/');\
    window.location.reload()
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Zaloguj się</h2>
      <form onSubmit={handleLogin} className="border rounded p-6 space-y-4">
        <input
          type="text"
          placeholder="Login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
          className="border p-2 w-full mb-2 rounded"
        />
        <input
          type="password"
          placeholder="Hasło"
          value={haslo}
          onChange={(e) => setHaslo(e.target.value)}
          required
          className="border p-2 w-full mb-2 rounded"
        />
        <button
          aria-label="zalogujzwykle"
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Zaloguj
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>

      <div className="mt-6 text-center" id="google-button" />
    </div>
  );
}