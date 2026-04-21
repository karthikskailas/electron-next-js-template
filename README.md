# Electron + Next.js Template

A minimal, opinionated template for building cross-platform desktop applications with Electron and Next.js. Designed with clear separation of concerns, strict type safety, and a developer workflow that stays fast as your project grows.

**Electron 35 · Next.js 16 · React 19 · TypeScript 5 · Tailwind CSS 4**

---

## Why This Template

Building an Electron app with a modern React framework introduces complexity around process boundaries, type safety, and build tooling. This template solves those problems upfront:

- **Process isolation done right** — The main process and renderer never share runtime code. Communication happens exclusively through typed IPC channels, with a strict preload bridge enforcing the boundary.
- **Single source of truth for types** — A shared module defines the exact shape of every IPC message and the API surface exposed to the renderer. Change it once, get type errors everywhere something breaks.
- **Parallel build pipeline** — The Electron backend and Next.js frontend compile independently with different tools and different TypeScript configurations. Neither blocks the other.
- **Security by default** — Context isolation is enabled, Node.js integration is disabled in the renderer, and the preload script exposes only the methods you explicitly define.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 20 or later
- npm 10 or later

### Installation

```bash
https://github.com/karthikskailas/electron-next-js-template.git my-app
cd my-app
npm install
```

### Development

```bash
npm run dev
```

This starts three processes concurrently:
1. **Next.js dev server** on port 3000 with hot reload
2. **tsup** watching the Electron source for changes
3. **Electron** loading from the dev server (waits for Next.js to be ready)

### Production Build

```bash
npm run build    # Compile everything
npm run dist     # Build + package installer for your OS
```

---

## Architecture

This template separates code into four distinct areas, each with a specific role:

### Main Process

The backend of your desktop app. Runs in Node.js with full access to the operating system — file system, native dialogs, system tray, shell commands, child processes. This is where you put anything that can't or shouldn't run in a browser context.

The entry point creates the application window and registers IPC handlers. Services are organized by domain (file operations, database access, etc.) to keep the IPC handler file thin.

**Compiled by:** tsup → outputs CommonJS to `dist-electron/`

### Preload Script

The security boundary between Node.js and the browser. It runs in a privileged context and uses Electron's `contextBridge` to expose a curated set of functions to the renderer as `window.electronAPI`.

This is intentionally restrictive. The renderer never sees `require`, `fs`, `child_process`, or any Node.js API directly. It only sees the methods you choose to expose.

### Shared Module

The contract between frontend and backend. Contains:
- **Type definitions** — The `ElectronAPI` interface defines every method available on `window.electronAPI`. Both the preload (implementing it) and the renderer (consuming it) reference the same types.
- **Channel constants** — IPC channel name strings are defined once and imported everywhere, eliminating typos and making channels searchable.

This module is included in both the main and renderer TypeScript configurations.

### Renderer

The frontend. A standard Next.js application using the App Router. React components, hooks, styles, and pages live here. It communicates with the main process exclusively through the hooks in the `hooks/` directory, which wrap `window.electronAPI` calls with loading states and error handling.

**Compiled by:** Next.js (Turbopack) → outputs static HTML/JS to `out/`

---

## TypeScript Configuration

The template uses three TypeScript configurations to enforce environment boundaries:

| Config | Purpose | Includes |
|---|---|---|
| `tsconfig.json` | Base settings shared by all environments | Path aliases, strict mode, module resolution |
| `tsconfig.main.json` | Electron backend (Node.js) | Main process, preload, shared module |
| `tsconfig.renderer.json` | Frontend (DOM + Next.js) | App pages, renderer components, shared module |

Next.js is configured to use `tsconfig.renderer.json` explicitly. This means it **will never attempt to compile** the main process or preload code, even though everything lives under `src/`.

---

## Build Pipeline

| Tool | Input | Output | Format |
|---|---|---|---|
| Next.js | App pages + renderer code | `out/` | Static HTML, JS, CSS |
| tsup (esbuild) | Main process + preload | `dist-electron/` | CommonJS |
| electron-builder | `out/` + `dist-electron/` | `dist/` | Platform installer |

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Full development environment (Next.js + tsup + Electron) |
| `npm run build` | Production build (Next.js export + tsup compile) |
| `npm run start` | Launch Electron from existing build output |
| `npm run dist` | Build and package a distributable installer |
| `npm run pack` | Build and create an unpacked app directory (for testing) |

---

## Extending the Template

### Adding a new IPC channel

Every new piece of communication between the frontend and backend follows the same four-step pattern:

1. **Define the channel name** in the shared constants file. This is the single source of truth for all channel strings.

2. **Add the method signature** to the `ElectronAPI` interface in the shared types file. This ensures type safety from preload to renderer.

3. **Implement the handler** in the main process IPC handlers file. Use `ipcMain.handle` for request/response patterns, `ipcMain.on` for fire-and-forget.

4. **Expose it in the preload script** by calling the corresponding `ipcRenderer.invoke` or `ipcRenderer.send` method.

The renderer can now call it through `window.electronAPI.yourMethod()` with full type inference.

### Adding a new page

Create a new directory and `page.tsx` inside `src/app/` following Next.js App Router conventions:

```
src/app/settings/page.tsx    →  /settings
src/app/about/page.tsx       →  /about
```

### Adding a backend service

Create a new file in the main process services directory. Import it from the IPC handlers file. Keep services focused — one file per domain (database, file system, networking, etc.).

### Modifying the window

Window configuration (size, frame, title bar style) is set in the main process entry file. The template ships with a frameless window and a custom title bar component. To switch to a native title bar, set `frame: true` in the `BrowserWindow` options and remove the `TitleBar` component from the layout.

---

## Styling

The template uses Tailwind CSS v4 with a custom theme defined directly in the global CSS file using the `@theme` directive. There is no `tailwind.config.js` — configuration is CSS-native in v4.

Custom styles are organized into CSS layers:
- `@layer base` — Global defaults (fonts, scrollbar, selection color)
- `@layer components` — Reusable class-based styles (title bar drag regions, etc.)

This layering ensures custom styles never accidentally override Tailwind utility classes.

---

## Security Model

| Setting | Value | Why |
|---|---|---|
| `contextIsolation` | `true` | Renderer runs in its own JavaScript context |
| `nodeIntegration` | `false` | No `require()`, `fs`, or Node.js globals in the renderer |
| `sandbox` | `false` | Preload needs access to `contextBridge` |

The renderer has **zero access** to Node.js. Every native operation goes through an explicit IPC handler that you define and control.

---

## Packaging

Edit `electron-builder.yml` to configure your app identity:

```yaml
appId: com.yourcompany.yourapp
productName: Your App Name
```

Run `npm run dist` to produce platform-specific installers:
- **Windows** — NSIS installer (`.exe`)
- **macOS** — DMG (`.dmg`)
- **Linux** — AppImage (`.AppImage`)

---

## Conventions

- **IPC channels** — Always add new channels to the shared constants file. Never use raw strings.
- **Type safety** — The `ElectronAPI` interface is the contract. If you add a method to the preload, add it to the interface first.
- **Services** — Keep main process logic in service files, not inline in IPC handlers.
- **Hooks** — Wrap all `window.electronAPI` calls in React hooks. Components should never reference `window.electronAPI` directly.
- **CSS layers** — Always use `@layer base` or `@layer components` for custom styles. Un-layered styles override Tailwind utilities.

---

## Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

##  License
This project is licensed under the MIT License.
