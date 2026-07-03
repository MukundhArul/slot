<p align="center">
  <img src="public/logo.svg" alt="SLOT Logo" width="100"/>
</p>

<h1 align="center">SLOT</h1>

<p align="center">
  <strong>A highly interactive, time management application with a strict Retro Sci-Fi terminal aesthetic.</strong>
</p>

## Overview

**SLOT** is a modern calendar and time-blocking tool wrapped in a brutalist, retro-futuristic terminal UI. It features a drag-and-drop grid system allowing you to effortlessly organize your day or week.

## Features

- **Retro Terminal UI**: Sharp edges, Geist Mono typography, and high-contrast styling.
- **Drag & Drop**: Seamlessly move time blocks across days and hours using `@dnd-kit`.
- **Resizable Blocks**: Intuitively extend or shorten tasks in 15-minute intervals.
- **Dynamic Grid**: Fluid switching between Day and Week views.
- **Task Management**: Edit tasks, assign legacy color tags, and manage your schedule via a terminal-styled modal.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Drag & Drop**: [dnd-kit](https://dndkit.com/)
- **Dates**: [date-fns](https://date-fns.org/)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application in action.

## Future Roadmap

- Natural Language Processing (NLP) integration for smart task creation.
- Database persistence for tasks.
- Authentication system.
