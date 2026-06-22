# Punkdom

Punkdom v0.1 is a local-first AI creative workspace. This version is a deeply renamed functional replica of [alfredxw/nova](https://github.com/alfredxw/nova) at commit `8e4528c48875e0fdaacc5548b1b2ad197259fff6`, used as the initial baseline for future Punkdom development.

v0.1 keeps Nova's existing behavior: Writing Mode, Interactive Mode, structured lore, creative Agents, Skills, automations, version management, novel import, character-card import, settings, and local workspace management.

## Quick Start

Requirements: Go 1.26+, Node.js 20+, and pnpm.

```bash
corepack enable
./bootstrap.sh
```

Default URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`

Start with a workspace:

```bash
./punkdom --workspace /path/to/your-workspace
```

## Configuration

Punkdom uses an OpenAI-compatible API:

```bash
export OPENAI_API_KEY="your-api-key"
export OPENAI_BASE_URL="https://api.deepseek.com"
export OPENAI_MODEL="deepseek-v4-pro"
```

Common Punkdom environment variables:

```bash
export PUNKDOM_WORKSPACE="/path/to/your-workspace"
export PUNKDOM_DIR="./.punkdom"
export PUNKDOM_SKILLS_DIR="./skills"
export PUNKDOM_WEB_DIR="./web"
export PUNKDOM_BACKEND_PORT="8080"
export PUNKDOM_FRONTEND_PORT="5173"
```

Use `punkdom_dir` in `config.toml` for the startup-level Punkdom data directory. User-level and workspace-level settings ignore this locator field.

## Workspace

New workspaces use this default structure:

```text
my-project/
├── CREATOR.md
├── ideas.md
├── chapters/
├── setting/
│   ├── progress.md
│   ├── character-states.md
│   └── chapter-groups/
├── drafts/
└── .punkdom/
    ├── lore/
    └── sessions/
```

`.punkdom/` stores local creative state such as lore, sessions, automations, run traces, and workspace configuration.

## Development

Start both frontend and backend:

```bash
./bootstrap.sh
```

Start only one side:

```bash
./bootstrap.sh fe
./bootstrap.sh be
```

Build:

```bash
./build.sh
```

## Attribution

Punkdom v0.1 is derived from Nova by alfredxw. See [NOTICE](./NOTICE) for attribution details. The upstream project is licensed under Apache-2.0, and this repository preserves the license in [LICENSE](./LICENSE).
