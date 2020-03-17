#!/bin/bash

cd /home/ubuntu
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
    -a fetch-config \
    -m ec2 \
    -c file:/home/ubuntu/webapp/amazon-cloudwatch-config.json \
    -a stop
sudo pm2 stop -f server
sudo rm -rf webapp/
sudo rm -rf webapp/