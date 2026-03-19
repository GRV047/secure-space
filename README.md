# SecureSphere

A security scanning dashboard built with React, Vite, and TypeScript. Provides a dark-themed UI for managing DAST (Dynamic Application Security Testing) scans, viewing scan results, and triaging discovered vulnerabilities.

> **Note:** This is a POC / prototype. All data is mock/static — no real backend is connected.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build tool | Vite 5 |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS 3 |
| Charts | Recharts |
| Date picker | react-day-picker v9 |
| Icons | lucide-react |

---

## Features

- **Authentication** — Login / Signup screens with session state. Browser back to the login screen clears the session; forward is blocked without re-authenticating.
- **Scan Setup** — Form to configure a new DAST scan (name, URL, excluded domains as removable tags). Supports editing an existing scan.
- **Scans List** — Table of all scans with status badges, issue counts, and a context-aware action dropdown:
  - Active scans (`In-Progress`, `Initialized`) → Pause, Edit
  - Inactive scans → Rerun, Edit, Delete
- **Scan Dashboard** — Per-scan detail view with two tabs:
  - **Overview** — vulnerability count cards, severity chart, visited pages, tested elements, scan details, timeline, execution log
  - **Issues** — searchable/filterable issue table with severity, status, date-range filter (all inside a single Filters panel)
- **Manage scan** dropdown — context-aware:
  - Active scan → Cancel, Pause, Edit
  - Inactive scan → Restart, Edit
- **Code splitting** — `React.lazy` + `Suspense` for all authenticated pages (faster initial load)

---

## Project Structure

```
src/
├── App.tsx                  # Root — routing, auth state, history API
├── main.tsx
├── types/
│   ├── scanList.types.ts    # ScanEntry, ScanStatus
│   └── issue.types.ts       # Issue, IssueFilters, Severity, IssueStatus
├── mock/
│   ├── scans.mock.ts        # In-memory mutable scan store
│   └── issues.mock.ts       # Static issue seed data
├── services/
│   ├── scanListService.ts   # getScans, addScan, deleteScan, rerunScan, updateScan
│   └── issueService.ts
├── hooks/
│   ├── useScans.ts
│   ├── useIssues.ts
│   ├── useScanOverview.ts
│   ├── useScanTimeline.ts
│   ├── useSeverityData.ts
│   └── useExecutionLog.ts
├── pages/
│   ├── LoginPage.tsx
│   ├── SignupPage.tsx
│   ├── SetupPage.tsx        # Create / Edit scan form
│   ├── ScansPage.tsx        # Scan list table
│   └── ScanDashboard.tsx   # Overview + Issues tabs
└── components/
    ├── layout/              # Sidebar, AppLayout
    ├── ui/                  # Tabs, DatePickerButton, etc.
    ├── setup/               # ScanSetupForm
    ├── scans/               # ScanListTable
    ├── overview/            # Cards, charts, timeline, log
    └── issues/              # IssueTable, IssueFilterPanel, IssueSearchBar, ExportButton
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install & run

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`.

### Other commands

```bash
npm run build    # TypeScript compile + Vite production build
npm run preview  # Preview production build locally
npm run lint     # ESLint
```

---

## Architecture Notes

- **No react-router-dom** — routing is state-based (`page` state in `App.tsx`) with `window.history.pushState` / `replaceState` for real browser back/forward support.
- **Mock data layer** — components never import mock files directly. Data flows: `mock/*.mock.ts` → `services/*.ts` → `hooks/*.ts` → components.
- **Scan status** — `'Queued' | 'Initialized' | 'In-Progress' | 'Completed'`. Active statuses (`In-Progress`, `Initialized`) drive context-aware UI in both the scan list and dashboard.
