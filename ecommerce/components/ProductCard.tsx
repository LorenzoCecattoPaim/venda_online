"use client";
// components/ProductCard.tsx
import { useCart } from "./CartContext";
import { useState } from "react";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  stock: number;
};

export function ProductCard({ product }: { product: Product }) {
  const { add, items } = useCart();
  const [added, setAdded] = useState(false);
  const inCart = items.some((i) => i.id === product.id);

  const handleAdd = () => {
    add({ id: product.id, name: product.name, price: product.price, quantity: 1, imageUrl: product.imageUrl ?? undefined });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div style={{
      background: "#fff",
      border: "0.5px solid #e8e8e8",
      borderRadius: 12,
      overflow: "hidden",
      transition: "border-color 0.15s",
    }}>
      <div style={{
        width: "100%", height: 160,
        background: "#f5f5f3",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 13, color: "#aaa",
      }}>
        {product.imageUrl
          ? <img src={product.imageUrl} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : "Sem imagem"
        }
      </div>
      <div style={{ padding: 14 }}>
        <p style={{ fontWeight: 500, fontSize: 14, marginBottom: 4 }}>{product.name}</p>
        <p style={{ fontSize: 12, color: "#888", marginBottom: 10, lineHeight: 1.4 }}>{product.description}</p>
        <p style={{ fontWeight: 500, fontSize: 16, marginBottom: 12 }}>
          R$ {product.price.toFixed(2)}
        </p>
        <button
          onClick={handleAdd}
          disabled={product.stock === 0}
          style={{
            width: "100%",
            padding: "8px",
            border: "0.5px solid",
            borderColor: inCart || added ? "#639922" : "#ddd",
            borderRadius: 8,
            background: inCart || added ? "#EAF3DE" : "transparent",
            color: inCart || added ? "#3B6D11" : "#111",
            fontSize: 13,
            cursor: product.stock === 0 ? "not-allowed" : "pointer",
            transition: "all 0.15s",
          }}
        >
          {product.stock === 0 ? "Sem estoque" : added ? "✓ Adicionado" : inCart ? "✓ No carrinho" : "+ Adicionar"}
        </button>
      </div>
    </div>
  );
}
