import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";

const adapter = new PrismaMariaDb({
  host: process.env.MYSQL_HOST || "localhost",
  port: Number(process.env.MYSQL_PORT) || 3306,
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "fastfood_delivery",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash("123456", 10);

  // Admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@comeja.com" },
    update: {},
    create: {
      email: "admin@comeja.com",
      passwordHash,
      role: "ADMIN",
    },
  });

  // Restaurantes
  const burgerUser = await prisma.user.upsert({
    where: { email: "burger@comeja.com" },
    update: {},
    create: {
      email: "burger@comeja.com",
      passwordHash,
      role: "RESTAURANTE",
      restaurante: {
        create: {
          nome: "Burger King",
          horarioInicio: "10:00",
          horarioFim: "23:00",
          lat: -23.5505,
          lng: -46.6333,
        },
      },
    },
  });

  const pizzaUser = await prisma.user.upsert({
    where: { email: "pizza@comeja.com" },
    update: {},
    create: {
      email: "pizza@comeja.com",
      passwordHash,
      role: "RESTAURANTE",
      restaurante: {
        create: {
          nome: "Pizza Hut",
          horarioInicio: "11:00",
          horarioFim: "23:30",
          lat: -23.551,
          lng: -46.634,
        },
      },
    },
  });

  const sushiUser = await prisma.user.upsert({
    where: { email: "sushi@comeja.com" },
    update: {},
    create: {
      email: "sushi@comeja.com",
      passwordHash,
      role: "RESTAURANTE",
      restaurante: {
        create: {
          nome: "Sushi House",
          horarioInicio: "12:00",
          horarioFim: "22:00",
          lat: -23.552,
          lng: -46.635,
        },
      },
    },
  });

  // Produtos - Burger King
  await prisma.produto.createMany({
    data: [
      {
        restauranteId: burgerUser.id,
        nome: "Whopper",
        descricao: "Hamburguer artesanal com molho especial",
        precoCents: 2490,
      },
      {
        restauranteId: burgerUser.id,
        nome: "Batata Frita Média",
        descricao: "Batata crocante",
        precoCents: 1090,
      },
      {
        restauranteId: burgerUser.id,
        nome: "Coca-Cola Lata",
        descricao: "Refrigerante 350ml",
        precoCents: 590,
      },
      {
        restauranteId: burgerUser.id,
        nome: "Milk Shake de Chocolate",
        descricao: "Milk shake cremoso 400ml",
        precoCents: 1590,
      },
      {
        restauranteId: burgerUser.id,
        nome: "Combo Whopper",
        descricao: "Whopper + Batata + Refrigerante",
        precoCents: 3490,
      },
    ],
  });

  // Produtos - Pizza Hut
  await prisma.produto.createMany({
    data: [
      {
        restauranteId: pizzaUser.id,
        nome: "Pizza Calabresa",
        descricao: "Calabresa, cebola e mussarela",
        precoCents: 3490,
      },
      {
        restauranteId: pizzaUser.id,
        nome: "Pizza Marguerita",
        descricao: "Molho, mussarela, tomate e manjericão",
        precoCents: 3290,
      },
      {
        restauranteId: pizzaUser.id,
        nome: "Coca-Cola 2L",
        descricao: "Refrigerante 2 litros",
        precoCents: 990,
      },
      {
        restauranteId: pizzaUser.id,
        nome: "Brownie",
        descricao: "Brownie de chocolate com sorvete",
        precoCents: 1490,
      },
    ],
  });

  // Produtos - Sushi House
  await prisma.produto.createMany({
    data: [
      {
        restauranteId: sushiUser.id,
        nome: "Combinado 20 peças",
        descricao: "Sashimi, niguiri e hossomaki",
        precoCents: 4990,
      },
      {
        restauranteId: sushiUser.id,
        nome: "Uramaki Filadélfia",
        descricao: "8 unidades de uramaki com cream cheese",
        precoCents: 2490,
      },
      {
        restauranteId: sushiUser.id,
        nome: "Temaki Salmão",
        descricao: "Cone de alga com salmão e arroz",
        precoCents: 1990,
      },
      {
        restauranteId: sushiUser.id,
        nome: "Hot Roll",
        descricao: "10 unidades empanadas",
        precoCents: 2290,
      },
    ],
  });

  // Comprador
  const clientUser = await prisma.user.upsert({
    where: { email: "cliente@comeja.com" },
    update: {},
    create: {
      email: "cliente@comeja.com",
      telefone: "11999999999",
      passwordHash,
      role: "COMPRADOR",
      comprador: {
        create: {},
      },
    },
  });

  // Endereco do comprador
  await prisma.endereco.create({
    data: {
      compradorId: clientUser.id,
      logradouro: "Rua Augusta, 1500, Consolação, São Paulo - SP",
      lat: -23.55,
      lng: -46.64,
    },
  });

  // Entregador
  const entregadorUser = await prisma.user.upsert({
    where: { email: "entregador@comeja.com" },
    update: {},
    create: {
      email: "entregador@comeja.com",
      passwordHash,
      role: "ENTREGADOR",
      entregador: {
        create: {
          documento: "12345678900",
          veiculo: "Moto Honda CG 160",
          disponivel: true,
        },
      },
    },
  });

  console.log("Seed concluído com sucesso!");
  console.log("Admin: admin@comeja.com / 123456");
  console.log("Restaurante 1: burger@comeja.com / 123456");
  console.log("Restaurante 2: pizza@comeja.com / 123456");
  console.log("Restaurante 3: sushi@comeja.com / 123456");
  console.log("Comprador: cliente@comeja.com / 123456");
  console.log("Entregador: entregador@comeja.com / 123456");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
