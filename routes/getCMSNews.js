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
var cmsUSER = process.env.cmsUser || 'cmsuser@cms.demo'; //Salesforce CMS Username 
var cmsAUD = process.env.cmsAudience || 'https://login.salesforce.com';
var contentType = 'news';

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
        try {
          if(JSON.parse(body)[0].message === 'The requested resource does not exist'){
            channelResource = false;
            return res.send(body);
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
            //set excerpt and body if null/undefined
            if(obj.hasOwnProperty('excerpt') == false){
              obj.excerpt= {nodeType: 'MultilineText', value: ''};
            }
            if(obj.hasOwnProperty('body') == false){
              obj.body= {nodeType: 'RichText', value: ''};
            }

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
    sub: cmsUSER, //SALESFORCE_CMS_USERNAME - "raj@cmsworkshopmasterorg.demo"
    aud: cmsAUD, //YOUR_AUDIENCE - "https://login.salesforce.com"
    privateKey: privateKey //PrivateKey from lib/cmsserver.key if environment = development
  },
  function(error, cmstoken){
    if(!error){
      callback(cmstoken);
    }else{
      console.error('error:', error); // Print the error
    }
  });
}

module.exports = router;
