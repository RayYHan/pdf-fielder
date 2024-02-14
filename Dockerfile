FROM node:21.6.1

COPY ./app /app
WORKDIR /app
RUN npm install
WORKDIR /

CMD node /app/index.js
