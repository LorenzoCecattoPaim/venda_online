"use client";
// components/CheckoutButton.tsx
import { useState } from "react";
import { useCart } from "./CartContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function CheckoutButton() {
  const { items } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!session) {
      router.push("/login?callbackUrl=/cart");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // redireciona ao Stripe Checkout
      } else {
        alert(data.error ?? "Erro ao iniciar checkout.");
      }
    } catch (err) {
      alert("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading || items.length === 0}
      style={{
        width: "100%",
        padding: "12px",
        background: loading ? "#ccc" : "#639922",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: 500,
        cursor: loading ? "not-allowed" : "pointer",
      }}
    >
      {loading ? "Redirecionando..." : "Finalizar compra"}
    </button>
  );
}
