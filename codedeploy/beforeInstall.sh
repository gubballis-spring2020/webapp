#!/bin/bash

cd /home/ubuntu/webapp
sudo forever stop server.js
sudo rm -rf node_modules/