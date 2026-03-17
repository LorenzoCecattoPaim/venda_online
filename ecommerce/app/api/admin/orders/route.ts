// app/api/admin/orders/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  const orders = await prisma.order.findMany({
    include: {
      user: { select: { name: true, email: true } },
      items: { include: { product: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const stats = {
    totalOrders: orders.length,
    revenue: orders
      .filter((o) => o.status === "PAID")
      .reduce((acc, o) => acc + o.total, 0),
    pending: orders.filter((o) => o.status === "PENDING").length,
  };

  return NextResponse.json({ orders, stats });
}
