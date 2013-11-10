# Weblebrity Trumps

Like a who’s who of the information superhighway websphere, Weblebrity Trumps turns the web's elite into a gamification experience based on social media and internet proliferation.

## Front end

Grunt is used to run a developemt server on port 9000 and watch sass files for compilation. Install grunt-cli:

```
npm install -g grunt-cli
```
More info on getting started with grunt [http://gruntjs.com/getting-started](http://gruntjs.com/getting-started)

And then install dependancies:

```
npm install
```

Then just run grunt:

```
grunt
```

Visit localhost:9000 to view the site.

## Deploying

Use the deploy script!

`cd /srv/www/git_weblebritytrumps/scripts && sudo sh deploy.sh`


## Updating script

To run the updating script that gets the latest values you need Node (v0.8+)

In terminal navigate to the root of the site and run:

```
npm install
```

You need to update the github login credentials with your github API details.

Create a file in the root called *node_credentials.js* (or symlink one in) and enter:

```
var exports;
exports.githubAccount = {
    'user': '[username]',
    'pass': '[password]'
};
module.exports = exports;
```

Then start the information gathering with:

```
node app.js
```

This should update the json file used to populate the cards