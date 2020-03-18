#!/bin/bash

# update the permission and ownership of WAR file in the tomcat webapps directory
echo "#CSYE6225: doing after install"
pwd
cd /home/ubuntu/webapp
sudo mkdir logs
cd logs
sudo touch webapp.log
cd ../
# sudo cp -rf amazon-cloudwatch-config.json /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-config.json
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/home/ubuntu/webapp/amazon-cloudwatch-config.json -s
sudo npm install
sudo npm install forever -g