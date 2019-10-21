#!/bin/bash

ln -s /app/ck-puck-front/node_modules/ node_modules
nvm use 8.1.0
npm set registry http://192.168.51.44
npm install
npm run build
rm -rf /app/ck-puck-front/dist
mkdir -p /app/ck-puck-front/dist
cp -Rf ./dist /app/ck-puck-front/
