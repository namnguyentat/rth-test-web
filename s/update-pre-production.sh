#!/bin/bash

docker-compose -f docker-compose-production.yml stop \
  && git fetch main \
  && git checkout pre-production \
  && git pull origin pre-production \
  && docker-compose -f docker-compose-pre-production.yml run --rm web bash -c "yarn install && npm rebuild node-sass && yarn relay && yarn build"
