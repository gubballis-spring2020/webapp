#!/bin/bash

cd /home/ubuntu
sudo pm2 -f stop server
sudo chmod -R 777 webapp/
sudo rm -rf /home/ubuntu/webapp/