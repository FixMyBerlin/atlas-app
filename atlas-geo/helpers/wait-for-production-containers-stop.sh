#!/bin/bash

# This is a workaround, since the Github Action continues with the following statements
# after execute docker compose down for services.

until [ "`docker inspect -f {{.State.Running}} app`" != "true" ]; do
    echo "Waiting for app_staging to stop";
    sleep 3;
done;


until [ "`docker inspect -f {{.State.Running}} api`" != "true" ]; do
    echo "Waiting for api_staging to stop";
    sleep 3;
done;


until [ "`docker inspect -f {{.State.Running}} tiles`" != "true" ]; do
    echo "Waiting for tiles_staging to stop";
    sleep 3;
done;
