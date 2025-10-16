# Finance Data Layer

This repository provides the foundational data layer for tracking invoices, incomes, expenses, credits, and payments using Prisma with a SQLite database by default.

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure the environment:
   ```bash
   cp .env.example .env
   ```
3. Apply the initial migration:
   ```bash
   npx prisma migrate deploy
   ```
4. Seed the database with representative development data:
   ```bash
   npm run db:seed
   ```

When migrations are updated locally you can also run `npx prisma migrate dev` (interactive) to create new migrations and iterate on the schema.

## Data model overview

| Entity   | Highlights |
|----------|------------|
| `Invoice` | Tracks issue/due dates, customer metadata, and stores computed tax/total amounts via generated columns. Status and currency values are constrained to an approved list. |
| `Income`  | Links optional invoice/payments, and exposes a computed `netAmount` (gross amount minus fees). A unique constraint ensures one income per payment. |
| `Expense` | Categorised vendor spend with computed `totalWithTax` and optional payment method tracking. |
| `Credit`  | Credit memos issued against invoices with optional expirations. |
| `Payment` | Ledger of money received against invoices including method + references. |

### Enumerated values

SQLite does not support native enum types, so allowed values are enforced with `CHECK` constraints in the migration. The allowed sets are:

- Currency: `USD`, `EUR`, `GBP`, `CAD`, `AUD`
- Invoice status: `DRAFT`, `SENT`, `PARTIALLY_PAID`, `PAID`, `OVERDUE`, `CANCELED`
- Payment method: `BANK_TRANSFER`, `CARD`, `CASH`, `CHECK`, `ACH`, `OTHER`
- Expense category: `OPERATIONS`, `MARKETING`, `PAYROLL`, `SOFTWARE`, `TRAVEL`, `OTHER`
- Income type: `PRODUCT`, `SERVICE`, `SUBSCRIPTION`, `CONSULTING`, `OTHER`

These sets are mirrored in the Prisma seed data to keep application code aligned with the enforced constraints.

### Computed columns

Computed fields are implemented using SQLite generated columns:

- `Invoice.taxAmount` and `Invoice.totalAmount`
- `Income.netAmount`
- `Expense.totalWithTax`

These values are automatically derived by the database and never need to be supplied by application code.

## Prisma workflow

The project exposes the typical Prisma workflows via npm scripts:

- `npm run prisma:migrate` &mdash; Run `prisma migrate dev`
- `npm run prisma:migrate:deploy` &mdash; Run `prisma migrate deploy`
- `npm run prisma:generate` &mdash; Regenerate the Prisma client
- `npm run db:seed` &mdash; Seed the database with development data

Prisma client generation also runs automatically on `npm install` thanks to the `postinstall` hook.

## Extending to other databases

To target another relational database (e.g. PostgreSQL, MySQL):

1. Update `.env` with the new connection string (e.g. `DATABASE_URL="postgresql://..."`).
2. Change the `provider` in `prisma/schema.prisma` to match the new database (e.g. `provider = "postgresql"`).
3. Replace the generated column syntax in any new migrations with an equivalent expression supported by the target database.
4. Run `npx prisma migrate dev --name <migration-name>` to generate and apply a new migration for the target database. For production environments use `npx prisma migrate deploy`.
5. Execute `npm run db:seed` to populate the database (modify the seed script as required for provider-specific behaviour).

> **Tip:** For multi-environment support, use separate `.env` files (e.g. `.env.local`, `.env.production`) and leverage Prisma's `--schema` flag or `SCHEMA` env overrides as part of your deployment pipeline.

## Development database resets

During local development you can reset the database (dropping data and reapplying migrations) with:

```bash
npx prisma migrate reset
```

This command is interactive and will automatically rerun the seed script after recreating the schema.
