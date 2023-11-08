# this file is used by a github workflow to build the image

FROM node:18-bullseye-slim

WORKDIR /app

RUN npm install --global pm2

COPY package.json package-lock.json packagePatches.sh ./
COPY patches ./patches
RUN npm install-clean --legacy-peer-deps
RUN npm run postinstall

# see .dockerignore for what is getting copied
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx blitz prisma generate && npx blitz build

EXPOSE 3000

CMD npx blitz prisma migrate deploy && exec pm2-runtime node -- ./node_modules/next/dist/bin/next start -p 3000
