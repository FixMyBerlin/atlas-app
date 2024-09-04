#!/bin/bash
# This script is used to conviently access the psql shell of the database
source ./.env
docker exec -ti db psql -d $DATABASE_NAME -U $DATABASE_USER
