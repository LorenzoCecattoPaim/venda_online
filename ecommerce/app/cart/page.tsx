"use client";
// app/cart/page.tsx
import { useCart } from "@/components/CartContext";
import { CheckoutButton } from "@/components/CheckoutButton";
import Link from "next/link";

export default function CartPage() {
  const { items, remove, updateQty, total } = useCart();

  if (items.length === 0) {
    return (
      <main style={{ maxWidth: 500, margin: "80px auto", padding: "0 24px", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🛒</div>
        <h1 style={{ fontSize: 18, fontWeight: 500, marginBottom: 8 }}>Carrinho vazio</h1>
        <p style={{ color: "#888", fontSize: 14, marginBottom: 24 }}>Adicione produtos para continuar.</p>
        <Link href="/" style={{ color: "#639922", fontSize: 14 }}>← Ver produtos</Link>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px" }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, marginBottom: 24 }}>Seu carrinho</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24 }}>
        <div>
          {items.map((item) => (
            <div key={item.id} style={{
              display: "flex", alignItems: "center", gap: 16,
              padding: "16px 0", borderBottom: "0.5px solid #f0f0f0",
            }}>
              {item.imageUrl && (
                <img src={item.imageUrl} alt={item.name} style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8 }} />
              )}
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 500, fontSize: 14 }}>{item.name}</p>
                <p style={{ fontSize: 13, color: "#888", marginTop: 2 }}>R$ {item.price.toFixed(2)}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button onClick={() => updateQty(item.id, item.quantity - 1)}
                  style={{ width: 28, height: 28, border: "0.5px solid #ddd", borderRadius: 6, background: "transparent", cursor: "pointer", fontSize: 16 }}>
                  −
                </button>
                <span style={{ fontSize: 14, fontWeight: 500, minWidth: 20, textAlign: "center" }}>{item.quantity}</span>
                <button onClick={() => updateQty(item.id, item.quantity + 1)}
                  style={{ width: 28, height: 28, border: "0.5px solid #ddd", borderRadius: 6, background: "transparent", cursor: "pointer", fontSize: 16 }}>
                  +
                </button>
              </div>
              <p style={{ fontWeight: 500, fontSize: 14, minWidth: 80, textAlign: "right" }}>
                R$ {(item.price * item.quantity).toFixed(2)}
              </p>
              <button onClick={() => remove(item.id)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#ccc", fontSize: 18, padding: "0 4px" }}>
                ×
              </button>
            </div>
          ))}
        </div>

        <div>
          <div style={{ background: "#f9f9f7", borderRadius: 12, padding: 20, position: "sticky", top: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 500, marginBottom: 16 }}>Resumo</h2>
            {items.map((item) => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#666", marginBottom: 6 }}>
                <span>{item.name} × {item.quantity}</span>
                <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div style={{ borderTop: "0.5px solid #e8e8e8", marginTop: 12, paddingTop: 12, display: "flex", justifyContent: "space-between", fontWeight: 500 }}>
              <span>Total</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
            <div style={{ marginTop: 16 }}>
              <CheckoutButton />
            </div>
            <p style={{ fontSize: 11, color: "#aaa", textAlign: "center", marginTop: 10 }}>
              Pagamento seguro via Stripe
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
