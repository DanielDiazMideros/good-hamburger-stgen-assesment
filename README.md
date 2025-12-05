# Good Hamburger — Next.js (STGEN)

A small ordering UI that lists sandwiches and extras, lets the user filter the menu, add items to a cart, applies discounts, and submits orders (no payment required). Data is stored for the user session (sessionStorage).

---

## Technologies & Frameworks

- **Next.js** (React) — App Router
- **TypeScript**
- **Material UI (MUI)** — UI components + theme customization
- **Vitest** + **React Testing Library** — unit/component tests
- **Bun** (optional) — package manager/runtime (works with Node.js too)

---

## Features (Requirements)

- Display **all sandwiches and extras**
- Filters:
  - **All**
  - **Sandwiches only**
  - **Extras only**
- Add items to the cart (1 per slot: sandwich / fries / soft drink)
- Display cart contents
- Submit order:
  - Requires **customer name**
  - Shows **final total payment** (discount applied when applicable)
- Display all submitted orders
- Clean, professional, mobile-friendly layout
- Simulated **1-second network delay** when fetching menu data (+ “Loading...” UI)

---

## Project Structure (high level)

- `src/app/` — Next.js pages/layout (App Router)
- `src/components/` — UI components (menu/cart/orders)
- `src/domain/` — domain logic (types, pricing/discount calculation)
- `src/services/` — data fetching (menu mock service + delay)
- `src/data/menu.json` — sample menu data
- `src/utils/` — utilities (formatting, session storage hook, test helpers)

---

## Setup

### Prerequisites

- **Node.js 18+** (recommended: 20+)
- or **Bun** latest

### Install dependencies

Using **bun**:

```bash
bun install
```

Using **npm**:

```bash
npm install
```

### Run (development)

Using **bun**:

```bash
bun run dev
```

Using **npm**:

```bash
npm run dev
```

### Tests

Using **bun**:

```bash
bun run test
```

Using **npm**:

```bash
npm run test
```

### Open in browser

- http://localhost:3000 (default with bun)

### Build & Run (production)

Using **bun**:

```bash
bun run build
bun run start
```

Using **npm**:

```bash
npm run build
npm run start
```
