FROM ubuntu:noble AS testing
WORKDIR /processing

# Install Lua and "luarocks" (Lua package manager) – https://luarocks.org/, https://packages.ubuntu.com/luarocks
RUN apt update && apt install -y lua5.3 liblua5.3-dev luarocks

# `busted` is our testing framework https://lunarmodules.github.io/busted/
# `inspect` is to print / inspect tables https://github.com/kikito/inspect.lua
RUN luarocks install busted && \
    luarocks install inspect
COPY processing /processing/

ENTRYPOINT [ "busted" ]
CMD ["--pattern=%.test%.lua$", "/processing/topics/"]

FROM testing AS processing

# reset the entrypoint
ENTRYPOINT []

ARG DEBIAN_FRONTEND=noninteractive
ENV TZ=Europe/Berlin
LABEL maintainer="FixMyCity - https://fixmycity.de"

# Install the docker-cli inside the processing container to be able to restart the martin container
# The setting below in docker-compose.yml is required for this to work
# volumes:
#   - /var/run/docker.sock:/var/run/docker.sock
COPY --from=docker:dind /usr/local/bin/docker /usr/local/bin/

RUN apt update && \
  apt install -y osm2pgsql osmium-tool wget curl && \
  apt upgrade -y

# 'data' folder is root
RUN mkdir /data

RUN curl -fsSL https://bun.sh/install | bash
ENV PATH=/root/.bun/bin:$PATH
RUN bun install

RUN bunx prisma generate --schema=/processing/constants/schema.prisma
CMD bun run /processing/index.ts
