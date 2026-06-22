-- CreateTable
CREATE TABLE `EventoRastreamento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` VARCHAR(191) NOT NULL,
    `sessionId` VARCHAR(191) NOT NULL,
    `userId` INTEGER NULL,
    `pageUrl` VARCHAR(191) NOT NULL,
    `elementSelector` VARCHAR(191) NULL,
    `x` INTEGER NULL,
    `y` INTEGER NULL,
    `viewportW` INTEGER NULL,
    `viewportH` INTEGER NULL,
    `pageH` INTEGER NULL,
    `metadata` VARCHAR(191) NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `EventoRastreamento_tipo_idx`(`tipo`),
    INDEX `EventoRastreamento_sessionId_idx`(`sessionId`),
    INDEX `EventoRastreamento_userId_idx`(`userId`),
    INDEX `EventoRastreamento_criadoEm_idx`(`criadoEm`),
    INDEX `EventoRastreamento_pageUrl_idx`(`pageUrl`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TesteAB` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `hipotese` VARCHAR(191) NOT NULL,
    `pagina` VARCHAR(191) NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VarianteAB` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `testeId` INTEGER NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `peso` INTEGER NOT NULL DEFAULT 50,
    `configuracoes` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `VarianteAB_testeId_nome_key`(`testeId`, `nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ParticipacaoTeste` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `testeId` INTEGER NOT NULL,
    `varianteId` INTEGER NOT NULL,
    `sessionId` VARCHAR(191) NOT NULL,
    `userId` INTEGER NULL,
    `convertido` BOOLEAN NOT NULL DEFAULT false,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ParticipacaoTeste_testeId_sessionId_key`(`testeId`, `sessionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `VarianteAB` ADD CONSTRAINT `VarianteAB_testeId_fkey` FOREIGN KEY (`testeId`) REFERENCES `TesteAB`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ParticipacaoTeste` ADD CONSTRAINT `ParticipacaoTeste_testeId_fkey` FOREIGN KEY (`testeId`) REFERENCES `TesteAB`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ParticipacaoTeste` ADD CONSTRAINT `ParticipacaoTeste_varianteId_fkey` FOREIGN KEY (`varianteId`) REFERENCES `VarianteAB`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
