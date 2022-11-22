# About Apple M1 ARM64 builds…
#   https://github.com/postgis/docker-postgis/issues/216 is the github issue which is kind of stuck
#   (~) https://github.com/postgis/docker-postgis/issues/216#issuecomment-809347656 proposes to build manually, which I did not test but might work
#   (-) https://github.com/postgis/docker-postgis/issues/216#issuecomment-923908560 has created a ARM64 build, BUT I was not able to use it.
#     https://hub.docker.com/r/odidev/postgis is the image but the docker pull does not work
#     https://github.com/odidev the providing user has no red flags at first sight
#   (+) https://github.com/postgis/docker-postgis/issues/216#issuecomment-981824739 has created an ARM64 build WHICH WORKS
#     https://github.com/baosystems/docker-postgis/pkgs/container/postgis is the image
#     https://github.com/baosystems the company has no red flags at first sight
# This code uses the last option in that list…

FROM ghcr.io/baosystems/postgis:14-3.2
# logs can be found in /var/lib/postgresql/data/pg_log/
CMD [ \
  "postgres", \
  "-clog_destination=csvlog", \
  "-clogging_collector=on", \
  "-clog_rotation_size=100MB", \
  "-clog_directory=pg_log", \
  "-clog_filename=postgresql-%Y-%m-%d_%H%M%S.log", \
  "-clog_statement=mod" \
]
