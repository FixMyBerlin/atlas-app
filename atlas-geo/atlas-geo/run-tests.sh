#!/bin/bash
docker compose -f docker-compose.development.yml run --build --entrypoint /app/run-tests.sh app
