FROM node:18-bullseye-slim

WORKDIR /app

RUN npm install --global pm2

COPY /app/package*.json /app/
COPY /app/patches /app/patches
RUN npm install-clean --legacy-peer-deps
RUN npm run postinstall

COPY /app /app

EXPOSE 4000

ENV NEXT_TELEMETRY_DISABLED=1

RUN npx blitz@2.0.10 prisma generate

CMD npx blitz@2.0.10 dev --port 4000


FROM base AS production

RUN npm install --global pm2

ARG NEXT_PUBLIC_APP_ORIGIN
ARG NEXT_PUBLIC_APP_ENV
ARG NEXT_PUBLIC_OSM_API_URL

RUN npx blitz@2.0.10 prisma generate
RUN npx blitz@2.0.10 build

EXPOSE 4000

CMD npx blitz@2.0.10 prisma migrate deploy && exec pm2-runtime node -- ./node_modules/next/dist/bin/next start -p 4000
