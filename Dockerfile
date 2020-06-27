FROM node:12.18

COPY /node-app /usr/src/app/

VOLUME /usr/src/app/

WORKDIR /usr/src/app/

CMD [ "tail", "-f", "/dev/null"]