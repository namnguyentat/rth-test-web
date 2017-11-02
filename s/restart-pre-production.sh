#!/bin/bash

docker-compose -f docker-compose-production.yml run --rm web yarn build
