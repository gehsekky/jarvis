# jarvis

## overview
Jarvis is a slack bot written in nodeJS with a simple module system.

## installation

first, clone the repository. then navigate into the directory you just cloned it into.

    npm install

configure the bot by using the following file as a template:

    config/default.json

to make a new configuration file for you to use:

    config/production.json

run the bot with:

    NODE_ENV=production NODE_PATH=./lib node bin\jarvis.js

on windows, run:

    set NODE_ENV=production
    set NODE_PATH=./lib
    node bin\jarvis.js

## bot modules

### amazon

find cool stuff on amazon

    .amazon cool stuff

### dongs

print silly things

    .dongs
    .butts

### giphy

search for a relevant gif

    .giphy haduken

### uptime

tell how long the bot has been up

    .uptime

### wunderground

get link to weather conditions

    .wunderground 20120
