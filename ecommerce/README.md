# ShopVerde — E-commerce Next.js + Stripe + Auth

## Stack

- **Next.js 14** (App Router)
- **Prisma** + PostgreSQL
- **NextAuth** (JWT, Credentials)
- **Stripe Checkout** (pagamento seguro)
- **TypeScript**, **Zod**

---

## Estrutura

```
├── app/
│   ├── page.tsx                  # Catálogo de produtos
│   ├── cart/page.tsx             # Carrinho
│   ├── login/page.tsx            # Login e cadastro
│   ├── checkout/success/page.tsx # Confirmação pós-Stripe
│   ├── admin/page.tsx            # Painel admin (protegido)
│   └── api/
│       ├── auth/[...nextauth]/   # NextAuth handler
│       ├── auth/register/        # Cadastro de usuário
│       ├── products/             # CRUD de produtos
│       ├── checkout/             # Cria Stripe Checkout Session
│       ├── webhook/              # Webhook do Stripe (marca pedido como pago)
│       └── admin/orders/         # Pedidos para o painel admin
├── components/
│   ├── CartContext.tsx           # Estado global do carrinho (localStorage)
│   ├── CheckoutButton.tsx        # Botão que chama /api/checkout
│   ├── Header.tsx                # Cabeçalho com contador de carrinho
│   └── ProductCard.tsx           # Card de produto com "Adicionar"
├── lib/
│   ├── prisma.ts                 # Singleton PrismaClient
│   ├── stripe.ts                 # Instância Stripe
│   └── auth.ts                   # Configuração NextAuth
├── prisma/
│   ├── schema.prisma             # Modelos: User, Product, Order, OrderItem
│   └── seed.ts                   # Dados iniciais (admin + produtos)
└── types/index.ts                # CartItem, Cart
```

---

## Setup

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Preencha `.env`:

| Variável | Onde obter |
|---|---|
| `DATABASE_URL` | PostgreSQL local ou [Supabase](https://supabase.com) |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
| `STRIPE_SECRET_KEY` | [dashboard.stripe.com](https://dashboard.stripe.com) → Developers → API keys |
| `STRIPE_PUBLISHABLE_KEY` | Mesmo lugar |
| `STRIPE_WEBHOOK_SECRET` | Próximo passo |

### 3. Banco de dados

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

Isso cria as tabelas e insere produtos + usuário admin:
- **Email:** admin@shopverde.com
- **Senha:** admin123

### 4. Webhook do Stripe (desenvolvimento)

```bash
# Instale o Stripe CLI
stripe login
stripe listen --forward-to localhost:3000/api/webhook
```

Copie o `whsec_...` exibido e coloque em `STRIPE_WEBHOOK_SECRET`.

Em produção, configure o webhook no [Stripe Dashboard](https://dashboard.stripe.com/webhooks):
- URL: `https://seudominio.com/api/webhook`
- Eventos: `checkout.session.completed`, `payment_intent.payment_failed`

### 5. Rodar

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

---

## Fluxo de pagamento

```
Usuário → /cart → CheckoutButton
  → POST /api/checkout
    → Stripe cria Session
  → redirect para Stripe Checkout (stripe.com)
  → Usuário paga
  → Stripe chama POST /api/webhook
    → Pedido marcado como PAID no banco
    → Estoque decrementado
  → Stripe redireciona para /checkout/success
```

---

## Adicionar Mercado Pago (opcional)

Instale o SDK:
```bash
npm install mercadopago
```

Crie `lib/mercadopago.ts`:
```ts
import { MercadoPagoConfig, Preference } from "mercadopago";

export const mp = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});
```

No `/api/checkout`, substitua a chamada Stripe por `new Preference(mp).create({ items, ... })` e redirecione para `preference.init_point`.

---

## Deploy (Vercel)

```bash
vercel deploy
```

Configure as variáveis de ambiente no painel da Vercel e adicione o webhook de produção no Stripe Dashboard.
