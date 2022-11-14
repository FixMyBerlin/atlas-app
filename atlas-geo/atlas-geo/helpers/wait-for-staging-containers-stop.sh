#!/bin/bash
until [ "`docker inspect -f {{.State.Running}} traefik`" != "true" ]; do
    echo "Waiting for traefik to stop";
    sleep 3;
done;


until [ "`docker inspect -f {{.State.Running}} app_staging`" != "true" ]; do
    echo "Waiting for app_staging to stop";
    sleep 3;
done;


until [ "`docker inspect -f {{.State.Running}} api_staging`" != "true" ]; do
    echo "Waiting for api_staging to stop";
    sleep 3;
done;


until [ "`docker inspect -f {{.State.Running}} tiles_staging`" != "true" ]; do
    echo "Waiting for tiles_staging to stop";
    sleep 3;
done;
