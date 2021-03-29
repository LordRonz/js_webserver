FROM node

EXPOSE 5000

WORKDIR /code
COPY . /code

RUN npm install

CMD [ "node", "server.js" ]