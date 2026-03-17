// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Admin user
  const hashed = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@shopverde.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@shopverde.com",
      password: hashed,
      role: "ADMIN",
    },
  });

  // Produtos de exemplo
  const produtos = [
    { name: "Camiseta Premium", description: "Algodão 100%, confortável e durável.", price: 79.90, stock: 50 },
    { name: "Tênis Urbano",     description: "Solado antiderrapante, ideal para o dia a dia.", price: 249.00, stock: 20 },
    { name: "Mochila Pro",      description: "30 litros, impermeável, com saída USB.", price: 189.90, stock: 15 },
    { name: "Óculos Solar",     description: "Proteção UV400, lente polarizada.", price: 129.00, stock: 30 },
    { name: "Boné Clássico",    description: "Aba curva, tamanho ajustável.", price: 59.90, stock: 100 },
    { name: "Relógio Casual",   description: "Analógico, resistente à água.", price: 199.00, stock: 25 },
  ];

  for (const p of produtos) {
    await prisma.product.create({ data: p });
  }

  console.log("✓ Seed concluído.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
