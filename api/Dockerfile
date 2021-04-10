FROM node:15.14.0-alpine

EXPOSE 5000

WORKDIR /code
COPY . /code

RUN npm install --production

RUN addgroup -r myuser && adduser -r -g myuser myuser
USER myuser

CMD [ "node", "server.js" ]