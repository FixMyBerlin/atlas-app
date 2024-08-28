FROM node:18-bullseye-slim AS base

WORKDIR /app
COPY /app/package*.json /app/
COPY /app/patches /app/patches
RUN npm install-clean --legacy-peer-deps
RUN npm run postinstall

COPY /app /app

EXPOSE 4000

ENV NEXT_TELEMETRY_DISABLED=1

RUN npx blitz@2.0.10 prisma generate

ARG NEXT_PUBLIC_APP_ORIGIN
ARG NEXT_PUBLIC_APP_ENV
ARG NEXT_PUBLIC_OSM_API_URL

RUN npx blitz@2.0.10 build

CMD npx blitz@2.0.10 prisma migrate deploy && npx blitz@2.0.10 start

# From here on we are building the production image
FROM base AS production

RUN npm install --global pm2

CMD exec pm2-runtime node -- ./node_modules/next/dist/bin/next start -p 4000
