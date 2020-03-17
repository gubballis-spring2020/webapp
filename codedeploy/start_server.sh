#!/bin/bash
echo "#CSYE6225: start application pwd and move into nodeapp dir"
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
    -a fetch-config \
    -m ec2 \
    -c file:/home/ubuntu/webapp/amazon-cloudwatch-config.json \
    -s
cd /home/ubuntu/webapp
sudo pm2 -f start server.js