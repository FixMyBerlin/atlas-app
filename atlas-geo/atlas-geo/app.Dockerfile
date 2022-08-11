FROM ubuntu:kinetic

ARG DEBIAN_FRONTEND=noninteractive
ENV TZ=Europe/Berlin
LABEL maintainer="FixMyCity - https://fixmycity.de"
# LUA Libaries:
# - "inspect" https://github.com/kikito/inspect.lua
#   (recommended in https://github.com/openstreetmap/osm2pgsql/blob/master/flex-config/README.md#dependencies)
# - "dkjson" – used by parking.lua to write JSON for debugging
RUN apt update && apt install -y osm2pgsql osmium-tool lua-dkjson lua-inspect postgresql-client-14 tzdata wget && apt upgrade -y
WORKDIR /app
# 'data' folder is root
RUN mkdir /data
COPY app /app/
RUN chmod +x /app/run.sh
CMD /app/run.sh
