FROM ubuntu:mantic

ARG DEBIAN_FRONTEND=noninteractive
ENV TZ=Europe/Berlin
LABEL maintainer="FixMyCity - https://fixmycity.de"

# - "luarocks" – Lua package manager – https://luarocks.org/, https://packages.ubuntu.com/luarocks
RUN apt update && \
  apt install -y osm2pgsql osmium-tool postgresql-client-15 tzdata wget libpq-dev curl && \
  apt upgrade -y
# LUA Libaries:
# - "dkjson" used by parking.lua to write JSON for debugging
# RUN luarocks install dkjson
# TODO: We need to find a way to use those packages locally; otherwise using them does not make much sense
# - "inspect" https://github.com/kikito/inspect.lua
#   (recommended in https://github.com/openstreetmap/osm2pgsql/blob/master/flex-config/README.md#dependencies)
# RUN luarocks install inspect
# - "date" https://luarocks.org/modules/tieske/date, https://github.com/Tieske/date
# RUN luarocks install date

WORKDIR /app
# 'data' folder is root
RUN mkdir /data
COPY app /app/
RUN chmod +x /app/*.sh
CMD /app/run.sh
