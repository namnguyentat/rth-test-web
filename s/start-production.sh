#!/bin/bash

docker-compose -f docker-compose-production.yml run --rm web bash -c "yarn relay && yarn build"
