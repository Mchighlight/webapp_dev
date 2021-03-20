#!/bin/bash
cd /home/ubuntu && sudo cp dev.js app/config
cd /home/ubuntu/app && sudo npm install
cd /home/ubuntu/app && sudo npm install nodemon chai chai-http mocha --save-dev
cd /home/ubuntu/app && sudo npm run table --action=create