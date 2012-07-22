var GoogleSpreadsheets = require("node-google-spreadsheets"),
    util = require("util"),
    request = require("request"),
    async = require('async'),
    _ = require('underscore'),
    winston = require('winston'),
    wTrumps = {}; //Main object

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
    wTrumps.getTwitterFollows
  ], function(){
    console.log('READY');
  })

