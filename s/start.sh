#!/bin/bash

docker-compose run --rm web yarn relay \
  && docker-compose up -d
