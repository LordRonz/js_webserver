FROM node:15.14.0-alpine

EXPOSE 5000

WORKDIR /code
COPY . /code

RUN npm install --production

RUN addgroup -S yourmom && adduser -S yourmom -G yourmom
USER yourmom
RUN chown -R yourmom /code

CMD [ "node", "server.js" ]