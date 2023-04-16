FROM node:16.18.0-alpine as build

ENV PORT 3300

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Installing dependencies
COPY package*.json /usr/src/app/
COPY yarn.lock /usr/src/app/

# Install build tools, Python, and any other required dependencies
RUN apk add --no-cache --virtual .gyp \
    python3 \
    make \
    g++ \
    && yarn install \
    && apk del .gyp
RUN yarn install

# Copying source files
COPY . /usr/src/app

# Building app
RUN yarn build
EXPOSE $PORT

# Running the app
CMD ["yarn", "start"]