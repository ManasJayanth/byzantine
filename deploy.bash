git checkout heroku-branch

git pull heroku master -m "Deployment changes"

sed -i -e 's/mongodb:\/\/localhost\/byzantine/mongodb:\/\/rohit:rohit@ds045297.mongolab.com:45297\/byzantine/g' models/user.js

sed -i -e 's/node post-install.js \|\| //g' package.json

#git commit -a -m "Deployment changes"

git push heroku heroku-branch:master
