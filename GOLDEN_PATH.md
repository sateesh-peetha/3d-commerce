# Golden Path - One Command Run

## Prerequisites
- Node.js 18+
- Firebase CLI (`npm install -g firebase-tools`)

## Quick Start

```bash
# Install dependencies
npm install

# Start local development (Firebase emulators + Vite)
npm run start:local
```

## Run All Tests

```bash
# Unit tests (Vitest)
npm run test

# E2E tests (Playwright)
npm run test:e2e

# Security tests (Playwright)
npm run test:security

# All tests
npm run test:all
```

## Demonstrate End-to-End

1. **Upload File**: Navigate to `/upload`, drop a `.stl` file
2. **Configure**: Select material, color, adjust settings
3. **Add to Cart**: Click "Add to Cart"
4. **Checkout**: Login → Fill shipping → Mock payment
5. **Confirmation**: See order confirmation page
6. **Admin View**: Login as admin → `/admin` → See order in queue
7. **AI Layout**: Enter prompt "Make dashboard compact" → Apply change
8. **Verify**: Refresh page → Layout change persists

## Project Structure

```
src/
├── api/          # API client + AI layout service
├── components/   # React component stubs
├── hooks/        # Custom hooks
├── pages/        # Screen compositions
└── types/        # TypeScript types

outputs/golden/   # Agent execution artifacts
tests/
├── unit/         # Pricing tests (Vitest)
├── e2e/          # Golden path flows (Playwright)
└── security/     # Security tests (Playwright)
```

## Success Criteria

- [ ] User uploads file → configures → places order
- [ ] User sees order confirmation
- [ ] Admin sees order in dashboard
- [ ] Admin changes layout via AI prompt
- [ ] Layout change persists on refresh
- [ ] All tests pass
