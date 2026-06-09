Descrição do Negócio :


Come Já

\- O que é: Plataforma digital de entrega de fast food conectando clientes a

restaurantes locais



\- Para que serve: Permitir receber comida em casa ou no trabalho com apenas

alguns toques



\- Diferencial : Entregas mais rápidas, interface simples e intuitiva, parcerias com

restaurantes locais



Actores:

\- Cliente

\- Parceiro

\- Entregador

\- Administrador



\*\*Requisitos\*\*



Comprador

|ID|Requisito|
|-|-|
|RF01|Cadastrar-se com e-mail, telefone e endereço de entrega|
|RF02|Visualizar lista de restaurantes por proximidade|
|RF03|Visualizar cardápio com preços, descrições e fotos|
|RF04|Adicionar/remover itens ao carrinho|
|RF05|Calcular total do pedido (itens + taxa de entrega)|
|RF06|Escolher forma de pagamento (dinheiro, cartão)|
|RF07|Acompanhar status do pedido (preparando, saiu para entrega, entregue)|
|RF08|Avaliar pedido e entregador após conclusão|
|RF09|Cancelar pedido antes de ser aceito pelo restaurante|



Restaurante



|ID|Requisito|
|-|-|
|RF10|Cadastrar/gerenciar cardápio (produtos, preços, disponibilidade)|
|RF11|Receber pedidos com som/notificação|
|RF12|Atualizar status do pedido (recebido, em preparo, pronto)|
|RF13|Visualizar histórico de pedidos e faturamento|
|RF14|Definar horário de funcionamento|
|RF15|Aceitar/recusar pedido (ex: falta insumo)|



Entregador



|ID|Requisito|
|-|-|
|RF17|Cadastrar-se com documento, veículo e foto|
|RF18|Ativar/desativar modo "disponível para entregas"|
|RF19|Receber notificação de novo pedido próximo|
|RF20|Aceitar ou recusar pedido|
|RF21|Visualizar rota otimizada para entrega|
|RF22|Atualizar status (a caminho do restaurante, a caminho do cliente, entregue)|
|RF23|Registrar conclusão da entrega|



Administrador



|ID|Requisito|
|-|-|
|RF24|Gerir restaurantes (aprovar, bloquear, suspender)|
|RF25|Gerir entregadores (verificar documentos, ativar/desativar)|
|RF26|Gerir taxas da plataforma (ex: % por pedido)|
|RF27|Visualizar dashboards de pedidos, entregas, cancelamentos|
|RF28|Gerir cupons de desconto globais|



Requisitos não funcionais

|ID|Requisito|
|-|-|
|RNF01|Disponibilidade|
|RNF02|Tempo de Resposta|
|RNF03|Segurança|
|RNF04|Escalabilidade|
|RNF05|Geolocalização|
|RNF06|Usabilidade|
|RNF07|Conformidade|
|RNF08|Notificações|



Usuario (id PK) - tabela base para Comprador, Restaurante, Entregador

├── Comprador (id PK, FK usuario\_id)

├── Restaurante (id PK, FK usuario\_id)

└── Entregador (id PK, FK usuario\_id)



Endereco (id PK, comprador\_id FK, logradouro, lat, lng)

Produto (id PK, restaurante\_id FK, nome, preco, descricao, foto\_url, disponivel)

Pedido (id PK, comprador\_id FK, restaurante\_id FK, entregador\_id FK, status, total, taxa\_entrega, forma\_pagamento, criado\_em)

ItemPedido (id PK, pedido\_id FK, produto\_id FK, quantidade, preco\_unitario)

Avaliacao (id PK, comprador\_id FK, pedido\_id FK, nota\_entregador, nota\_restaurante, comentario)

Rastreamento (id PK, pedido\_id FK, latitude, longitude, timestamp, status\_naquele\_momento)

