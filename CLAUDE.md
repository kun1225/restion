# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Restion is a flexible focus timer application that uses dynamic rest calculation based on focus time ratios. It's a monorepo with three main packages:

- `frontend/` - Nuxt 4 Vue 3 application using shadcn-vue UI components
- `backend/` - Node.js Express API with PostgreSQL database using Knex.js  
- `shared/` - TypeScript shared types and configurations for both frontend and backend

## Development Commands

### Frontend (Nuxt 4)
```bash
cd frontend
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm run test         # Run Vitest tests
npm run test:watch   # Run tests in watch mode
npm run lint         # ESLint with auto-fix
npm run shared:build # Build shared package
```

### Backend (Node.js + Express)
```bash
cd backend
npm run dev          # Start with nodemon (http://localhost:3001)
npm run build        # TypeScript compilation
npm run migrate      # Run database migrations
npm run seed         # Run database seeds
npm run test         # Run Jest tests
npm run test:watch   # Run tests in watch mode
npm run test:unit    # Run unit tests only
npm run test:integration # Run integration tests only
npm run lint         # ESLint with auto-fix
npm run docker:dev   # Start with Docker Compose
```

### Shared Package
```bash
cd shared
npm run build        # Build shared types with tsup
```

## Architecture

### Database (PostgreSQL + Knex.js)
- Users table with authentication
- JWT token management with refresh tokens and revocation
- Database migrations in `backend/migrations/`
- Knex configuration in `backend/knexfile.ts`

### Authentication System
- JWT-based authentication with access/refresh token rotation
- Access tokens: 15min expiry, stored in frontend memory
- Refresh tokens: 7 days expiry, stored in HttpOnly cookies
- Token revocation blacklist system
- Auto-cleanup of expired tokens

### Frontend Architecture
- Nuxt 4 with Vue 3 Composition API
- shadcn-vue + Reka UI components
- Tailwind CSS for styling
- Pinia for state management
- VueUse for composables
- Auto-imports enabled for components and composables

### Shared Types
- Centralized TypeScript types in `shared/src/types/`
- Built with tsup for dual CJS/ESM exports
- Used by both frontend and backend via `@restion/shared`

## Key Features

- **Dynamic Focus Timer**: Focus time ÷ ratio = rest time (no preset durations)
- **Custom Reminders**: Interval reminders without interrupting timer
- **Media Upload**: Background music (MP3/AAC/WAV ≤20MB) and images (JPG/PNG/WebP ≤5MB)
- **Statistics**: Daily/weekly/monthly focus tracking with charts
- **Team Collaboration**: Task assignment and project time tracking
- **Multi-language Support**: Chinese and English

## Testing

Using TDD development approach: write tests first, then implement the code.

### Frontend
- Vitest for unit and component tests
- Tests in `frontend/tests/`
- Run with: `npm run test`

### Backend  
- Jest with Supertest for API testing
- Separate unit and integration test suites
- Test database configuration in knexfile.ts
- Tests in `backend/tests/`
- Run with: `npm run test`

## File Structure Notes

- Use PascalCase for Vue components (e.g., `TimerControls.vue`)
- Use camelCase for composables (e.g., `useTimer.ts`)
- Follow Nuxt 3 auto-import conventions
- Shared types are exported from `@restion/shared`

## Database Management

```bash
# Run migrations
npm run migrate

# Rollback migrations  
npm run migrate:rollback

# Seed database
npm run seed
```

## Important Patterns

- Use `<script setup>` syntax for Vue components
- Prefer Composition API over Options API
- Use VueUse composables for common utilities
- Authentication middleware in `backend/src/middleware/auth.ts`
- Frontend auth store in `frontend/stores/auth.ts`
- API routes follow REST conventions under `/api/auth/`

## Code Style

- Use ES modules (import/export) syntax, not CommonJS (require)
- Destructure imports when possible (eg. import { foo } from 'bar')
- Use `@restion/shared` for shared types
****