// app/layout.tsx
import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/components/CartContext";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const metadata = { title: "ShopVerde" };

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="pt-BR">
      <body>
        <SessionProvider session={session}>
          <CartProvider>
            {children}
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
