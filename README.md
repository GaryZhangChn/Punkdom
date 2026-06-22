# Punkdom

Punkdom v0.1 是一个本地优先的 AI 创作工作台。当前版本基于 [alfredxw/nova](https://github.com/alfredxw/nova) 的 `8e4528c48875e0fdaacc5548b1b2ad197259fff6` 快照深度改名复刻，用作 Punkdom 后续产品迭代的初始基线。

v0.1 保留 Nova 的现有功能行为：写作模式、互动模式、结构化资料库、创作 Agent、Skills、自动化、版本管理、小说导入、角色卡导入、设置和本地 workspace 管理。

## Quick Start

需要 Go 1.26+、Node.js 20+ 和 pnpm。

```bash
corepack enable
./bootstrap.sh
```

默认地址：

- 前端：`http://localhost:5173`
- 后端：`http://localhost:8080`

指定作品目录启动：

```bash
./punkdom --workspace /path/to/your-workspace
```

## Configuration

Punkdom 使用 OpenAI 兼容接口，可通过环境变量快速配置：

```bash
export OPENAI_API_KEY="your-api-key"
export OPENAI_BASE_URL="https://api.deepseek.com"
export OPENAI_MODEL="deepseek-v4-pro"
```

常用 Punkdom 环境变量：

```bash
export PUNKDOM_WORKSPACE="/path/to/your-workspace"
export PUNKDOM_DIR="./.punkdom"
export PUNKDOM_SKILLS_DIR="./skills"
export PUNKDOM_WEB_DIR="./web"
export PUNKDOM_BACKEND_PORT="8080"
export PUNKDOM_FRONTEND_PORT="5173"
```

配置文件使用 `punkdom_dir` 指定 Punkdom 数据目录。用户级和工作区级配置会忽略该启动级定位参数。

## Workspace

新建工作区默认结构：

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

`.punkdom/` 保存 Punkdom 的本地创作状态，例如资料库、会话、自动化、运行记录和工作区配置。

## Development

启动前后端：

```bash
./bootstrap.sh
```

仅启动前端或后端：

```bash
./bootstrap.sh fe
./bootstrap.sh be
```

构建：

```bash
./build.sh
```

## Attribution

Punkdom v0.1 is derived from Nova by alfredxw. See [NOTICE](./NOTICE) for attribution details. The upstream project is licensed under Apache-2.0, and this repository preserves the license in [LICENSE](./LICENSE).
