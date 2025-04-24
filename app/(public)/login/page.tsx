"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [login, setLogin] = useState("");
  const [haslo, setHaslo] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, haslo }),
    });

    if (!res.ok) {
      setError("Nieprawidłowy login lub hasło");
      return;
    }

    const { token, refreshToken } = await res.json();
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
    router.push("/");
  };

  return (
    <form onSubmit={handleLogin} className="max-w-sm mx-auto mt-10 p-4 border rounded">
      <input
        type="text"
        placeholder="Login"
        value={login}
        onChange={(e) => setLogin(e.target.value)}
        className="w-full p-2 border mb-2"
        required
      />
      <input
        type="password"
        placeholder="Hasło"
        value={haslo}
        onChange={(e) => setHaslo(e.target.value)}
        className="w-full p-2 border mb-2"
        required
      />
      <button type="submit" className="w-full bg-blue-500 text-white py-2">Zaloguj</button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
}
