FROM ubuntu:mantic as lua

# Install Lua and "luarocks" – Lua package manager – https://luarocks.org/, https://packages.ubuntu.com/luarocks
RUN apt update && apt install -y lua5.3 liblua5.3-dev luarocks

# RUN luarocks install date
RUN luarocks install busted

# LUA Libaries:
# - "dkjson" used by parking.lua to write JSON for debugging
# RUN luarocks install dkjson
# TODO: We need to find a way to use those packages locally; otherwise using them does not make much sense
# - "inspect" https://github.com/kikito/inspect.lua
#   (recommended in https://github.com/openstreetmap/osm2pgsql/blob/master/flex-config/README.md#dependencies)
# RUN luarocks install inspect
# - "date" https://luarocks.org/modules/tieske/date, https://github.com/Tieske/date

FROM lua as processing

ARG DEBIAN_FRONTEND=noninteractive
ENV TZ=Europe/Berlin
LABEL maintainer="FixMyCity - https://fixmycity.de"

# Install the docker-cli inside the processing container to be able to restart the martin container
# The setting below in docker-compose.yml is required for this to work
# volumes:
#   - /var/run/docker.sock:/var/run/docker.sock
COPY --from=docker:dind /usr/local/bin/docker /usr/local/bin/

RUN apt update && \
  apt install -y osm2pgsql osmium-tool postgresql-client-15 tzdata wget && \
  apt upgrade -y

# install node
RUN apt-get install -y nodejs npm

WORKDIR /processing/warm-cache
COPY warm-cache/package*.json .
RUN cd /processing/warm-cache && npm install
COPY warm-cache/util.js .
COPY warm-cache/warmCache.js .

WORKDIR /processing
# 'data' folder is root
RUN mkdir /data
COPY processing /processing/
RUN chmod +x /processing/*.sh
ENTRYPOINT /processing/run.sh
