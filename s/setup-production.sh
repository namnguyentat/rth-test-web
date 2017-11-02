#!/bin/bash

git fetch main \
  && git checkout main/production \
  && git checkout -b production \
  && docker-compose -f docker-compose-production.yml build \
  && docker-compose -f docker-compose-production.yml run --rm web yarn install --production=false
