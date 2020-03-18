#!/bin/bash

cd /home/ubuntu
sudo forever stop /home/ubuntu/webapp/server.js
sudo chmod -R 777 webapp/
sudo rm -rf /home/ubuntu/webapp/