var util = require("util"),
    request = require("request"),
    async = require('async'),
    _ = require('underscore'),
    winston = require('winston'),
    cheerio = require('cheerio'),
    fs = require('fs'),
    http = require('http'),
    moment = require('moment'),
    wTrumps = {}; //Main object

var twitterProfileImageUrl = 'https://api.twitter.com/1/users/profile_image?screen_name=<%= twitterName %>&size=original';

/**
* Get all the weblebrities
* Connect from
**/
wTrumps.getWeblebrities = function(callback){
  winston.info('Loading Weblebrities');

  fs.readFile('data/weblebrity-accounts.json', 'utf8', function(err, data){

    if(!err){

      var weblebrities = [];

      var json = JSON.parse(data);

          _.each(_.keys(json), function(index){

            var item = json[index];

            if(!_.isUndefined(item) && !_.isEmpty(item)){

              var weblebrity = {
                id : item.id,
                bio : "",
                image : "",
                name : item.Name,
                accounts: {
                  twitter: item.Twitter,
                  linkedin: item.LinkedIn,
                  github: item.Github,
                  lanyrd: item.Lanyrd
                },
                stats: {
                  twitter: 0,
                  linkedin: 0,
                  github: 0,
                  lanyrd: 0
                }

              };

              weblebrities.push(weblebrity);
            }
          });

          wTrumps.weblebrities = weblebrities;
          winston.info(weblebrities.length +  ' Weblebrities loaded');
          callback(null);

    } else {
      console.log("there was an error parsing the json data");
    }
  });
};


/**
* Get Twitter followers -> Using API. (https://api.twitter.com/1/users/lookup.json)
**/
wTrumps.getTwitterFollows = function(callback){
  winston.info('Getting twitter followers');

  var names = [];
    _.each(wTrumps.weblebrities, function(weblebrity){

      if(weblebrity.accounts.twitter !== '') {
        names.push(weblebrity.accounts.twitter);
      }
    });

    var url = "https://api.twitter.com/1/users/lookup.json?screen_name="+names.join(',');

    //@todo: Request can only handle 100 users. Maybe split into multiple requests if too long here.

    request({url:url, json:true},  function (error, response, body) {
      if (!error && response.statusCode == 200) {
        _.each(body, function(user){
          wTrumps.updateWeblebrityStat(user.screen_name, 'twitter', user.followers_count);
          wTrumps.updateBio(user.screen_name, 'twitter', user.description);         
          wTrumps.saveImage(user.screen_name, 'twitter', user.profile_image_url);
        });
        callback(null);
      } else {
        console.log("Twitter error: ", error);
        callback();
      }
    });
};


/**
* Get LinkedIn Connections -> Using page crawler.
**/
wTrumps.getLinkedInConnections = function(callback){

  winston.info('Getting linkedin connections');

  var reqQueue = async.queue(function(task, callback){

      request(task.url, function(error, response, body){
        if (!error && response.statusCode == 200) {
          var $ = cheerio.load(body);
          wTrumps.updateWeblebrityStat(task.url, 'linkedin', $('dd.overview-connections strong').text());
          callback();
        } else {
          console.log("Linkedin error for: ", task.webleb, ": ", error);
          callback();
        }
      });
  }, 10);

  reqQueue.drain = function(){
    callback(null);
  };

  _.each(wTrumps.weblebrities, function(weblebrity){

    if(!_.isEmpty(weblebrity.accounts.linkedin) && !_.isUndefined(weblebrity.accounts.linkedin)){
        var task = {};
        task.url = weblebrity.accounts.linkedin;
        task.webleb = weblebrity.name;
        reqQueue.push(task);
    }
  });
};


/**
* Get Github Repos count -> Using api (https://api.github.com/users/)
**/
wTrumps.getGithubRepos = function(callback){

  winston.info('Getting Github repos');

  var reqQueue = async.queue(function(task, callback){

      request({url:task.url, json:true}, function(error, response, body){
        if (!error && response.statusCode == 200) {
          wTrumps.updateWeblebrityStat(task.github, 'github', body.public_repos);
          callback();
        } else {
          console.log("Github error for ", task.github, ": ", error);
          callback();
        }
      });
  }, 10);

  reqQueue.drain = function(){
    callback(null);
  };

  _.each(wTrumps.weblebrities, function(weblebrity){

    if(!_.isEmpty(weblebrity.accounts.github) && !_.isUndefined(weblebrity.accounts.github)){
        var task = {};
        task.url = 'https://api.github.com/users/'+weblebrity.accounts.github;
        task.github = weblebrity.accounts.github;
        reqQueue.push(task);
    }
  });
};


