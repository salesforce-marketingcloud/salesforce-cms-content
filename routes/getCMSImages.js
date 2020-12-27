var express = require('express');
var router = express.Router();
var request = require('request');
var path = require('path');

//Environment and process.env values
var clientID = process.env.clientID || '3MVG9Kip4IKAZQEURQLxNTxad_Di6MhEhmmrr.wADSgoWUs7g4GMDBB_eUKA54y5vEc_0BVdZgyKqBGl_FaF4';
var limit = process.env.limit || "25"; //page size 25
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



//TO DO - Set token outside of router.get('/', function(req, res) { 
/*
router.get('/', function(req, res) {
  var sfToken = jwt.getToken({  
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
        if(sfToken != null){
            token = sfToken;
        }
    } catch (error) {
      console.log('Token error: '+error);
    }
    
  });
});
*/
/*
router.get('/', function(req, res) {
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
*/


router.get('/', function(req, res) {
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
            getCMSContent(req, res, token);
            return;
        }
    } catch (error) {
      console.log('Token error: '+error);
      return;
    }
  });
});

/*
router.post('/', function(req, res) {
  searchTerm = req.body.searchTerm;
  queryType = req.body.queryType+'?queryTerm='+searchTerm;
  console.log('token.instance_url: '+token.instance_url);
  
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
            getCMSContent(req, res, token);
            return;
        }
    } catch (error) {
      console.log('Token error: '+error);
      return;
    }
    
  });
});
*/

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
  var url = token.instance_url+'/services/data/v50.0/connect/cms/delivery/channels/'+channelID+'/contents/' + queryType+'?pageSize='+limit;
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
      //var result = "";
      var cmsContentObj = [];
      for(var x=0; x<results.items.length; x++){
        var obj = results.items[x].contentNodes;
        var contentType = results.items[x].type;
        
        for (var p in obj) {
          switch(contentType) {
            case 'cms_image':
            {    
              // code block
              if( obj.hasOwnProperty(p) && obj[p].mediaType === 'Image') {
                if(obj[p].fileName != null && obj[p].unauthenticatedUrl != null){
    //              result += p + " , " + obj[p].title + "\n";
    //              result += p + " , " + token.instance_url+obj[p].unauthenticatedUrl + "\n";
                  cmsContentObj.push({title: obj.title.value,//obj[p].title,
                  url: token.instance_url+obj[p].unauthenticatedUrl
                  });
                } 
              }
              break;
            }  
            case 'place_holder':
            {
            // code block
              break;
            }  
            default:
            {
            // code block
              if( obj.hasOwnProperty(p) && obj[p].mediaType === 'Image') {
                if(obj[p].title != null && obj[p].unauthenticatedUrl != null){
    //              result += p + " , " + obj[p].title + "\n";
    //              result += p + " , " + token.instance_url+obj[p].unauthenticatedUrl + "\n";
                  cmsContentObj.push({title: obj[p].title,
                  url: token.instance_url+obj[p].unauthenticatedUrl
                  });
                } 
              }
            }  
          }              
        }
      }
      //convert cmsContentObj data to a map to remove duplicates
      var cmsDataArr = cmsContentObj.map(item=>{
        return [item.title,item]
      });
      var cmsMapArr = new Map(cmsDataArr); // create key value pair from array of array
      var cmsContent = [...cmsMapArr.values()];//converting back to array from map

      res.send(
        JSON.stringify(cmsContent)
      );
    }
      //console.log('cmsContent :'+cmsContent[0].title);
  });
}

module.exports = router;
