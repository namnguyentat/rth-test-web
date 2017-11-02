#!/bin/bash

docker-compose -f docker-compose-pre-production.yml run --rm web bash -c "yarn relay && yarn build"
