<div align="center">

# 🚀 Mission Control

### Executive Operations Command Center

A real-time operations dashboard built with Next.js 16, React 19, and Tailwind CSS. Monitor your business metrics, communications, intelligence, and daily operations from a single command center.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Chart.js](https://img.shields.io/badge/Chart.js-4-ff6384?logo=chart.js)](https://www.chartjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

</div>

---

## 📸 Screenshots

> _Screenshots coming soon. Run `npm run dev` to see it live!_

<!-- ![Dashboard](./docs/screenshot-dashboard.png) -->

---

## ✨ Features

Mission Control ships with **6 modular panels**, each focused on a key operational area:

| Panel | Description |
|-------|-------------|
| **📊 Business Overview** | Revenue tracking (daily/MTD/YTD), key metrics, and milestone progress bars |
| **⚙️ Operations Dashboard** | Agent status, automation monitoring, and system health (CPU/memory/storage) |
| **💬 Communication Hub** | Email stats, messaging activity, and social media metrics at a glance |
| **🔍 Intelligence Panel** | Market news, competitor alerts, opportunity pipeline, and trend tracking |
| **🎯 Command Center** | Priority actions, daily schedule, blocked items, and wins tracker |
| **📡 Activity Feed** | Real-time chronological feed of all system events and updates |

**Additional features:**
- 🌙 Dark theme optimized for focus
- 📱 Fully responsive (mobile → 4-column desktop grid)
- ⚡ Live clock and system status indicators
- 🧩 Modular — swap, remove, or add panels easily
- 📊 Chart.js integration for data visualization

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/chadgarner/mission-control.git
cd mission-control

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see Mission Control.

---

## ⚙️ Configuration

### Environment Variables

Copy the example env file and customize as needed:

```bash
cp .env.example .env.local
```

See [`.env.example`](./.env.example) for available configuration options.

### Customizing Panels

Each panel accepts a `data` prop with typed interfaces. You can:

1. **Replace default data** — Pass your own data objects to any panel component
2. **Connect to APIs** — Fetch real data in `page.tsx` and pass it down
3. **Add new panels** — Create a component in `src/components/panels/` and export it from `index.ts`
4. **Remove panels** — Simply remove the panel from the grid in `page.tsx`

### App Title

Set the `NEXT_PUBLIC_APP_TITLE` environment variable to customize the dashboard title (defaults to "Mission Control").

---

## 🏗️ Architecture

```
src/
├── app/
│   ├── page.tsx              # Main dashboard page
│   ├── layout.tsx            # Root layout with sidebar
│   ├── globals.css           # Global styles & Tailwind
│   ├── memory/page.tsx       # Memory sub-page
│   ├── logs/page.tsx         # Logs sub-page
│   └── documents/page.tsx    # Documents sub-page
├── components/
│   ├── Header.tsx            # Top bar with clock & status
│   ├── Sidebar.tsx           # Navigation sidebar
│   ├── PageHeader.tsx        # Page-level header
│   ├── ui/
│   │   └── Card.tsx          # Reusable Card, Metric, ProgressBar components
│   └── panels/
│       ├── index.ts          # Barrel export
│       ├── BusinessOverview.tsx
│       ├── OperationsDashboard.tsx
│       ├── CommunicationHub.tsx
│       ├── IntelligencePanel.tsx
│       ├── CommandCenter.tsx
│       └── ActivityFeed.tsx
```

Each panel is a self-contained component with:
- TypeScript interfaces for its data shape
- Sensible default demo data
- Accepts optional `data` prop for real integrations

---

## 🚢 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/chadgarner/mission-control)

### Docker

```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

### Static Export

```bash
# Add to next.config.ts: output: 'export'
npm run build
# Deploy the `out/` directory to any static host
```

---

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./.github/CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [OpenClaw](https://openclaw.com) 🐾
- Powered by [Next.js](https://nextjs.org), [React](https://react.dev), and [Tailwind CSS](https://tailwindcss.com)
- Icons by [Lucide](https://lucide.dev)
