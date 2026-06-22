# Guia Prático para a Defesa do Projeto - Foco no Back-End

Este guia foi elaborado para te ajudar a defender as decisões arquiteturais, tecnologias e padrões utilizados na construção do back-end da aplicação "Come Já" (Fastfood Delivery). 

---

## 1. Arquitetura e Tecnologias Base

**Q: Qual é a arquitetura principal do back-end do projeto?**
R: O projeto utiliza o **Next.js 16** com o **App Router**. Optamos por não ter um servidor Node.js/Express separado; em vez disso, usamos os recursos "Full-Stack" do Next.js. Toda a lógica de servidor está dividida em **Route Handlers** (para APIs RESTful, como o rastreamento e integrações) e **Server Actions** (funções assíncronas chamadas diretamente pelos componentes front-end para mutações no banco de dados, como aceitar um pedido ou alterar disponibilidade).

**Q: Por que usar Server Actions no lugar de rotas de API tradicionais para tudo?**
R: As Server Actions reduzem a complexidade do código, pois eliminam a necessidade de gerenciar estados de *loading*, *fetch* manual e tratamento de erros no lado do cliente. Elas se comunicam de forma nativa e segura entre o Front e o Back-end, permitindo a revalidação imediata do cache da página (ex: `revalidatePath`) assim que um dado muda (como o status de um pedido).

---

## 2. Banco de Dados e ORM

**Q: Qual banco de dados foi utilizado e por que?**
R: Utilizamos o **PostgreSQL**, hospedado em um ambiente Serverless (Neon DB). Escolhemos o Postgres por ser relacional, robusto e garantir integridade referencial através de *Foreign Keys* (ex: relacionamento forte entre User, Pedido, Restaurante e Produto). O ambiente Serverless (Neon) foi escolhido para suportar o deploy na Vercel (Edge/Serverless Functions) com suporte a *connection pooling*, evitando sobrecarga de conexões simultâneas.

**Q: O que é o Prisma e por que não usar SQL puro?**
R: O **Prisma** é o nosso ORM (Object-Relational Mapper). Ele foi escolhido por proporcionar segurança de tipagem (Type Safety) ponta-a-ponta em conjunto com o TypeScript. Isso significa que, se o esquema do banco mudar, o TypeScript acusa o erro no código antes mesmo de ir para produção. Além disso, ele gerencia nossas migrações (mudanças estruturais no banco) e simplifica buscas complexas com relacionamentos. Utilizamos o pacote `@prisma/adapter-pg` para garantir compatibilidade nativa com o driver Postgres do Node.

---

## 3. Autenticação e Segurança (RBAC)

**Q: Como funciona o sistema de Autenticação? Usaram bibliotecas como NextAuth?**
R: Optamos por criar um sistema de **Autenticação Customizado baseado em JWT (JSON Web Tokens)**, usando a biblioteca `jose` (que é compatível com Edge Runtimes da Vercel) e `bcryptjs` para o hash de senhas. Escolhemos essa abordagem ao invés do NextAuth para ter controle total sobre os papéis (*Roles*) dos usuários e sobre como o token é validado a cada requisição via Middleware.

**Q: Como garantem que um Restaurante não acesse a área de um Entregador? (Autorização)**
R: Implementamos **RBAC (Role-Based Access Control)**. No banco de dados, cada usuário tem um enum `UserRole` (ADMIN, COMPRADOR, RESTAURANTE, ENTREGADOR). 
No Back-end, temos um arquivo interceptador central chamado **`proxy.ts`** (Middleware do Next.js). Antes de qualquer página ou API privada carregar, esse middleware verifica o Token JWT nos cookies. Ele extrai a Role do usuário e verifica se a rota acessada permite aquele perfil. Se um Restaurante tentar acessar `/entregador/...`, o middleware bloqueia a requisição no servidor e o redireciona.

---

## 4. Gerenciamento de Status e Fluxo do Pedido

**Q: Como vocês lidam com as etapas de um pedido?**
R: No Prisma, criamos o enum `PedidoStatus` (RECEBIDO, EM_PREPARO, PRONTO, ACEITO_ENTREGADOR, A_CAMINHO_CLIENTE, ENTREGUE). 
No Back-end, as transições não são livres. Uma Server Action (ex: `atualizarStatusEntrega` no `actions/entregador.ts`) valida estritamente a "Máquina de Estados". Ou seja, um entregador só pode mudar um pedido para `A_CAMINHO_CLIENTE` se o status atual for estritamente `A_CAMINHO_RESTAURANTE`. Essa validação evita que inconsistências ocorram (ex: um pedido ir de "RECEBIDO" direto para "ENTREGUE").

---

## 5. Rastreamento e Analytics (Diferencial)

**Q: Vi que existe uma tabela de EventoRastreamento e Testes A/B. Como isso funciona no back-end?**
R: Construímos uma API dedicada (`/api/rastreamento/route.ts` e `/api/rastreamento/pixel/route.ts`) para atuar como um "Google Analytics" interno. 
- A API recebe *payloads* assíncronos (cliques, visitas, coordenadas do mouse). 
- Esses dados são processados e inseridos no banco usando Prisma de forma otimizada.
- Criamos um modelo de Teste A/B onde o back-end distribui os usuários (baseado em Session IDs gerados localmente) entre variantes de uma funcionalidade, permitindo ao Administrador tomar decisões baseadas em dados sem depender de ferramentas pagas de terceiros.

---

## 6. Desafios e Soluções (Dica para a Banca)

**Se te perguntarem "Qual foi a maior dificuldade no back-end?":**
**R:** A configuração do ORM (Prisma) em conjunto com o deploy na plataforma Serverless (Vercel). Como Serverless Functions não mantêm uma conexão persistente com o banco de dados como servidores Node.js tradicionais, poderíamos ter problemas de esgotamento de conexões (*Connection Exhaustion*). Para resolver isso, utilizamos a URL de Pooling (`-pooler`) do Neon Database e configuramos o `serverExternalPackages` para compilar o adaptador Postgres de maneira otimizada, garantindo alta disponibilidade mesmo sob picos de acesso.
