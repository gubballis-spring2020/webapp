#!/bin/bash

cd /home/ubuntu
sudo forever stop /home/ubuntu/webapp/server.js
sudo rm -rf webapp/