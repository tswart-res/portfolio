# syntax=docker/dockerfile:1
# Multi-stage build for Next.js standalone output.
# Final image is ~100 MB instead of ~1 GB because only the standalone
# runtime is copied - node_modules are not needed at runtime.

ARG NODE_VERSION=24

# ── Stage 1: Install production dependencies ────────────────────────────────
FROM node:${NODE_VERSION}-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# ── Stage 2: Build the Next.js app ──────────────────────────────────────────
FROM node:${NODE_VERSION}-alpine AS builder
WORKDIR /app

# Suppress telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# ── Stage 3: Production runtime ─────────────────────────────────────────────
FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# Non-root user for least-privilege execution
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Copy standalone output + static assets
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# public/ is copied except media/ (volume-mounted at runtime)
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Remove media dir from image - it will be bind-mounted from the host
RUN rm -rf ./public/media

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
