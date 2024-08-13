FROM amd64/node:18-alpine AS base

RUN apk add --no-cache libc6-compat
RUN addgroup --system --gid 1001 dealbase
RUN adduser --system --uid 1001 web

FROM base AS dev-base

ENV NODE_ENV development

FROM dev-base AS deps

WORKDIR /app

COPY pnpm-lock.yaml package.json pnpm-workspace.yaml nx.json ./
COPY /apps/web/package.json ./apps/web/package.json
COPY /packages/ ./packages/

RUN npm i -g pnpm
RUN pnpm fetch
RUN pnpm install -r --frozen-lockfile

FROM deps as test-base

WORKDIR /app
ENV NODE_ENV test

FROM test-base AS builder

ENV NEXT_TELEMETRY_DISABLED 1

COPY ./apps/web/ ./apps/web/
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules

RUN cd apps/web && npm run build && cd ../..
RUN rm -rf /node_modules
RUN pnpm install -r --prod --frozen-lockfile --offline

FROM base AS runner

ARG DATABASE_URL
ARG CLOUDINARY_API_SECRET
ARG PUBLIC_CLOUDINARY_API_KEY
ARG PUBLIC_CLOUDINARY_CLOUD_NAME
ARG OPENAI_API_KEY
ARG REBRANDLY_API_KEY
ARG SENTRY_AUTH_TOKEN
ARG SENTRY_DSN
ARG SENTRY_IGNORE_API_RESOLUTION_ERROR
ARG NEW_RELIC_LICENSE_KEY
ARG NEW_RELIC_APP_NAME

WORKDIR /app
USER web

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000

COPY --from=builder --chown=web:dealbase /app/package.json ./app/nx.json ./app/pnpm-workspace.yaml ./
COPY --from=builder --chown=web:dealbase /app/node_modules ./node_modules
COPY --from=builder --chown=web:dealbase /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=builder --chown=web:dealbase /app/apps/web/package.json  /app/apps/web/package.json
COPY --from=builder --chown=web:dealbase /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=web:dealbase /app/apps/web/.next ./apps/web/.next
COPY --from=builder --chown=web:dealbase /app/apps/web/next.config.js ./apps/web/

EXPOSE 3000

CMD [ "sh", "-c", "cd apps/web && npm run start" ]

