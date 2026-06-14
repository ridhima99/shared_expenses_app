# Shared Expenses Application

A production-ready shared expenses management application for flatmates and groups.

## Features

- **Authentication**: Register, Login, Logout with protected routes
- **Groups**: Create groups, invite/remove members, track membership timelines
- **Expense Management**: Create expenses with multiple split types (Equal, Percentage, Share, Exact)
- **Settlements**: Record payments and settle balances
- **Currency Support**: INR, USD with automatic conversion
- **CSV Import**: Robust import engine with anomaly detection
- **Balance Calculation**: Full accounting engine respecting membership timelines
- **Settlement Optimization**: Splitwise-style debt simplification

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- PostgreSQL (Neon)
- Prisma ORM
- Auth.js (NextAuth)
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod

## Quick Start

```bash
npm install
cp .env.example .env
# Edit .env with your Database URL
npm run db:push
npm run dev
```

## Deployment

Deploy to Vercel with Neon PostgreSQL.

## License

MIT