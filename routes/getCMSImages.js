var express = require('express');
var router = express.Router();
var request = require('request');
var path = require('path');

//Environment and process.env values
var clientID = process.env.clientID || '3MVG9Kip4IKAZQEURQLxNTxad_Di6MhEhmmrr.wADSgoWUs7g4GMDBB_eUKA54y5vEc_0BVdZgyKqBGl_FaF4';
var limit = process.env.limit || "25";
var environment = process.env.NODE_ENV || 'development';
var channelID = process.env.channelID || '0ap3h000000LlA6AAK';
//'0ap3h000000LlA6AAK';
var envprivateKey;

if(environment === 'development'){
  const   fs = require('fs')
  privateKey = fs.readFileSync(path.join(path.resolve(),'lib/cmsserver.key')).toString('utf8')
  , jwt = require(path.join(path.resolve(),'node_modules/salesforce-jwt-bearer-token-flow/lib/index.js'))
;
}else{
  envprivateKey = process.env.privateKey;
  const   fs = require('fs')
    privateKey = envprivateKey.toString('utf8')
    , jwt = require(path.join(path.resolve(),'node_modules/salesforce-jwt-bearer-token-flow/lib/index.js'))
  ;
}

cmsContent = [];


router.get('/', function(req, res) {
  var token = jwt.getToken({  
    //YOUR_CONNECTED_APP_CLIENT_ID
    iss: clientID,
    //YOUR_SALESFORCE_USERNAME
    sub: "raj@cmsworkshopmasterorg.demo",
    //YOUR_AUDIENCE
    aud: "https://login.salesforce.com",
    //PrivateKey from lib/cmsserver.key if environment = development or 
    privateKey: privateKey
  },
  function(err, token){
    try {
        if(token != null){
            getCMSContent(req, res, token);
        }
    } catch (error) {
      console.log('Token error: '+error);
    }
    
  });
});

function getCMSContent(req, res, token){
  //console.log('token: '+token.access_token)
  var channelResource = true;
  var url = token.instance_url+'/services/data/v50.0/connect/cms/delivery/channels/'+channelID+'/contents/query';
  request({
      url: url,
      method: "GET",
      headers: {
          'Authorization': 'Bearer '+token.access_token
      },
  }, function (error, response, body){
    try {
      if(JSON.parse(body)[0].message === 'The requested resource does not exist'){
        channelResource = false;
        res.send(body);
        return; 
      }
    } catch (error) {
    }

    //console.log('Error: '+ JSON.parse(body)[0].message);  
    if(channelResource){
      results = JSON.parse(body);
      var cmsContent = results.items.filter(function(d) {
          try {
              if (d.contentNodes.AnnouncementImage.unauthenticatedUrl != null && d.contentNodes.AnnouncementImage.title != null) {
                  return true; // only return if preview url exists
              }
              return false; // skip if no preview url
          }catch(error){
            return false;
          }
      }).map(function(r) {
          return {
              title: r.contentNodes.AnnouncementImage.title,
              url: token.instance_url+r.contentNodes.AnnouncementImage.unauthenticatedUrl
          }
      });
      res.send(
        JSON.stringify(cmsContent)
      );
    }
      //console.log('cmsContent :'+cmsContent[0].title); 
  });
}

module.exports = router;
