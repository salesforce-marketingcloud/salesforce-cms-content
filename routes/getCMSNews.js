var express = require('express');
var router = express.Router();
var request = require('request');
var path = require('path');
let Html5Entities = require('html-entities');


//Environment and process.env values
var clientID = process.env.clientID || '3MVG9Kip4IKAZQEURQLxNTxad_Di6MhEhmmrr.wADSgoWUs7g4GMDBB_eUKA54y5vEc_0BVdZgyKqBGl_FaF4';
var limit = process.env.limit || "25"; //page size 25
var environment = process.env.NODE_ENV || 'development';
var channelID = process.env.channelID || '0ap3h000000LlA6AAK';
var envprivateKey;
var contentType = 'news';
var cmsUSER = process.env.cmsUSER || 'cmsuser@cms.demo';
var cmsAUD = process.env.cmsAUDIENCE || 'https://login.salesforce.com';
var cmsJWTToken = false;
cmsContent = [];

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

router.get('/', function(req, res) {
  getCMSContent(req, res);
});

function getCMSContent(req, res){  
  getCMSAccessToken(function(cms_access_token){
    //console.log('getCMSAccessToken: '+cms_access_token);
    //set boolean in getCMSAccessToken function, if getCMSAccessToken is true then process else set JSON.parse(body)[0].message === 'The CMS User is not authorized to access the requested resources')
    //return res.send(body);
    /*if(cmsJWTToken == false){
      console.log('MESSAGE: '+JSON.parse(body)[0].message);
      JSON.parse(body)[0].message === 'The CMS User is not authorized to access the requested resources';
      return res.send(body);
    }*/
    var token = cms_access_token;
    var channelResource = true;
    var url = token.instance_url+'/services/data/v50.0/connect/cms/delivery/channels/'+channelID+'/contents/query?managedContentType='+contentType+'&pageSize='+limit;
    request({
        url: url,
        method: "GET",
        headers: {
            'Authorization': 'Bearer '+token.access_token,
        },
    },function (error, response, body){
        console.log('MESSAGE: '+JSON.parse(body)[0].message);
        try {
          if(JSON.parse(body)[0].message === 'The requested resource does not exist'){
            channelResource = false;
            return res.send(body);
            //return; 
          }
        } catch (error) {
            console.error('error:', error); // Print the error
            console.log('statusCode:', response && response.statusCode); // Print the response status code
        }

        if(channelResource){
          results = JSON.parse(body);
          var cmsContentObj = [];
          for(var x=0; x<results.items.length; x++){
            var obj = results.items[x].contentNodes;
            var contentType = results.items[x].type;
            for (var p in obj) {
              if( p === 'bannerImage' && obj.hasOwnProperty(p) && obj[p].mediaType === 'Image') {
                if(obj[p].fileName != null){
                  var tempHtmlBody = Html5Entities.encode(obj.body.value);
                  cmsContentObj.push({title: obj.title.value,
                    bannerImage: token.instance_url+obj[p].url,
                    excerpt : obj.excerpt.value,
                    htmlBody: Html5Entities.decode(tempHtmlBody),
                    contentType: contentType  
                  });
                } 
              }
            }
          }
          //convert cmsContentObj data to a map to remove duplicates
          var cmsDataArr = cmsContentObj.map(item=>{
            return [item.title,item]
          });
          var cmsMapArr = new Map(cmsDataArr); // create key value pair from array of array
          var cmsContent = [...cmsMapArr.values()];//convert back to array from map
          res.send(
            JSON.stringify(cmsContent)
          );
        }
    });
  });
}

function getCMSAccessToken(callback){
  var cmstoken = jwt.getToken({  
    iss: clientID, //YOUR_CONNECTED_APP_CLIENT_ID
    //sub: "raj@cmsworkshopmasterorg.demo", //YOUR_SALESFORCE_USERNAME
    //aud: "https://login.salesforce.com", //YOUR_AUDIENCE
    sub: cmsUSER, //SALESFORCE_CMS_USERNAME
    aud: cmsAUD, //YOUR_AUDIENCE
    privateKey: privateKey //PrivateKey from lib/cmsserver.key if environment = development
  },
  function(error, cmstoken){
    if(!error){
      cmsJWTToken = true;
      callback(cmstoken);
    }else{
      cmsJWTToken = false;
      console.error('error:', error); // Print the error
    }
  });
}

module.exports = router;
