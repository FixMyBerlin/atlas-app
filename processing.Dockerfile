FROM ubuntu:noble AS testing

# Install Lua and "luarocks" (Lua package manager) – https://luarocks.org/, https://packages.ubuntu.com/luarocks
RUN apt update && apt install -y lua5.3 liblua5.3-dev luarocks

RUN luarocks install busted

COPY processing /processing/
ENTRYPOINT [ "busted" ]
CMD ["--pattern=%.test%.lua$", "/processing/topics/"]

FROM testing AS processing

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

RUN curl -fsSL https://bun.sh/install | bash

WORKDIR /processing
# 'data' folder is root
RUN mkdir /data
RUN chmod +x /processing/*.sh
ENTRYPOINT /processing/run.sh
