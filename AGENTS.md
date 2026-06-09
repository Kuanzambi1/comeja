# Come Já - Fast Food Delivery Platform

## Stack
- Next.js 16 (App Router) + TypeScript
- Prisma (SQLite) + generated client at `src/generated/prisma/`
- TailwindCSS v4
- bcryptjs (hashing) + jose (JWT)
- Zod validation

## Commands
- `npm run dev` - start dev server
- `npm run build` - build for production
- `npm run lint` - run ESLint
- `npm run prisma:generate` - regenerate Prisma client
- `npm run prisma:migrate` - run dev migration
- `npm run prisma:seed` - run seed script
- `npm run prisma:studio` - open Prisma Studio
- `npm run prisma:reset` - reset DB

## Architecture
- Auth: JWT in httpOnly cookie named `token`
- Prices stored in cents (precoCents, totalCents, taxaEntregaCents, precoUnitarioCents)
- Roles: ADMIN, COMPRADOR, RESTAURANTE, ENTREGADOR
- Protected routes by middleware (src/middleware.ts)
- Route groups: (auth), (comprador), (restaurante), (entregador), (admin)
- lib/prisma.ts - singleton Prisma client
- lib/auth.ts - JWT sign/verify, password hash/compare, getUserFromCookies
- lib/utils.ts - formatCents (cents -> BRL), ApiError helper
