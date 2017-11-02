#!/bin/bash

docker-compose -f docker-compose-production.yml stop \
  && git fetch main \
  && git checkout production \
  && git pull origin production \
  && docker-compose -f docker-compose-production.yml run --rm web bash -c "yarn install --production=false && npm rebuild node-sass && yarn relay && yarn build"
