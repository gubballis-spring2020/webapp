#!/bin/bash

cd /home/ubuntu
sudo pm2 stop -f server
cd webapp
sudo rm -rf node_modules/
cd ../
sudo rm -rf webapp/