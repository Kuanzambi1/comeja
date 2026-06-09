-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `role` ENUM('ADMIN', 'COMPRADOR', 'RESTAURANTE', 'ENTREGADOR') NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comprador` (
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Restaurante` (
    `userId` INTEGER NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `horarioInicio` VARCHAR(191) NULL,
    `horarioFim` VARCHAR(191) NULL,
    `disponivel` BOOLEAN NOT NULL DEFAULT true,
    `lat` DOUBLE NULL,
    `lng` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Entregador` (
    `userId` INTEGER NOT NULL,
    `documento` VARCHAR(191) NOT NULL,
    `veiculo` VARCHAR(191) NOT NULL,
    `fotoUrl` VARCHAR(191) NULL,
    `disponivel` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Endereco` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `compradorId` INTEGER NOT NULL,
    `logradouro` VARCHAR(191) NOT NULL,
    `lat` DOUBLE NULL,
    `lng` DOUBLE NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Produto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `restauranteId` INTEGER NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `precoCents` INTEGER NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `fotoUrl` VARCHAR(191) NULL,
    `disponivel` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pedido` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `compradorId` INTEGER NOT NULL,
    `restauranteId` INTEGER NOT NULL,
    `entregadorId` INTEGER NULL,
    `status` ENUM('CANCELADO', 'RECEBIDO', 'EM_PREPARO', 'PRONTO', 'ACEITO_ENTREGADOR', 'A_CAMINHO_RESTAURANTE', 'A_CAMINHO_CLIENTE', 'ENTREGUE') NOT NULL DEFAULT 'RECEBIDO',
    `totalCents` INTEGER NOT NULL,
    `taxaEntregaCents` INTEGER NOT NULL,
    `formaPagamento` ENUM('DINHEIRO', 'CARTAO', 'PIX') NOT NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ItemPedido` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pedidoId` INTEGER NOT NULL,
    `produtoId` INTEGER NOT NULL,
    `quantidade` INTEGER NOT NULL,
    `precoUnitarioCents` INTEGER NOT NULL,

    UNIQUE INDEX `ItemPedido_pedidoId_produtoId_key`(`pedidoId`, `produtoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Avaliacao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `compradorId` INTEGER NOT NULL,
    `pedidoId` INTEGER NOT NULL,
    `notaEntregador` INTEGER NULL,
    `notaRestaurante` INTEGER NULL,
    `comentario` VARCHAR(191) NULL,

    UNIQUE INDEX `Avaliacao_pedidoId_key`(`pedidoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rastreamento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pedidoId` INTEGER NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `statusNaqueleMomento` ENUM('SAINDO_RESTAURANTE', 'A_CAMINHO_CLIENTE', 'ENTREGUE') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Comprador` ADD CONSTRAINT `Comprador_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Restaurante` ADD CONSTRAINT `Restaurante_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Entregador` ADD CONSTRAINT `Entregador_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Endereco` ADD CONSTRAINT `Endereco_compradorId_fkey` FOREIGN KEY (`compradorId`) REFERENCES `Comprador`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Produto` ADD CONSTRAINT `Produto_restauranteId_fkey` FOREIGN KEY (`restauranteId`) REFERENCES `Restaurante`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pedido` ADD CONSTRAINT `Pedido_compradorId_fkey` FOREIGN KEY (`compradorId`) REFERENCES `Comprador`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pedido` ADD CONSTRAINT `Pedido_restauranteId_fkey` FOREIGN KEY (`restauranteId`) REFERENCES `Restaurante`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pedido` ADD CONSTRAINT `Pedido_entregadorId_fkey` FOREIGN KEY (`entregadorId`) REFERENCES `Entregador`(`userId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemPedido` ADD CONSTRAINT `ItemPedido_pedidoId_fkey` FOREIGN KEY (`pedidoId`) REFERENCES `Pedido`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemPedido` ADD CONSTRAINT `ItemPedido_produtoId_fkey` FOREIGN KEY (`produtoId`) REFERENCES `Produto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Avaliacao` ADD CONSTRAINT `Avaliacao_compradorId_fkey` FOREIGN KEY (`compradorId`) REFERENCES `Comprador`(`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Avaliacao` ADD CONSTRAINT `Avaliacao_pedidoId_fkey` FOREIGN KEY (`pedidoId`) REFERENCES `Pedido`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rastreamento` ADD CONSTRAINT `Rastreamento_pedidoId_fkey` FOREIGN KEY (`pedidoId`) REFERENCES `Pedido`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
