# this file is used by a github workflow to build the image

FROM node:18-bullseye-slim

WORKDIR /app

RUN npm install --global pm2

COPY package.json package-lock.json ./
COPY patches ./patches
RUN npm install-clean --legacy-peer-deps
RUN npm run postinstall

# see .dockerignore for what is getting copied
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_APP_ORIGIN
ENV NEXT_PUBLIC_APP_ORIGIN ${NEXT_PUBLIC_APP_ORIGIN}
ARG NEXT_PUBLIC_APP_ENV
ENV NEXT_PUBLIC_APP_ENV ${NEXT_PUBLIC_APP_ENV}
ARG NEXT_PUBLIC_OSM_API_URL
ENV NEXT_PUBLIC_OSM_API_URL ${NEXT_PUBLIC_OSM_API_URL}

RUN npx blitz@2.0.9 prisma generate
RUN npx blitz@2.0.9 build

EXPOSE 4000

CMD npx blitz@2.0.9 prisma migrate deploy && exec pm2-runtime node -- ./node_modules/next/dist/bin/next start -p 4000
