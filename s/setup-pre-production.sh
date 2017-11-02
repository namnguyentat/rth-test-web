#!/bin/bash

git fetch main \
  && git checkout main/pre_production \
  && git checkout -b pre_production \
  && docker-compose -f docker-compose-pre-production.yml build \
  && docker-compose -f docker-compose-pre-production.yml run --rm web yarn install
