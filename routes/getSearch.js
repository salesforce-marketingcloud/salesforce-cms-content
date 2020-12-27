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
var queryType = 'query';

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
var token;


var searchTerm = '';

router.post('/', function(req, res) {
  searchTerm = req.body.searchTerm;
  queryType = req.body.queryType+'?queryTerm='+searchTerm;

  
  token = jwt.getToken({  
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
          console.log('token.instance_url: '+token.instance_url);
          getCMSContent(req, res, token);
          return;
        }
    } catch (error) {
      console.log('Token error: '+error);
      return;
    }
    
  });
});

function getCMSContent(req, res, token){
  //console.log('token: '+token.access_token)
  //var searchTerm = document.getElementById('search-text').value;
  //try {
  //  if(req.body.searchTerm.length>1){
//      console.log('searchTerm: '+searchTerm);
//    }
//  } catch (error) {
    
//  }
  var channelResource = true;
  var url = token.instance_url+'/services/data/v50.0/connect/cms/delivery/channels/'+channelID+'/contents/' + queryType;
  console.log('url: '+url);
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

/*
searchResponse = [];

router.post('/', function(req, res) {
  searchTerm = req.body.searchTerm;
  console.log(searchTerm);
  client.search("gifs", {
      "q" : searchTerm,
      "rating" : rating,
      "limit" : limit,
      "lang" : language,
      "sort" : sort
    })
    .then((response) => {
      var searchResponse = response.data.filter(function(d) {
        if (d.images.preview_gif.url != null && d.images.original.webp != null) {
          return true; // only return if preview url exists
        }
        return false; // skip if no preview url
      }).map(function(r) {
        return {
          id: r.id,
          preview_url: r.images.preview_gif.url.substring(0, r.images.preview_gif.url.indexOf(".gif") + 4),
          webp_url: r.images.original.webp.substring(0, r.images.original.webp.indexOf(".webp") + 5)
        }
      });
      res.statusCode = 200;
      res.send(
        JSON.stringify(searchResponse)
      );
    })
    .catch((err) => {
      console.log(err);
      res.statusCode = err.status;
      res.send(
        JSON.stringify(err)
      );
    })
});
*/

module.exports = router;
