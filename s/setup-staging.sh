#!/bin/bash

git fetch main \
  && git checkout main/staging \
  && git checkout -b staging \
  && docker-compose -f docker-compose-staging.yml build \
  && docker-compose -f docker-compose-staging.yml run --rm web yarn install
