#!/bin/bash
echo "#CSYE6225: start application pwd and move into nodeapp dir"
pwd
echo "PWD AND FILES"
#change file name after -c to location on centos
echo "config file running"
pwd
# ls -lrt
# sudo npm i pm2 -g
pwd
cd /home/centos/ccwebapps/webapp/
sudo pm2 -f start server.js