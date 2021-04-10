FROM node:14.16.1-alpine

EXPOSE 5000

WORKDIR /code
COPY . /code

RUN npm install --production

CMD [ "node", "server.js" ]