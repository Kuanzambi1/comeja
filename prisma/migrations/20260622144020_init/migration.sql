-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'COMPRADOR', 'RESTAURANTE', 'ENTREGADOR');

-- CreateEnum
CREATE TYPE "PedidoStatus" AS ENUM ('CANCELADO', 'RECEBIDO', 'EM_PREPARO', 'PRONTO', 'ACEITO_ENTREGADOR', 'A_CAMINHO_RESTAURANTE', 'A_CAMINHO_CLIENTE', 'ENTREGUE');

-- CreateEnum
CREATE TYPE "FormaPagamento" AS ENUM ('DINHEIRO', 'CARTAO', 'PIX');

-- CreateEnum
CREATE TYPE "RastreamentoStatus" AS ENUM ('SAINDO_RESTAURANTE', 'A_CAMINHO_CLIENTE', 'ENTREGUE');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "role" "UserRole" NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comprador" (
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Comprador_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Restaurante" (
    "userId" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "horarioInicio" TEXT,
    "horarioFim" TEXT,
    "disponivel" BOOLEAN NOT NULL DEFAULT true,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Restaurante_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Entregador" (
    "userId" INTEGER NOT NULL,
    "documento" TEXT NOT NULL,
    "veiculo" TEXT NOT NULL,
    "fotoUrl" TEXT,
    "disponivel" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Entregador_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Endereco" (
    "id" SERIAL NOT NULL,
    "compradorId" INTEGER NOT NULL,
    "logradouro" TEXT NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,

    CONSTRAINT "Endereco_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Produto" (
    "id" SERIAL NOT NULL,
    "restauranteId" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "precoCents" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "fotoUrl" TEXT,
    "disponivel" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pedido" (
    "id" SERIAL NOT NULL,
    "compradorId" INTEGER NOT NULL,
    "restauranteId" INTEGER NOT NULL,
    "entregadorId" INTEGER,
    "status" "PedidoStatus" NOT NULL DEFAULT 'RECEBIDO',
    "totalCents" INTEGER NOT NULL,
    "taxaEntregaCents" INTEGER NOT NULL,
    "formaPagamento" "FormaPagamento" NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemPedido" (
    "id" SERIAL NOT NULL,
    "pedidoId" INTEGER NOT NULL,
    "produtoId" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "precoUnitarioCents" INTEGER NOT NULL,

    CONSTRAINT "ItemPedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Avaliacao" (
    "id" SERIAL NOT NULL,
    "compradorId" INTEGER NOT NULL,
    "pedidoId" INTEGER NOT NULL,
    "notaEntregador" INTEGER,
    "notaRestaurante" INTEGER,
    "comentario" TEXT,

    CONSTRAINT "Avaliacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rastreamento" (
    "id" SERIAL NOT NULL,
    "pedidoId" INTEGER NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statusNaqueleMomento" "RastreamentoStatus" NOT NULL,

    CONSTRAINT "Rastreamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventoRastreamento" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" INTEGER,
    "pageUrl" TEXT NOT NULL,
    "elementSelector" TEXT,
    "x" INTEGER,
    "y" INTEGER,
    "viewportW" INTEGER,
    "viewportH" INTEGER,
    "pageH" INTEGER,
    "metadata" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventoRastreamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TesteAB" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "hipotese" TEXT NOT NULL,
    "pagina" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TesteAB_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VarianteAB" (
    "id" SERIAL NOT NULL,
    "testeId" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "peso" INTEGER NOT NULL DEFAULT 50,
    "configuracoes" TEXT NOT NULL,

    CONSTRAINT "VarianteAB_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParticipacaoTeste" (
    "id" SERIAL NOT NULL,
    "testeId" INTEGER NOT NULL,
    "varianteId" INTEGER NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" INTEGER,
    "convertido" BOOLEAN NOT NULL DEFAULT false,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ParticipacaoTeste_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Endereco_compradorId_idx" ON "Endereco"("compradorId");

-- CreateIndex
CREATE INDEX "Produto_restauranteId_idx" ON "Produto"("restauranteId");

-- CreateIndex
CREATE INDEX "Pedido_status_idx" ON "Pedido"("status");

-- CreateIndex
CREATE INDEX "Pedido_entregadorId_idx" ON "Pedido"("entregadorId");

-- CreateIndex
CREATE INDEX "Pedido_restauranteId_idx" ON "Pedido"("restauranteId");

-- CreateIndex
CREATE INDEX "Pedido_compradorId_idx" ON "Pedido"("compradorId");

-- CreateIndex
CREATE INDEX "Pedido_criadoEm_idx" ON "Pedido"("criadoEm");

-- CreateIndex
CREATE INDEX "ItemPedido_pedidoId_idx" ON "ItemPedido"("pedidoId");

-- CreateIndex
CREATE INDEX "ItemPedido_produtoId_idx" ON "ItemPedido"("produtoId");

-- CreateIndex
CREATE UNIQUE INDEX "ItemPedido_pedidoId_produtoId_key" ON "ItemPedido"("pedidoId", "produtoId");

-- CreateIndex
CREATE UNIQUE INDEX "Avaliacao_pedidoId_key" ON "Avaliacao"("pedidoId");

-- CreateIndex
CREATE INDEX "Avaliacao_compradorId_idx" ON "Avaliacao"("compradorId");

-- CreateIndex
CREATE INDEX "Rastreamento_pedidoId_idx" ON "Rastreamento"("pedidoId");

-- CreateIndex
CREATE INDEX "EventoRastreamento_tipo_idx" ON "EventoRastreamento"("tipo");

-- CreateIndex
CREATE INDEX "EventoRastreamento_sessionId_idx" ON "EventoRastreamento"("sessionId");

-- CreateIndex
CREATE INDEX "EventoRastreamento_userId_idx" ON "EventoRastreamento"("userId");

-- CreateIndex
CREATE INDEX "EventoRastreamento_criadoEm_idx" ON "EventoRastreamento"("criadoEm");

-- CreateIndex
CREATE INDEX "EventoRastreamento_pageUrl_idx" ON "EventoRastreamento"("pageUrl");

-- CreateIndex
CREATE UNIQUE INDEX "VarianteAB_testeId_nome_key" ON "VarianteAB"("testeId", "nome");

-- CreateIndex
CREATE UNIQUE INDEX "ParticipacaoTeste_testeId_sessionId_key" ON "ParticipacaoTeste"("testeId", "sessionId");

-- AddForeignKey
ALTER TABLE "Comprador" ADD CONSTRAINT "Comprador_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Restaurante" ADD CONSTRAINT "Restaurante_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entregador" ADD CONSTRAINT "Entregador_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Endereco" ADD CONSTRAINT "Endereco_compradorId_fkey" FOREIGN KEY ("compradorId") REFERENCES "Comprador"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_restauranteId_fkey" FOREIGN KEY ("restauranteId") REFERENCES "Restaurante"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_compradorId_fkey" FOREIGN KEY ("compradorId") REFERENCES "Comprador"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_restauranteId_fkey" FOREIGN KEY ("restauranteId") REFERENCES "Restaurante"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_entregadorId_fkey" FOREIGN KEY ("entregadorId") REFERENCES "Entregador"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemPedido" ADD CONSTRAINT "ItemPedido_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemPedido" ADD CONSTRAINT "ItemPedido_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_compradorId_fkey" FOREIGN KEY ("compradorId") REFERENCES "Comprador"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rastreamento" ADD CONSTRAINT "Rastreamento_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VarianteAB" ADD CONSTRAINT "VarianteAB_testeId_fkey" FOREIGN KEY ("testeId") REFERENCES "TesteAB"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipacaoTeste" ADD CONSTRAINT "ParticipacaoTeste_testeId_fkey" FOREIGN KEY ("testeId") REFERENCES "TesteAB"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipacaoTeste" ADD CONSTRAINT "ParticipacaoTeste_varianteId_fkey" FOREIGN KEY ("varianteId") REFERENCES "VarianteAB"("id") ON DELETE CASCADE ON UPDATE CASCADE;
