// app/admin/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") redirect("/");

  const orders = await prisma.order.findMany({
    include: {
      user: { select: { name: true, email: true } },
      items: true,
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const revenue = orders
    .filter((o) => o.status === "PAID")
    .reduce((acc, o) => acc + o.total, 0);

  const statusColor: Record<string, string> = {
    PAID: "#EAF3DE",
    PENDING: "#FAEEDA",
    CANCELLED: "#FCEBEB",
    SHIPPED: "#E6F1FB",
  };
  const statusLabel: Record<string, string> = {
    PAID: "Pago",
    PENDING: "Pendente",
    CANCELLED: "Cancelado",
    SHIPPED: "Enviado",
  };

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, marginBottom: 24 }}>Painel Admin</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 32 }}>
        {[
          { label: "Total de pedidos", value: orders.length },
          { label: "Receita (pagos)", value: `R$ ${revenue.toFixed(2)}` },
          { label: "Pendentes", value: orders.filter((o) => o.status === "PENDING").length },
        ].map((stat) => (
          <div key={stat.label} style={{ background: "#f5f5f3", borderRadius: 8, padding: "14px 16px" }}>
            <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>{stat.label}</div>
            <div style={{ fontSize: 22, fontWeight: 500 }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "0.5px solid #eee" }}>
            {["ID", "Cliente", "Total", "Método", "Status", "Data"].map((h) => (
              <th key={h} style={{ padding: "8px 12px", fontWeight: 500, color: "#666" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} style={{ borderBottom: "0.5px solid #f0f0f0" }}>
              <td style={{ padding: "10px 12px", fontFamily: "monospace", fontSize: 11, color: "#888" }}>
                #{order.id.slice(-8).toUpperCase()}
              </td>
              <td style={{ padding: "10px 12px" }}>{order.user.name ?? order.user.email}</td>
              <td style={{ padding: "10px 12px", fontWeight: 500 }}>R$ {order.total.toFixed(2)}</td>
              <td style={{ padding: "10px 12px", color: "#666" }}>{order.paymentMethod}</td>
              <td style={{ padding: "10px 12px" }}>
                <span style={{
                  background: statusColor[order.status] ?? "#eee",
                  borderRadius: 999,
                  padding: "3px 10px",
                  fontSize: 11,
                  fontWeight: 500,
                }}>
                  {statusLabel[order.status] ?? order.status}
                </span>
              </td>
              <td style={{ padding: "10px 12px", color: "#888", fontSize: 11 }}>
                {new Date(order.createdAt).toLocaleDateString("pt-BR")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
