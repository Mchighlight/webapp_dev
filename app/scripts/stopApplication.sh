#!/bin/bash
cd /home/ubuntu && if [  -d "app" ];then
cd /home/ubuntu/app && sudo pm2 stop index.js
cd /home/ubuntu && sudo rm -r app -f
fi
