FROM node:15.14.0-alpine

EXPOSE 5000

WORKDIR /code
COPY . /code

RUN npm ci --production

CMD [ "node", "server.js" ]