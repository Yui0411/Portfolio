# syntax=docker/dockerfile:1

# ============================================================
# Stage 1 — deps: install dependencies only.
# Kept separate so this slow step is cached and only re-runs
# when package.json / package-lock.json change.
# ============================================================
FROM node:22-alpine AS deps
WORKDIR /app
# .npmrc carries our legacy-peer-deps setting so `npm ci` resolves cleanly.
COPY package.json package-lock.json .npmrc ./
RUN npm ci

# ============================================================
# Stage 2 — builder: compile the Next.js app.
# ============================================================
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* values are inlined into the build (client + server), so they
# must be present at build time. These are PUBLIC (URL + publishable key) and
# safe to bake into the image. The secret service-role key is NOT here — it is
# only ever provided at runtime.
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_TRACK_URL
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_TRACK_URL=$NEXT_PUBLIC_TRACK_URL
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ============================================================
# Stage 3 — runner: the tiny final image that actually ships.
# Carries only the standalone server output + static assets.
# ============================================================
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Run as a non-root user for safety.
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Copy the traced standalone server, static assets, and public files.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# The container listens on 3000; Nginx will proxy to it.
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Start the standalone Next.js server.
CMD ["node", "server.js"]
