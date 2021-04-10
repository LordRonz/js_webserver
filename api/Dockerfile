FROM node:15.14.0-alpine

EXPOSE 5000

WORKDIR /code
COPY . /code

RUN npm install --production && addgroup -S yourmom && adduser -S yourmom -G yourmom && chown -R yourmom /code
USER yourmom

CMD [ "node", "server.js" ]