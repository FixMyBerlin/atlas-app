FROM node:18-bullseye-slim AS base

WORKDIR /app

COPY /app/package*.json /app/
COPY /app/patches /app/patches

RUN npm install-clean --legacy-peer-deps
RUN npm run postinstall

COPY /app /app

EXPOSE 4000

ENV NEXT_TELEMETRY_DISABLED=1
ENV TZ=Europe/Berlin

ARG NEXT_PUBLIC_APP_ORIGIN
ARG NEXT_PUBLIC_APP_ENV
ARG NEXT_PUBLIC_OSM_API_URL

RUN npx blitz@2.1.0 prisma generate
RUN npx blitz@2.1.0 build

CMD npx blitz@2.1.0 prisma migrate deploy && npx blitz@2.1.0 start -p 4000

# From here on we are building the production image
FROM base AS production

RUN npm install --global pm2

CMD npx blitz@2.0.10 prisma migrate deploy && exec pm2-runtime node -- ./node_modules/next/dist/bin/next start -p 4000
