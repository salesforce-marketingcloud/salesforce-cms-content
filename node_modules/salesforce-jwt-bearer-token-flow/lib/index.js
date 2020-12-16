const   request = require('request')
    ,   Jwt = require('./jwt')
;
module.exports.getToken = function (params, cb) {
    let jwt = new Jwt(params);
    request.post(
        jwt.postUrl,
        { form: {
            "grant_type": 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            "assertion": jwt.token
        } },
        function (error, response, body) {
            if (!error){
                if(response.statusCode === 200) {
                    return cb(null, JSON.parse(body));
                } else {
                    return cb(JSON.parse(body),null);
                }
            } else {
                return cb(error,null);
            }
        }
    );
}