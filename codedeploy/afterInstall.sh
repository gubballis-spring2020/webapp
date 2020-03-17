#!/bin/bash

# update the permission and ownership of WAR file in the tomcat webapps directory
echo "#CSYE6225: doing after install"
pwd
cd /home/ubuntu/webapp
sudo cp -rf cloudwatch-config.json /opt/aws/amazon-cloudwatch-agent/etc/cloudwatch-config.json
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/opt/aws/amazon-cloudwatch-agent/etc/cloudwatch-config.json -a restart
sudo npm install
sudo npm install pm2 -g

# sudo mkdir ccwebapps
# #move tar.gz to ccwebapps
# sudo mv webapp.zip ccwebapps/
# #remove from ccwebapps
# sudo rm -rf webapp
# #unzip in ccwebapps
# cd ccwebapps
# sudo tar xzvf webapp.tar.gz
# sudo rm -rf webapp.tar.gz

# cd webapp
# pwd
# sudo npm install
# sudo npm install pm2 -g