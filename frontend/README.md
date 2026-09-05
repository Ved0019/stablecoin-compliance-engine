## LedgerGuard Frontend

This directory contains the Next.js dashboard for simulating and reviewing transaction compliance decisions.

### Run locally

```powershell
npm install
npm run dev
```

Open http://localhost:3000. The dashboard expects the backend at `http://127.0.0.1:8080`.

### Available scripts

- `npm run dev` starts the development server.
- `npm run build` creates a production build.
- `npm run start` serves the production build.
- `npm run lint` runs ESLint.

The main dashboard is in `src/app/page.tsx`; reusable UI components are in `src/components`.
