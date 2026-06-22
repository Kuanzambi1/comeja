import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres@localhost:5432/fastfood_delivery",
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
          lat: -8.8147,
          lng: 13.2302,
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
          lat: -8.8231,
          lng: 13.2405,
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
          lat: -8.8303,
          lng: 13.2361,
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
        descricao: "Hamburguer artesanal 180g com molho especial",
        precoCents: 500000,
      },
      {
        restauranteId: burgerUser.id,
        nome: "Batata Frita Média",
        descricao: "Batata crocante 150g",
        precoCents: 200000,
      },
      {
        restauranteId: burgerUser.id,
        nome: "Coca-Cola Lata",
        descricao: "Refrigerante 350ml",
        precoCents: 100000,
      },
      {
        restauranteId: burgerUser.id,
        nome: "Milk Shake de Chocolate",
        descricao: "Milk shake cremoso 400ml",
        precoCents: 300000,
      },
      {
        restauranteId: burgerUser.id,
        nome: "Combo Whopper",
        descricao: "Whopper + Batata Média + Coca-Cola",
        precoCents: 750000,
      },
    ],
  });

  // Produtos - Pizza Hut
  await prisma.produto.createMany({
    data: [
      {
        restauranteId: pizzaUser.id,
        nome: "Pizza Calabresa",
        descricao: "Calabresa, cebola e mussarela (média)",
        precoCents: 600000,
      },
      {
        restauranteId: pizzaUser.id,
        nome: "Pizza Marguerita",
        descricao: "Molho, mussarela, tomate e manjericão (média)",
        precoCents: 550000,
      },
      {
        restauranteId: pizzaUser.id,
        nome: "Coca-Cola 2L",
        descricao: "Refrigerante 2 litros",
        precoCents: 150000,
      },
      {
        restauranteId: pizzaUser.id,
        nome: "Brownie com Sorvete",
        descricao: "Brownie de chocolate com sorvete",
        precoCents: 250000,
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
        precoCents: 800000,
      },
      {
        restauranteId: sushiUser.id,
        nome: "Uramaki Filadélfia",
        descricao: "8 unidades de uramaki com cream cheese",
        precoCents: 450000,
      },
      {
        restauranteId: sushiUser.id,
        nome: "Temaki Salmão",
        descricao: "Cone de alga com salmão e arroz",
        precoCents: 350000,
      },
      {
        restauranteId: sushiUser.id,
        nome: "Hot Roll",
        descricao: "10 unidades empanadas e fritas",
        precoCents: 400000,
      },
    ],
  });

  // Comprador
  const clientUser = await prisma.user.upsert({
    where: { email: "cliente@comeja.com" },
    update: {},
    create: {
      email: "cliente@comeja.com",
      telefone: "923456789",
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
      logradouro: "Rua Rainha Ginga, 150, Ingombota, Luanda",
      lat: -8.8181,
      lng: 13.2342,
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

  // A/B Test - CTA texto homepage
  const testeCTA = await prisma.testeAB.upsert({
    where: { id: 1 },
    update: {},
    create: {
      nome: "cta_texto_home",
      hipotese: "Alterar o CTA principal de 'Pedir Agora' para 'Peça Já' aumenta a taxa de clique em 15%",
      pagina: "/",
      ativo: true,
      variantes: {
        create: [
          { nome: "controle", peso: 50, configuracoes: '{"ctaTexto":"Pedir Agora","ctaIcon":"→"}' },
          { nome: "variante_a", peso: 50, configuracoes: '{"ctaTexto":"Peça Já","ctaIcon":"🔥"}' },
        ],
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
