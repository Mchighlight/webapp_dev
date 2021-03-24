#!/bin/bash
cd /home/ubuntu/app && sudo pm2 start index.js
cd /home/ubuntu/app/log_server && sudo pm2 start stats.js
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
    -a fetch-config \
    -m ec2 \
    -c file:/home/ubuntu/app/cloudwatch-config.json \
    -s
