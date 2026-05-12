
"use client";
import React, { useState } from "react";
import supabase from "../../lib/supabaseClientBrowser";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isSignup, setIsSignup] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage("Registro enviado: revisá tu correo para confirmar (si está habilitado).");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setMessage("Sesión iniciada");
        // redirect to home or to previous page
        router.push("/");
      }
    } catch (err: any) {
      setMessage(err.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl mb-4">{isSignup ? "Crear cuenta" : "Iniciar sesión"}</h1>
      <form onSubmit={handleSubmit} className="max-w-sm">
        <label className="block mb-2">Email</label>
        <input className="w-full p-2 border mb-4" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label className="block mb-2">Contraseña</label>
        <input type="password" className="w-full p-2 border mb-4" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="bg-blue-600 text-white px-4 py-2" disabled={loading}>
          {isSignup ? "Registrarme" : "Entrar"}
        </button>
      </form>
      <div className="mt-4">
        <button className="text-sm text-gray-600" onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? "Ya tengo cuenta" : "Crear una cuenta"}
        </button>
      </div>
      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  );
}
