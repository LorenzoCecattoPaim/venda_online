"use client";
// app/login/page.tsx
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "register") {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Erro ao criar conta.");
        setLoading(false);
        return;
      }
    }

    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);
    if (result?.error) {
      setError("Email ou senha incorretos.");
    } else {
      router.push(callbackUrl);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    border: "0.5px solid #ddd",
    borderRadius: 8,
    fontSize: 14,
    outline: "none",
    marginTop: 4,
  };

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f3" }}>
      <div style={{ background: "#fff", border: "0.5px solid #e8e8e8", borderRadius: 16, padding: 32, width: 380 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 20, fontWeight: 500 }}>shop<span style={{ color: "#639922" }}>verde</span></div>
          <p style={{ fontSize: 13, color: "#888", marginTop: 6 }}>
            {mode === "login" ? "Entre na sua conta" : "Crie sua conta"}
          </p>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {(["login", "register"] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(""); }}
              style={{
                flex: 1,
                padding: "8px",
                border: "0.5px solid",
                borderColor: mode === m ? "#639922" : "#ddd",
                borderRadius: 8,
                background: mode === m ? "#EAF3DE" : "transparent",
                color: mode === m ? "#3B6D11" : "#666",
                fontSize: 13,
                cursor: "pointer",
                fontWeight: mode === m ? 500 : 400,
              }}
            >
              {m === "login" ? "Entrar" : "Cadastrar"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: "#666" }}>Nome</label>
              <input
                style={inputStyle}
                placeholder="Seu nome"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
          )}

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: "#666" }}>Email</label>
            <input
              style={inputStyle}
              type="email"
              placeholder="seu@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, color: "#666" }}>Senha</label>
            <input
              style={inputStyle}
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
            />
          </div>

          {error && (
            <div style={{ background: "#FCEBEB", color: "#A32D2D", fontSize: 13, padding: "8px 12px", borderRadius: 8, marginBottom: 14 }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: 12,
              background: loading ? "#ccc" : "#639922",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: 12, color: "#999", marginTop: 20 }}>
          <Link href="/" style={{ color: "#639922" }}>← Voltar à loja</Link>
        </p>
      </div>
    </main>
  );
}
