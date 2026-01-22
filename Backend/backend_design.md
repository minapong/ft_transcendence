
All backend code must follow this flow:

ROUTE → SERVICE → REPOSITORY → DATABASE

Do not skip a layer.


1️⃣ Domain Layer (src/domain)

		Domain files:

		- define what exists (User, Match, Tournament, etc.)

		- contain only TypeScript types / pure functions

		❌ NO Fastify

		❌ NO Prisma / SQL

Example:

export interface User {
  id: number
  username: string
}

2️⃣ Repository Layer (src/repositories)

		Repositories:

		- handle data access only

		- return domain types

		- hide DB implementation (memory / SQL / Prisma)

		Rules:

		❌ no business logic

		❌ no HTTP logic

3️⃣ Service Layer (src/services)

		Services:

		- contain business rules

		- coordinate repositories

		- throw errors (no HTTP)

		Rules:

		❌ no Fastify

		❌ no SQL / Prisma

4️⃣ Route Layer (src/routes)

		Routes:

		- validate input

		- call services

		- convert errors → HTTP responses

		Rules:

		❌ no business logic

		❌ no database calls