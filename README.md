# Portfolio

A self-hosted Data Engineer portfolio built with Next.js 16, Tailwind CSS v4, and MDX-driven project pages. Runs fully in Docker (Next.js, Caddy, cloudflared) with zero-downtime blue/green deploys via a shell script.

---

## Table of Contents

1. [Local Development](#1-local-development)
2. [Environment Variables](#2-environment-variables)
3. [Adding a Project](#3-adding-a-project)
4. [Production Deployment](#4-production-deployment)
   - [Prerequisites](#41-prerequisites)
   - [First-time Setup](#42-first-time-setup)
   - [Deploy](#43-deploy)
5. [Cloudflare Tunnel](#5-cloudflare-tunnel)
6. [Media Files](#6-media-files)
7. [Tech Stack](#7-tech-stack)

---

## 1. Local Development

```bash
# 1. Install dependencies
npm install

# 2. Create a local env file
cp .env.example .env.local
# Edit .env.local - set EMAIL_ENABLED=false to skip Resend during dev

# 3. Start the dev server
npm run dev
# http://localhost:3000
```

To test the exact production Docker image locally:

```bash
docker build -f docker/Dockerfile -t portfolio:local .

docker run --rm -p 3000:3000 \
  -e EMAIL_ENABLED=false \
  -e NEXT_PUBLIC_SITE_URL=http://localhost:3000 \
  -v /home/debiantreeb/portfolio/public/media:/app/public/media \
  portfolio:local
# http://localhost:3000
```

---

## 2. Environment Variables

Copy `.env.example` to `.env.production` before deploying.

| Variable | Required | Description |
|---|---|---|
| `RESEND_API_KEY` | Yes (if `EMAIL_ENABLED=true`) | API key from [resend.com](https://resend.com) |
| `RESEND_FROM_EMAIL` | Yes | Verified sender address in your Resend account |
| `RESEND_TO_EMAIL` | Yes | Your inbox - where contact form messages land |
| `EMAIL_ENABLED` | No | Set to `false` to log instead of sending (default: `true`) |
| `NEXT_PUBLIC_SITE_URL` | Yes | Your public domain, no trailing slash (e.g. `https://you.com`) |

```bash
cp .env.example .env.production
# Fill in the values
```

`.env.production` is loaded by `docker-compose.yml` at runtime and is gitignored.

---

## 3. Adding a Project

Use the scaffold script:

```bash
bash scripts/new-project.sh
```

It prompts for title, tags, URLs, etc. and creates:
- `src/content/projects/<slug>.mdx` - pre-filled frontmatter and placeholder body
- `public/media/projects/<slug>/` - media directory for the project

Then:
1. Edit the MDX file with your project description
2. Add a thumbnail: `cp your-image.jpg public/media/projects/<slug>/thumbnail.jpg`
3. Optionally add a video: `cp demo.mp4 public/media/projects/<slug>/demo.mp4`

### Frontmatter reference

```yaml
---
title: "My Project"
slug: "my-project"
description: "1-2 sentence card description."
date: "2025-06-01"
tags: ["Docker", "TypeScript"]
thumbnail: "/media/projects/my-project/thumbnail.jpg"
videoDemo: "/media/projects/my-project/demo.mp4"  # optional
repoUrl: "https://github.com/you/repo"             # optional
liveUrl: "https://example.com"                     # optional
featured: true        # shows on home page
status: "completed"   # "completed" | "in-progress" | "archived"
---
```

---

## 4. Production Deployment

### 4.1 Prerequisites

- **Docker** + the **compose** plugin (`docker compose` v2 syntax)
- **curl** (for health checks in `deploy.sh`)
- **git** initialised in this directory (used to tag Docker images)
- `.env.production` filled in (see [§2](#2-environment-variables))
- Cloudflare Tunnel credentials in `infra/.cloudflared/` (see [§5](#5-cloudflare-tunnel))

```bash
# Initialise git if you haven't already
git init && git add . && git commit -m "init"
```

No system-level Caddy install needed - it runs as a Docker container.

### 4.2 First-time Setup

Run once on a fresh server to build the image and start all services:

```bash
bash infra/caddy-setup.sh
```

What it does:
1. Generates `infra/Caddyfile` from `infra/Caddyfile.tmpl` (blue slot)
2. Builds the initial `portfolio:latest` Docker image
3. Starts all services: `caddy`, `cloudflared`, `portfolio-blue`

Verify everything is up:
```bash
docker compose -f docker/docker-compose.yml ps
curl http://localhost:3001/api/health   # should return {"status":"ok"}
```

### 4.3 Deploy

```bash
bash infra/deploy.sh
```

The script:
1. Reads the active slot from `infra/.active_port` (default: blue on 3001)
2. Builds a new Docker image tagged with the git commit SHA + timestamp
3. Starts the new (inactive) slot
4. Polls `/api/health` up to 15 times (3s apart) - if it never passes, tears down the new container and exits, leaving the old slot live
5. Generates a new `infra/Caddyfile` pointing at the new slot and reloads Caddy via `docker exec portfolio-caddy caddy reload`
6. Waits 5 seconds to drain in-flight requests
7. Stops the old slot

Dry run (prints every action without executing):
```bash
bash infra/deploy.sh --dry-run
```

### Caddy config notes

`infra/Caddyfile.tmpl` is committed to git. `infra/Caddyfile` (the generated live config) is gitignored.

- `/media/*` requests are served directly by Caddy from `/srv/media` inside the container (bind-mounted from `public/media/`). This gives native HTTP range request support (206) for video seeking without involving Next.js.
- All other requests are reverse-proxied to the active slot via Docker internal DNS (`portfolio-blue:3000` or `portfolio-green:3000`).

**Switching from Cloudflare Tunnel to direct DNS:** replace `:80` in `Caddyfile.tmpl` with your domain (e.g. `you.com`) and Caddy will provision TLS via Let's Encrypt. The two modes are mutually exclusive.

---

## 5. Cloudflare Tunnel

The tunnel routes internet traffic to the Caddy container on the internal Docker network. No ports need to be opened on your router.

All services run in the same Docker Compose network, so cloudflared reaches Caddy at `http://caddy` (Docker internal DNS).

### Setup

```bash
# 1. Install cloudflared locally (for tunnel setup only)
#    https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/local-management/create-local-tunnel/#1-download-and-install-cloudflared

# 2. Log in and create the tunnel
cloudflared tunnel login
cloudflared tunnel create portfolio

# 3. Route your domain through it
cloudflared tunnel route dns portfolio your-domain.com
cloudflared tunnel route dns portfolio www.your-domain.com

# 4. Copy the credentials JSON into the project
#    The file will be at ~/.cloudflared/<TUNNEL_ID>.json
cp ~/.cloudflared/<TUNNEL_ID>.json infra/.cloudflared/<TUNNEL_ID>.json
# infra/.cloudflared/ is gitignored - credentials are never committed

# 5. Update infra/cloudflared-config.yml
#    Replace TUNNEL_ID_HERE with your tunnel UUID

# 6. Start (or restart) the cloudflared container
docker compose -f docker/docker-compose.yml up -d cloudflared
```

---

## 6. Media Files

Media is stored at `public/media/` and bind-mounted read-only into both the Caddy container (`/srv/media`) and the Next.js containers (`/app/public/media`). The directory skeleton is tracked in git; the contents are gitignored.

```
public/media/
├── about/
│   └── avatar.png
└── projects/
    └── <slug>/
        ├── thumbnail.jpg   # project card image and MDX hero
        └── demo.mp4        # optional - referenced via videoDemo in frontmatter
```

To add media without redeploying:
```bash
cp image.jpg ~/portfolio/public/media/projects/<slug>/thumbnail.jpg
# Caddy serves it immediately - no container restart needed
```

Recommended sizes:
- Thumbnail: `1280x720` JPEG, under 200 KB
- Video: H.264 MP4, web-optimised (`ffmpeg -movflags +faststart`)

---

## 7. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript, `output: "standalone"`) |
| Styling | Tailwind CSS v4 (CSS-first, `@theme` tokens, Lightning CSS) |
| Animations | Motion v12 (import from `motion/react`) |
| Content | MDX via `next-mdx-remote/rsc` + `gray-matter` |
| Forms | `react-hook-form` + Zod v4 + `@hookform/resolvers@5` |
| Email | Resend |
| Container | Docker multi-stage, node:24-alpine, non-root user |
| Proxy | Caddy (Docker container, `docker exec` reload for zero-downtime swaps) |
| Tunnel | Cloudflare Tunnel via cloudflared Docker container |
| Deployment | Blue/green via `infra/deploy.sh` |
