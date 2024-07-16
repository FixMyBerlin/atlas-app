# this file is used by a github workflow to build the image

FROM node:18-bullseye-slim

WORKDIR /app

RUN npm install --global pm2

COPY package.json package-lock.json ./
COPY patches ./patches
RUN npm install-clean --legacy-peer-deps
RUN npm run postinstall

COPY db mailers public src ./
COPY .eslintrc.json next.config.js tsconfig.json types.ts ./

ARG NEXT_PUBLIC_APP_ORIGIN
ARG NEXT_PUBLIC_APP_ENV
ARG NEXT_PUBLIC_OSM_API_URL

RUN npx blitz@2.0.10 prisma generate
RUN npx blitz@2.0.10 build

EXPOSE 4000

CMD npx blitz@2.0.10 prisma migrate deploy && exec pm2-runtime node -- ./node_modules/next/dist/bin/next start -p 4000
