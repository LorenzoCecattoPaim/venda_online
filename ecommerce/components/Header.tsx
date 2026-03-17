"use client";
// components/Header.tsx
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "./CartContext";

export function Header() {
  const { data: session } = useSession();
  const { count } = useCart();
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  return (
    <header style={{
      background: "#fff",
      borderBottom: "0.5px solid #e8e8e8",
      padding: "14px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      <Link href="/" style={{ fontSize: 17, fontWeight: 500, textDecoration: "none", color: "#111" }}>
        shop<span style={{ color: "#639922" }}>verde</span>
      </Link>

      <nav style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <Link href="/" style={{ fontSize: 13, color: "#666", textDecoration: "none" }}>Catálogo</Link>
        {isAdmin && (
          <Link href="/admin" style={{ fontSize: 13, color: "#666", textDecoration: "none" }}>Admin</Link>
        )}
        {session ? (
          <>
            <span style={{ fontSize: 13, color: "#888" }}>{session.user?.name ?? session.user?.email}</span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              style={{ fontSize: 13, color: "#666", background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              Sair
            </button>
          </>
        ) : (
          <Link href="/login" style={{ fontSize: 13, color: "#666", textDecoration: "none" }}>Entrar</Link>
        )}

        <Link href="/cart" style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "6px 14px",
          border: "0.5px solid #ddd",
          borderRadius: 8,
          textDecoration: "none",
          fontSize: 13,
          color: "#111",
        }}>
          🛒 Carrinho
          {count > 0 && (
            <span style={{
              background: "#639922",
              color: "#fff",
              borderRadius: 999,
              fontSize: 10,
              fontWeight: 500,
              padding: "1px 6px",
              minWidth: 18,
              textAlign: "center",
            }}>
              {count}
            </span>
          )}
        </Link>
      </nav>
    </header>
  );
}
