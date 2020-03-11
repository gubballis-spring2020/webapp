#!/bin/bash
echo "#CSYE6225: start application pwd and move into nodeapp dir"
cd /home/ubuntu
sudo pm2 -f start server.js