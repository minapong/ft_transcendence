## Custom Minor Module — Database Persistence & Type-Safe ORM (1 pt)

### Module Name

**Database Persistence & Type-Safe ORM (Prisma Infrastructure)**

### Module Type

**Minor — Modules of Choice**

---

### Why This Module Was Chosen

To ensure data integrity and developer productivity, the project needed a robust persistence layer that bridges the gap between a relational database (SQLite) and a type-strictly environment (TypeScript).

Instead of using raw SQL or untyped drivers, this module implements a **centralized ORM infrastructure** using Prisma. This approach guarantees that every database interaction is schema-validated, type-safe, and consistent across all backend services.

---

### Design Goal

The objective was to create a **unified data access layer** that provides:

*   **Single Source of Truth:** A declarative schema file (`schema.prisma`) defining all entities and relations.
*   **Compile-Time Safety:** Automatically generated TypeScript types matching the database structure.
*   **Relational Integrity:** Explicitly defined foreign keys, indexes, and cascading behavior.
*   **Predictable Migrations:** Version-controlled database evolution without manual SQL scripts.

---

### Technical Challenges Addressed

#### 1. Circular Dependency Management in Relations
*   Defined many-to-many and one-to-one relations (e.g., Users ↔ Matches, User ↔ Stats) while ensuring Prisma correctly generates bidirectional types.
*   Handled the "set null" vs "cascade" logic for historical match data when users are deleted.

#### 2. Seed Data & Local Development
*   Implemented an automated **seeding system** that populates the database with default users and test data in a single command.
*   This ensures every team member and evaluator starts with a consistent and functional application state.

#### 3. Type-Safe Repository Pattern
*   Abstracted common database operations into reusable "repository" functions.
*   This prevents leaking ORM-specific logic into the business routes (Fastify handlers), making the codebase more modular and testable.

#### 4. Environment-Aware Connection Handling
*   Configured the persistence layer to handle dynamic SQLite file paths and environment variables.
*   Guarantees that the database remains portable within Docker containers while allowing local debugging.

---

### Value Added to the Project

This module enables:

*   **Zero Runtime SQL Errors:** Queries are validated at compile time, eliminating a massive class of common backend bugs.
*   **Faster Development:** Auto-completion for database queries significantly speeds up the implementation of new features (like Friends or Tournaments).
*   **Data Reliability:** Relational constraints ensure that matches cannot exist without players, and stats always stay synced with user accounts.
*   **Clean Architecture:** Separates the storage concerns from the application logic.

---

### Why This Deserves Minor Module Status (1 pt)

This module qualifies as a **Minor custom module** because it:

*   Implements a critical infrastructure layer (Persistence).
*   Solves complex relational mapping and type-safety problems.
*   Provides the foundation for every other feature in the application (Auth, Games, Stats).
*   Demonstrates advanced usage of modern backend tooling and schema design.

---

### Conclusion

The Database Persistence & Type-Safe ORM module is the bedrock of the application's data layer. It ensures that the **ft_transcendence** platform is not just a UI demo, but a reliable, data-driven system with professional-grade integrity.

It fully satisfies the requirements for a **Minor “Modules of Choice” implementation (1 point)**.
