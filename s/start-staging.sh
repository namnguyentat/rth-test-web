#!/bin/bash

docker-compose -f docker-compose-staging.yml run --rm web bash -c "yarn relay && yarn build"
