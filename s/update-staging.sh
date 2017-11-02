#!/bin/bash

docker-compose -f docker-compose-staging.yml stop \
  && git fetch main \
  && git checkout staging \
  && git pull origin staging \
  && docker-compose -f docker-compose-staging.yml run --rm web bash -c "yarn install && npm rebuild node-sass && yarn relay && yarn build"
