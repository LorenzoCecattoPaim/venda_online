// app/page.tsx
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { Header } from "@/components/Header";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Header />
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
        <h1 style={{ fontSize: 20, fontWeight: 500, marginBottom: 24 }}>Produtos</h1>
        {products.length === 0 ? (
          <p style={{ color: "#888", fontSize: 14 }}>Nenhum produto cadastrado ainda.</p>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 16,
          }}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
