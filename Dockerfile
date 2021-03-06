FROM node:14.15-alpine

WORKDIR /usr/src/app/
COPY /node-app /usr/src/app/
VOLUME /usr/src/app/

RUN \
    apk update && \
    apk --no-cache add \
        git \
    && rm -rf /var/lib/apt/lists/*

CMD [ "npm", "install", "&&", "npm", "run", "start" ]