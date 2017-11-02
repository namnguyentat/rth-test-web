FROM node:8.5.0

RUN apt-get update -qq \
  && apt-get install -y --fix-missing --no-install-recommends curl apt-transport-https \
  && curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
  && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
  && apt-get update -qq \
  && apt-get install -y yarn

# Install Watchman
RUN apt-get install -y autoconf automake build-essential python-dev \
  && git clone https://github.com/facebook/watchman.git /opt/watchman \
  && cd /opt/watchman \
  && git checkout v4.7.0 \
  && ./autogen.sh \
  && ./configure \
  && make \
  && make install

ENV APP_HOME /usr/src/app
RUN mkdir -p $APP_HOME
WORKDIR $APP_HOME

# CMD ["yarn", "start"]
