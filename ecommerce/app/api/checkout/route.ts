// app/api/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const cartItemSchema = z.object({
  id: z.string(),
  quantity: z.number().int().positive(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Faça login para continuar." }, { status: 401 });
  }

  const { items } = await req.json() as { items: z.infer<typeof cartItemSchema>[] };

  // Busca produtos reais do banco para garantir preços corretos
  const productIds = items.map((i) => i.id);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, active: true },
  });

  if (products.length !== items.length) {
    return NextResponse.json({ error: "Produto inválido." }, { status: 400 });
  }

  // Monta line_items do Stripe
  const lineItems = items.map((cartItem) => {
    const product = products.find((p) => p.id === cartItem.id)!;
    return {
      price_data: {
        currency: "brl",
        product_data: {
          name: product.name,
          description: product.description,
          ...(product.imageUrl && { images: [product.imageUrl] }),
        },
        unit_amount: Math.round(product.price * 100), // centavos
      },
      quantity: cartItem.quantity,
    };
  });

  // Cria pedido com status PENDING
  const total = products.reduce((acc, p) => {
    const item = items.find((i) => i.id === p.id)!;
    return acc + p.price * item.quantity;
  }, 0);

  const order = await prisma.order.create({
    data: {
      userId: (session.user as any).id,
      total,
      status: "PENDING",
      paymentMethod: "stripe",
      items: {
        create: items.map((cartItem) => {
          const product = products.find((p) => p.id === cartItem.id)!;
          return {
            productId: product.id,
            quantity: cartItem.quantity,
            price: product.price,
          };
        }),
      },
    },
  });

  // Cria Stripe Checkout Session
  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${process.env.NEXTAUTH_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/cart`,
    metadata: {
      orderId: order.id,
      userId: (session.user as any).id,
    },
    // Para Pix (somente BRL):
    // payment_method_types: ["card", "pix"],
  });

  // Salva o ID da sessão Stripe no pedido
  await prisma.order.update({
    where: { id: order.id },
    data: { stripeSessionId: checkoutSession.id },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
