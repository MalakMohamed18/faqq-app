FROM node:20-bookworm-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build


FROM node:20-bookworm-slim AS runtime

ENV NODE_ENV=production \
    NODE_OPTIONS=--enable-source-maps

RUN apt-get update \
    && apt-get install -y --no-install-recommends poppler-utils ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && useradd --system --create-home --uid 1001 appuser

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev \
    && npm pkg delete type \
    && npm cache clean --force

COPY --from=build /app/dist ./dist

RUN chown -R appuser:appuser /app
USER appuser

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT || 4000) + '/health').then(r => { if (!r.ok) process.exit(1) }).catch(() => process.exit(1))"

CMD ["node", "dist/server.js"]