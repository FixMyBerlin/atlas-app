FROM node:20-bookworm-slim AS base

RUN apt-get update && \
    apt-get install -y gdal-bin && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

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

RUN npx blitz@2.2.2 prisma generate
RUN npx blitz@2.2.2 build

CMD npx blitz@2.2.2 prisma migrate deploy && npx blitz@2.2.2 start -p 4000

# From here on we are building the production image
FROM base AS production

RUN npm install --global pm2

# TODO: Is addding `SHELL ["/bin/bash", "-c"]` here a good way to work around this Github action warning?
# - https://docs.docker.com/reference/build-checks/json-args-recommended/
# - "JSON arguments recommended for ENTRYPOINT/CMD to prevent unintended behavior related to OS signals: app.Dockerfile#L30 | JSONArgsRecommended: JSON arguments recommended for CMD to prevent unintended behavior related to OS signals"
CMD npx blitz@2.2.2 prisma migrate deploy && exec pm2-runtime node -- ./node_modules/next/dist/bin/next start -p 4000
