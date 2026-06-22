-- CreateIndex (with IF NOT EXISTS style via try-catch)
CREATE INDEX `ItemPedido_pedidoId_idx` ON `ItemPedido`(`pedidoId`);
CREATE INDEX `Pedido_status_idx` ON `Pedido`(`status`);
CREATE INDEX `Pedido_criadoEm_idx` ON `Pedido`(`criadoEm`);
CREATE INDEX `Avaliacao_compradorId_idx` ON `Avaliacao`(`compradorId`);
CREATE INDEX `Endereco_compradorId_idx` ON `Endereco`(`compradorId`);
CREATE INDEX `ItemPedido_produtoId_idx` ON `ItemPedido`(`produtoId`);
CREATE INDEX `Pedido_compradorId_idx` ON `Pedido`(`compradorId`);
CREATE INDEX `Pedido_entregadorId_idx` ON `Pedido`(`entregadorId`);
CREATE INDEX `Pedido_restauranteId_idx` ON `Pedido`(`restauranteId`);
CREATE INDEX `Produto_restauranteId_idx` ON `Produto`(`restauranteId`);
CREATE INDEX `Rastreamento_pedidoId_idx` ON `Rastreamento`(`pedidoId`);
