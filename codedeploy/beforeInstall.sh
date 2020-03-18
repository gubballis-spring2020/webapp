#!/bin/bash

cd /home/ubuntu
sudo pm2 stop -f server
sudo chmod 777 webapp
sudo rm -rf /home/ubuntu/webapp/