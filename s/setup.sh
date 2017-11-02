#!/bin/bash

docker-compose build \
  && docker-compose run --rm web yarn install
