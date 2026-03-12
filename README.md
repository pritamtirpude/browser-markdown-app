# Browser Markdown Editor

A modern, browser-based Markdown editor with live preview, persistent documents, Mermaid diagram support, syntax highlighting, and multi-format export — installable as a PWA.

---

## Table of Contents

- [Browser Markdown Editor](#browser-markdown-editor)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
    - [Features](#features)
    - [Screenshots](#screenshots)
    - [Links](#links)
  - [Tech Stack](#tech-stack)
  - [Architecture Overview](#architecture-overview)
  - [Process \& Implementation Details](#process--implementation-details)
    - [1. Markdown Pipeline](#1-markdown-pipeline)
    - [2. Document Persistence (Dexie)](#2-document-persistence-dexie)
    - [3. State Management](#3-state-management)
    - [4. Export System](#4-export-system)
    - [5. Keyboard Shortcuts \& Command Palette](#5-keyboard-shortcuts--command-palette)
    - [6. Animation System](#6-animation-system)
    - [7. Theme Support](#7-theme-support)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Development](#development)
    - [Build](#build)
  - [PWA \& Offline Capabilities](#pwa--offline-capabilities)
  - [Key Learnings](#key-learnings)
  - [Resources](#resources)
  - [Author](#author)

---

## Overview

Browser Markdown Editor provides a focused writing experience with real-time preview, full GFM support, Mermaid diagram rendering, and per-document persistence via IndexedDB. Documents are identified by URL so they are deep-linkable and survive page reloads.

### Features

- Live split-pane editor and rendered preview
- GitHub Flavored Markdown (GFM) — tables, strikethrough, task lists
- Mermaid diagram rendering (flowcharts, pie charts, sequence diagrams, etc.)
- Syntax highlighting via `rehype-starry-night`
- Persistent documents stored in IndexedDB (Dexie) — no backend required
- Export to raw Markdown (`.md`), Styled HTML, or PDF
- Keyboard shortcuts: `Ctrl+S` save, `N` new, `D` delete, with a command palette overlay
- Animated sidebar, transitions, and splash screen (Motion)
- Light / Dark theme
- Installable Progressive Web App (offline shell via Vite Plugin PWA)

### Screenshots

![Preview One](/public/screenshot-wide-one.png)
![Preview Two](/public/screenshot-wide-two.png)

### Links

- Live: https://browser-markdown-app.vercel.app/
- Repo: https://github.com/pritamtirpude/browser-markdown-app

---

## Tech Stack

| Layer            | Choice                             | Notes                                             |
| ---------------- | ---------------------------------- | ------------------------------------------------- |
| Build Tool       | Vite + React Compiler              | Fast HMR, automatic memoization via compiler      |
| UI               | React 19 + TypeScript              | Type safety, component reusability                |
| Styling          | Tailwind CSS v4                    | Utility-first, co-located theme tokens            |
| State            | Zustand                            | Minimal global state for editor & navbar          |
| Persistence      | Dexie (IndexedDB)                  | Structured offline-capable document storage       |
| Markdown         | unified / remark / rehype pipeline | Extensible AST-based processing                   |
| Diagrams         | Mermaid                            | Client-side diagram rendering via custom plugin   |
| Syntax Highlight | rehype-starry-night                | Theme-aware code block highlighting               |
| Animations       | Motion (motion/react)              | Spring-based transitions, AnimatePresence         |
| Hotkeys          | @tanstack/react-hotkeys            | Declarative keyboard shortcut binding             |
| Icons            | lucide-react                       | Consistent scalable iconography                   |
| PWA / SW         | Vite Plugin PWA                    | Auto service worker + manifest, precache strategy |

---

## Architecture Overview

```
src/
  components/   -> UI: Editor, MarkdownPreview, Sidebar, Navbar, CommandPalette, DownloadDropdown, ...
  hooks/        -> useMarkdownParams (URL sync), useClickOutside
  store/        -> Zustand slices (markdownStore, navbarStore)
  indexeddb/    -> Dexie schema + CRUD helpers
  util/         -> markdown pipeline, export (HTML/PDF/MD), misc helpers
```

Core flow:

1. App mounts → splash screen displayed → Dexie loads default document if no `id` param.
2. Editor writes to `markdownStore`; save commits to Dexie and updates URL param.
3. `renderMarkdown` runs the unified pipeline on every content change → preview updates live.
4. Export functions pull from the store and produce `.md`, styled HTML, or a print-to-PDF.

---

## Process & Implementation Details

### 1. Markdown Pipeline

I assembled a `unified` pipeline with `remark-parse` → `remark-gfm` → `remark-rehype` → `rehype-raw` → `rehype-starry-night` → `rehype-mermaid` (custom) → `rehype-slug` → `rehype-sanitize` → `rehype-stringify`. A custom sanitize schema allows Mermaid `<pre class="mermaid">` nodes through without opening XSS vectors.

### 2. Document Persistence (Dexie)

`MarkdownEditorDB` holds two tables: `documents` (user-created) and `defaultDocument` (seeded on first populate). Documents carry `id`, `title`, `content`, and `createdAt`. The default document is populated once via Dexie's `populate` hook so repeat visits retain edits.

### 3. State Management

Two Zustand slices keep concerns separate:

- `markdownStore` — active content, filename, document ID, preview toggle, saving flag
- `navbarStore` — hamburger open/close, download dropdown, command palette visibility

This avoids prop drilling while keeping each slice small and testable.

### 4. Export System

Three export paths share a common `triggerDownload` helper:

- **Markdown** — raw `.md` blob download.
- **Styled HTML** — full standalone HTML file with embedded CSS variables for light/dark themes, print styles included.
- **PDF** — triggers `window.print()` against the rendered preview (print-specific CSS hides the editor chrome).

### 5. Keyboard Shortcuts & Command Palette

`@tanstack/react-hotkeys` binds `Ctrl+S`, `N`, and `D` globally. A command palette overlay lists all bindings and is toggled from the navbar, giving mouse users the same discoverability.

### 6. Animation System

Motion's `AnimatePresence` wraps the Sidebar, SplashScreen, SavingScreen, and dropdown overlays. The sidebar slides the main content pane via a `motion.div` `x` transform rather than CSS margin to keep animations GPU-composited.

### 7. Theme Support

Dark/light mode uses Tailwind's `dark:` variant driven by a `ThemeProvider` context. Exported HTML mirrors this with `prefers-color-scheme` media queries plus an explicit `data-theme` attribute override so exported documents respect the editor's current theme.

---

## Getting Started

### Prerequisites

- Node 18+

### Installation

```bash
git clone https://github.com/pritamtirpude/browser-markdown-editor
cd browser-markdown-editor
npm run setup   # installs Motion Plus dependency
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
npm run preview
```

---

## PWA & Offline Capabilities

| Aspect           | Details                                                                     |
| ---------------- | --------------------------------------------------------------------------- |
| Manifest         | App name, short name, theme color `#1d1f22`, standalone display, icon set   |
| Service Worker   | Auto-generated by Vite Plugin PWA; precaches static assets                  |
| Install Prompt   | Browser-native (Chrome/Edge); installable on desktop & mobile               |
| Offline Shell    | Core HTML/CSS/JS available offline; documents load from IndexedDB           |
| Caching Strategy | Static assets precached; no stale document risk since Dexie is always local |

---

## Key Learnings

- A `unified` pipeline is highly composable — inserting a custom rehype plugin (Mermaid) required only adding a transform step without touching the rest of the chain.
- Sanitizing HTML after allowing raw HTML pass-through requires an explicit extended schema; otherwise custom classes (like `mermaid`) are stripped before client render.
- Separating `markdownStore` from `navbarStore` prevents unrelated re-renders when the sidebar opens.

---

## Resources

- unified: https://unifiedjs.com/
- Mermaid: https://mermaid.js.org/
- Dexie: https://dexie.org/
- Tailwind CSS v4: https://tailwindcss.com/
- Motion: https://motion.dev/
- Vite Plugin PWA: https://vite-pwa-org.netlify.app/

---

## Author

- Frontend Mentor: https://www.frontendmentor.io/profile/pritamtirpude
- GitHub: https://github.com/pritamtirpude
- Twitter: https://x.com/ptirpude1991
