#!/bin/bash

cd /home/ubuntu
sudo pm2 stop -f server
sudo rm -rf webapp/