// app/api/webhook/route.ts
// Configure no Stripe Dashboard: Developers > Webhooks > Add endpoint
// URL: https://seudominio.com/api/webhook
// Eventos: checkout.session.completed, payment_intent.payment_failed

import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature inválida:", err.message);
    return NextResponse.json({ error: "Webhook inválido." }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;

      if (orderId) {
        await prisma.order.update({
          where: { id: orderId },
          data: { status: "PAID" },
        });

        // Opcional: decrementar estoque
        const order = await prisma.order.findUnique({
          where: { id: orderId },
          include: { items: true },
        });
        for (const item of order?.items ?? []) {
          await prisma.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }
      break;
    }

    case "payment_intent.payment_failed": {
      const pi = event.data.object as Stripe.PaymentIntent;
      console.warn("Pagamento falhou:", pi.id);
      // Notifique o usuário por email se necessário
      break;
    }
  }

  return NextResponse.json({ received: true });
}

// Stripe precisa do body raw, sem parsing do Next.js
export const config = { api: { bodyParser: false } };
