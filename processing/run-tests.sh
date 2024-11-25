#!/bin/bash
# Start docker and run all tests there.

docker build --target testing -f ./processing.Dockerfile -t test_img .
docker run --rm test_img
docker rmi test_img
