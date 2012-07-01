var GoogleSpreadsheets = require("node-google-spreadsheets"),
    util = require("util"),
    _ = require('underscore'),
    winston = require('winston'),
    wTrumps = {}; //Main object

wTrumps.getWeblebrities = function(){
  winston.info('Loading Weblebrities');
  
  GoogleSpreadsheets({
      
      key: "0ApZCKMWuuiAVdFc5cWpnSGpQSi1qMnpRZUU4c2t3Y3c"

  }, function(err, spreadsheet) {

      spreadsheet.worksheets[0].cells({

          range: "A2:G100" //@todo: can we get row count value from API?

      }, function(err, cells) {

          var weblebrities = [];
          
          _.each(_.keys(cells.cells), function(item){

            if(!_.isUndefined(item)){

              var weblebrity = {
                id : cells.cells[item]['1'].value,
                name : cells.cells[item]['2'].value,
                accounts: {
                  twitter: (!_.isUndefined(cells.cells[item]['3'])) ? cells.cells[item]['3'].value : null,
                  linkedin: (!_.isUndefined(cells.cells[item]['4'])) ? cells.cells[item]['4'].value : null,
                  github: (!_.isUndefined(cells.cells[item]['5'])) ? cells.cells[item]['5'].value : null,
                  lanyrd: (!_.isUndefined(cells.cells[item]['6'])) ? cells.cells[item]['6'].value : null,
                  facebook: (!_.isUndefined(cells.cells[item]['7'])) ? cells.cells[item]['7'].value : null
                }
              };

              weblebrities.push(weblebrity);
            }
          });
            
          winston.info(weblebrities.length +  ' Weblebrities loaded');  
          
      });
    
    

  });
};

//Entry
wTrumps.getWeblebrities();
