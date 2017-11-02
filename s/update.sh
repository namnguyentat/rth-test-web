#!/bin/bash
CURRENT_BRANCH=`git symbolic-ref HEAD | sed 's!refs\/heads\/!!'`

docker-compose stop \
  && git fetch main \
  && git checkout master \
  && git pull main master \
  && git checkout $CURRENT_BRANCH \
  && git rebase master \
  && docker-compose run --rm web bash -c "yarn install && npm rebuild node-sass && yarn relay" \
  && docker-compose up -d
