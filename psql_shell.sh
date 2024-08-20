#!/bin/bash
source ./.env
docker exec -ti db psql -d $DATABASE_NAME -U $DATABASE_USER
