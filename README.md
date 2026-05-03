# Kato.8 Studios — HR Command Center

Internal HR platform for Kato.8 Studios. Built for a revenue-share team operating out of Mission Hills, CA.

## Stack

- **React 18** + **Vite** — fast, modular frontend
- **React Router** — client-side navigation
- **CSS Modules** — scoped styling, zero runtime
- **No external UI library** — custom design system matching the studio aesthetic

## Features

| Module | Description |
|--------|-------------|
| Dashboard | Metrics, priority tasks, EA agent banner, integration status |
| People | Team roster, revenue share status, department filtering |
| Org Chart | Full studio org with open roles flagged |
| Documents | Vault of all templates and signed agreements |
| Compliance | 20-item CA compliance checklist, filterable, trackable |
| Hiring | Open roles pipeline (Notion-based, no ATS subscription) |
| Onboarding | Phase-by-phase workflow with EA triggers, progress tracking |
| Integrations | Setup guide for DocuSign, Google Drive, Discord, Notion, EA Agent |
| EA Agent | Quick commands and automated workflow status |

## Integrations

| Service | Status | Purpose |
|---------|--------|---------|
| DocuSign | ✅ Active | Revenue Share, IP Assignment, NDA signing |
| Google Drive | ✅ Active | HR document storage |
| Google Calendar | ✅ Active | Scheduling, compliance deadlines |
| Discord | 🔧 Setup needed | Team comms, #hr-ops notifications |
| EA Agent | ✅ Active | AI automation across all modules |
| Notion | 🔧 Setup needed | Hiring pipeline (replaces Greenhouse) |

## Important notes

- **No payroll module** — team is currently on revenue share only. Gusto/ADP integration will be added when transitioning to W-2 employees.
- **No Greenhouse** — hiring pipeline runs through Notion at current team size (3 open roles).
- **Primary comms: Discord** — all HR notifications route to Discord, not Slack.
- **DocuSign documents already set up**: Revenue Share Agreement, IP Assignment, NDA, Offer Letter Template.

## Getting started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output goes to `dist/`. Deploy to Vercel, Netlify, or any static host.

## Folder structure

```
src/
  components/     # Shared UI components (Sidebar, UI primitives)
  data/           # Studio data — team, compliance, integrations
  pages/          # One file per module
  App.jsx         # Root router
  index.css       # Global styles + CSS variables
```

## EA Agent integration

The EA agent connects via the Anthropic API. To wire up automated workflows:

1. **DocuSign webhook** → `POST /api/ea/docusign-event` — fires when documents are signed
2. **Discord webhook** → set `DISCORD_WEBHOOK_URL` env var for #hr-ops notifications
3. **Google Drive** — already connected via MCP

See `/src/pages/EAAgent.jsx` for the full list of EA workflows.
