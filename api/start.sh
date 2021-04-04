#!/usr/bin/env bash

sudo docker build -t lordronz/js-webserver .
sudo docker run -p 5000:5000 -d lordronz/js-webserver