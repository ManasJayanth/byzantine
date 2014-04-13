# Byzantine Fault Tolerance
Demonstrating Byzantine fault tolerance using node.js

## Installation
Being a node.js app, simply install node.js and run `npm install` to install the package dependencies

Install `mongodb` as explained [here](http://docs.mongodb.org/manual/)

## Running the code
Run the mongo server

    mongod

Run the node.js server

    node app.js

## Deploying to heroku
Run the following

    bash deploy.bash

Replace the mongolabs link with an appropriate link

## Post InstallationR
Run post install script to add admin record to database (TODO: more robust post installation script required)

    node post-install

Make directory for users uploaded files

    mkdir user-files
