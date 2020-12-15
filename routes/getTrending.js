var express = require('express');
var router = express.Router();
var request = require('request');
var path = require('path');
//var GphApiClient = require('giphy-js-sdk-core');


var clientID = process.env.clientID;
var limit = process.env.limit || "25";
var SECURE_KEY = process.env.SECURE_KEY;

console.log('__dirname: '+__dirname);
console.log("path.resolve() : ", path.resolve());

/*
//use cmsserver.key for localhost
const   fs = require('fs')
    ,   privateKey = fs.readFileSync(path.join(path.resolve(),'lib/cmsserver.key')).toString('utf8')
    , jwt = require(path.join(path.resolve(),'node_modules/salesforce-jwt-bearer-token-flow/lib/index.js'))
  ;
*/
const   fs = require('fs')
  ,   privateKey = fs.readFileSync(SECURE_KEY).toString('utf8')
  , jwt = require(path.join(path.resolve(),'node_modules/salesforce-jwt-bearer-token-flow/lib/index.js'))
;


/*
const   fs = require('fs')
    ,   privateKey = fs.readFileSync('./lib/cmsserver.key').toString('utf8')
    , jwt = require('../node_modules/salesforce-jwt-bearer-token-flow/lib/index')
  ;

*/

cmsContent = [];


router.get('/', function(req, res) {
  console.log('inside getJWTToken');
  var token = jwt.getToken({  
    //YOUR_CONNECTED_APP_CLIENT_ID - hardcoded for localhost
    //iss: "3MVG9Kip4IKAZQEURQLxNTxad_Di6MhEhmmrr.wADSgoWUs7g4GMDBB_eUKA54y5vEc_0BVdZgyKqBGl_FaF4",
    //YOUR_CONNECTED_APP_CLIENT_ID
    iss: clientID,
    //YOUR_SALESFORCE_USERNAME
    sub: "raj@cmsworkshopmasterorg.demo",
    //YOUR_AUDIENCE
    aud: "https://login.salesforce.com",
    privateKey: privateKey
  },
  function(err, token){
    try {
        if(token != null){
            console.log(token);
          
            getCMSContent(req, res, token);
        }
    } catch (error) {
      console.log('Token error: '+error);
    }
    
  });
});

function getCMSContent(req, res, token){
  //console.log('token: '+token.access_token)
  var url = token.instance_url+'/services/data/v50.0/connect/cms/delivery/channels/0ap3h000000LlA6AAK/contents/query';
  //console.log('url :'+url);

  request({
      url: url,
      method: "GET",
      headers: {
          'Authorization': 'Bearer '+token.access_token
      },
  }, function (error, response, body){
      //console.log(response);
      results = JSON.parse(body);
      var cmsContent = results.items.filter(function(d) {
          try {
              if (d.contentNodes.AnnouncementImage.unauthenticatedUrl != null && d.contentNodes.AnnouncementImage.title != null) {
                  return true; // only return if preview url exists
              }
              return false; // skip if no preview url
          }catch(error){
            return false;
            //console.log(error);
            //res.statusCode = error.status;
            //res.send(
            //  JSON.stringify(error)
            //);
          }
      }).map(function(r) {
          return {
              title: r.contentNodes.AnnouncementImage.title,
              url: token.instance_url+r.contentNodes.AnnouncementImage.unauthenticatedUrl
          }
      });
      //res.statusCode = err.status;
      res.send(
        JSON.stringify(cmsContent)
      );
      //console.log('cmsContent :'+cmsContent[0].title); 
  });
}



module.exports = router;
