var GoogleSpreadsheets = require("node-google-spreadsheets"),
    util = require("util"),
    request = require("request"),
    async = require('async'),
    _ = require('underscore'),
    winston = require('winston'),
    cheerio = require('cheerio'),
    wTrumps = {}; //Main object

/**
* Get all the weblebrities
* Connect from 
**/
wTrumps.getWeblebrities = function(callback){
  winston.info('Loading Weblebrities');
  
  GoogleSpreadsheets({
      
      key: "0ApZCKMWuuiAVdFc5cWpnSGpQSi1qMnpRZUU4c2t3Y3c"

  }, function(err, spreadsheet) {

      spreadsheet.worksheets[0].cells({

          range: "A2:G100" //@todo: can we get row count value from API?

      }, function(err, cells) {

          var weblebrities = [];
          
          _.each(_.keys(cells.cells), function(item){

            if(!_.isUndefined(item) && !_.isEmpty(item) && !_.isUndefined(cells.cells[item][1]) && !_.isUndefined(cells.cells[item][2])){

              var weblebrity = {
                id : cells.cells[item]['1'].value,
                name : cells.cells[item]['2'].value,
                accounts: {
                  twitter: (!_.isUndefined(cells.cells[item]['3'])) ? cells.cells[item]['3'].value : null,
                  linkedin: (!_.isUndefined(cells.cells[item]['4'])) ? cells.cells[item]['4'].value : null,
                  github: (!_.isUndefined(cells.cells[item]['5'])) ? cells.cells[item]['5'].value : null,
                  lanyrd: (!_.isUndefined(cells.cells[item]['6'])) ? cells.cells[item]['6'].value : null,
                  facebook: (!_.isUndefined(cells.cells[item]['7'])) ? cells.cells[item]['7'].value : null
                },
                stats: {
                  twitter: 0,
                  linkedin: 0,
                  github: 0,
                  lanyrd: 0,
                  facebook: 0
                }

              };

              weblebrities.push(weblebrity);
            }
          });
            
          wTrumps.weblebrities = weblebrities;  
          winston.info(weblebrities.length +  ' Weblebrities loaded');  
          callback(null);
      });
    
  });
};

/**
* Get Twitter followers -> Using API. (https://api.twitter.com/1/users/lookup.json) 
**/
wTrumps.getTwitterFollows = function(callback){
  winston.info('Getting twitter followers');  
  
  var names = [];
    _.each(wTrumps.weblebrities, function(weblebrity){

      names.push(weblebrity.accounts.twitter);

    });

      // var url = "https://api.twitter.com/1/users/lookup.json?screen_name="+names.join(',');
      var url = "http://192.168.1.77/~alice/twitter.json";

      //@todo: Request can only handle 100 users. Maybe split into multiple requests if too long here.

      request({url:url, json:true},  function (error, response, body) {
        if (!error && response.statusCode == 200) {
          _.each(body, function(user){
            wTrumps.updateWeblebrityStat(user.screen_name, 'twitter', user.followers_count);

          });
          callback(null);
        }
      });
}

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
        reqQueue.push(task);
    }
  });
}

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
}

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
}

wTrumps.getFacebookFriends = function(callback){

  winston.info('Getting Facebook Friends'); 

    //get token first
    request('https://graph.facebook.com/oauth/access_token?client_id=345866462155145&client_secret=4f7cb4c988000af7b5ee825f833a1818&grant_type=client_credentials', function(error, response, body){
      var accessToken = body;

      var reqQueue = async.queue(function(task, callback){

          request({url:task.url, json:true}, function(error, response, body){
            console.log(body);
            if (!error && response.statusCode == 200) {
              console.log(body);
              // wTrumps.updateWeblebrityStat(task.facebook, 'facebook', body.public_repos);
              callback();
            }
          });
      }, 10);

      reqQueue.drain = function(){
        callback(null);
      };

      _.each(wTrumps.weblebrities, function(weblebrity){
        
        if(!_.isEmpty(weblebrity.accounts.facebook) && !_.isUndefined(weblebrity.accounts.facebook)){
            var task = {};
            task.url = 'https://graph.facebook.com/'+weblebrity.accounts.facebook+'/friends?'+accessToken;
            console.log(task.url);
            task.github = weblebrity.accounts.facebook;
            reqQueue.push(task);
        }
      });
    });
}

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

}

//Entry
async.series([
    wTrumps.getWeblebrities,
    wTrumps.getTwitterFollows,
    wTrumps.getLinkedInConnections,
    wTrumps.getGithubRepos,
    wTrumps.getLanyrdConferenceSpoken,
    wTrumps.getFacebookFriends
  ], function(){
    console.log('READY');
    console.log(wTrumps.weblebrities);
  })

