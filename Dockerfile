# Cloud Run: Website builder SPA (/website-builder/) + Koa CMS (/cms-api).
# Deploy separately; set SYNC_APP_ORIGIN on the portfolio Website service to this URL.

FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-bookworm-slim
RUN apt-get update \
    && apt-get install -y --no-install-recommends nginx gettext-base \
    && rm -rf /var/lib/apt/lists/* \
    && rm -f /etc/nginx/sites-enabled/default

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY cms ./cms
COPY public ./public

COPY --from=build /app/dist /usr/share/nginx/html/website-builder

COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENV PORT=8080 \
    NODE_ENV=production \
    LAYOUT_PATH=/var/cms-layout/layout.json \
    PYTHONDONTWRITEBYTECODE=1

EXPOSE 8080
ENTRYPOINT ["/docker-entrypoint.sh"]
