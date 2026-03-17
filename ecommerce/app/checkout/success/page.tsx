// app/checkout/success/page.tsx
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const sessionId = searchParams.session_id;
  if (!sessionId) return <p>Sessão inválida.</p>;

  const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);
  const order = await prisma.order.findFirst({
    where: { stripeSessionId: sessionId },
    include: { items: { include: { product: true } } },
  });

  return (
    <main style={{ maxWidth: 500, margin: "80px auto", padding: "0 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
        <h1 style={{ fontSize: 22, fontWeight: 500 }}>Pedido confirmado!</h1>
        <p style={{ color: "#666", marginTop: 8 }}>
          Obrigado pela compra. Você receberá um e-mail em breve.
        </p>
      </div>

      {order && (
        <div style={{ border: "0.5px solid #ddd", borderRadius: 12, padding: 20 }}>
          <p style={{ fontSize: 12, color: "#888", marginBottom: 12 }}>
            Pedido #{order.id.slice(-8).toUpperCase()}
          </p>
          {order.items.map((item) => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 14 }}>
              <span>{item.product.name} × {item.quantity}</span>
              <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div style={{ borderTop: "0.5px solid #eee", marginTop: 12, paddingTop: 12, display: "flex", justifyContent: "space-between", fontWeight: 500 }}>
            <span>Total</span>
            <span>R$ {order.total.toFixed(2)}</span>
          </div>
        </div>
      )}

      <Link href="/" style={{ display: "block", textAlign: "center", marginTop: 24, color: "#639922" }}>
        Continuar comprando
      </Link>
    </main>
  );
}
