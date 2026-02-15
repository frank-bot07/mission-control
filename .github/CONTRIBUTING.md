# Contributing to Mission Control

Thanks for your interest in contributing! Here's how to get started.

## Development Setup

```bash
git clone https://github.com/chadgarner/mission-control.git
cd mission-control
npm install
npm run dev
```

## Guidelines

- **TypeScript** — All new code should be fully typed
- **Components** — Follow the existing panel pattern (typed interfaces, default data, optional `data` prop)
- **Styling** — Use Tailwind utility classes; follow the existing dark theme palette
- **Commits** — Use clear, descriptive commit messages
- **PRs** — One feature/fix per PR; include a description of what changed and why

## Adding a New Panel

1. Create `src/components/panels/YourPanel.tsx`
2. Define a TypeScript interface for the panel's data
3. Provide sensible default demo data
4. Export from `src/components/panels/index.ts`
5. Add to the grid in `src/app/page.tsx`

## Code Style

- Run `npm run lint` before submitting
- Follow existing patterns for consistency

## Questions?

Open an issue or start a discussion. We're happy to help!