/**
* Get Lanyrd Conferences Spoken -> Using page crawler (http://lanyrd.com/profile/[name]).
**/
wTrumps.getLanyrdConferenceSpoken = function(callback){

  winston.info('Getting lanyrd conferences spoken');

  var reqQueue = async.queue(function(task, callback){

      request(task.url, function(error, response, body){
        if (!error && response.statusCode == 200) {
          var $ = cheerio.load(body);

          wTrumps.updateWeblebrityStat(task.lanyrd, 'lanyrd', $($('p.number-feature a strong')[0]).text());
          callback();
        } else {
          console.log("Lanyrd error for ", task.lanyrd, ": ", error);
          callback();
        }
      });
  }, 10);

  reqQueue.drain = function(){
    callback(null);
  };

  _.each(wTrumps.weblebrities, function(weblebrity){

    if(!_.isEmpty(weblebrity.accounts.lanyrd) && !_.isUndefined(weblebrity.accounts.lanyrd)){
        var task = {};
        task.url = 'http://lanyrd.com/profile/'+weblebrity.accounts.lanyrd;
        task.lanyrd = weblebrity.accounts.lanyrd;
        reqQueue.push(task);
    }
  });
};


/**
* Set stats for weblebrities
* params: accountName (username/url for service), type (twitter, github etc), value (value for service)
**/
wTrumps.updateWeblebrityStat = function(accountName, type, value){
  _.each(wTrumps.weblebrities, function(item, index){
    if(item.accounts[type] == accountName){
      item.stats[type] = value;
      wTrumps.weblebrities[index] = item;
    }
  });
};


/**
* Set user bio
* params: accountName (username), value (value for service)
**/
wTrumps.updateBio = function(accountName, type, value){
  _.each(wTrumps.weblebrities, function(item, index){
    if(item.accounts[type] == accountName){
      item.bio = value;
      wTrumps.weblebrities[index] = item;
    }
  });
};


/**
* Save image
* params: accountName (username), value (value for service)
**/
wTrumps.saveImage = function(accountName, type, imgUrl){
  _.each(wTrumps.weblebrities, function(item, index){
    if(item.accounts[type] == accountName){
      var fileName, ext, file, request;

      //remove _normal to try get the large image
      imgUrl = imgUrl.replace('_normal', '');

      // get file extension/name
      ext = imgUrl.split('.').pop();
      fileName = accountName + "." + ext;

      item.image = fileName;
      wTrumps.weblebrities[index] = item;

      // save image
      request = http.get(imgUrl, function(res){
        var imagedata = '';
        res.setEncoding('binary');
        res.on('data', function(chunk){
            imagedata += chunk;
        });
        res.on('end', function(){
            fs.writeFile("static/weblebrity-profile-images/"+fileName, imagedata, 'binary', function(err){
                if (err) { throw err; }
                console.log('Image file saved:', accountName);
            });
        });
      });
    }
  });
};


wTrumps.saveFile = function(){
  var now         = moment().format('YYYY-MM-DD-HHmm'),
      filepath    = 'static/weblebrity-game-stats/',
      newFile     = filepath+now+'.json',
      symlinkFile = 'latest.json',
      symlink     = filepath+symlinkFile;

    fs.writeFile(newFile, JSON.stringify(wTrumps.weblebrities), function(err){
      if (err) {
        console.log("writeFile error: ", err);
      }

      fs.unlink(symlink, function(err){
        if (err) {
          console.log("unlink error: ", err);
        }

        fs.symlink(now+'.json', symlink, function(err) {
          if (err) {
            console.log("symlink error: ", err);
          }
        });
      });
      console.log('New JSON file saved:', newFile);
    });
};


//Entry
async.series([
    wTrumps.getWeblebrities,
    wTrumps.getTwitterFollows,
    wTrumps.getLinkedInConnections,
    wTrumps.getGithubRepos,
    wTrumps.getLanyrdConferenceSpoken
  ],
  function(){
    wTrumps.saveFile();
  }
);