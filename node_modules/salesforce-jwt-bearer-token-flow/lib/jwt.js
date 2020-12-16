const   base64url = require("base64url")
    ,   crypto = require('crypto')
;
module.exports = class Jwt {
    constructor(params) {
        this.validation(params);
        this.iss = params.iss;
        this.sub = params.sub;
        this.aud = params.aud;
        this.privateKey = params.privateKey;
    }
    get token() {
        const existing_string = this.generatePayload();
        var sign = crypto.createSign("RSA-SHA256");
        sign.update(existing_string);
        sign.end();
        return existing_string+"."+base64url(sign.sign(this.privateKey));
    }
    get postUrl(){
        return this.aud+"/services/oauth2/token";
    }
    generatePayload() {
        const   header = {"alg":"RS256"}
            ,   claimsSet = {
                    "iss": this.iss, 
                    "sub": this.sub, 
                    "aud": this.aud,
                    "exp": Math.floor(Date.now() / 1000) + (60 * 5)
                }
            ,   encoded_JWT_Header = base64url(JSON.stringify(header))
            ,   encoded_JWT_Claims_Set = base64url(JSON.stringify(claimsSet))
            ,   existing_string = encoded_JWT_Header+"."+encoded_JWT_Claims_Set
        ;
        return existing_string;
    }
    validation(params){
        if(!params || !params instanceof Object) throw new Error("Missing parameters");
        const paramsToValidate = ["iss","sub","aud","privateKey"];
        paramsToValidate.forEach(function(p) {
            if(!params.hasOwnProperty(p) || !params[p]){
                throw new Error("Missing "+p+" parameter!");
            }
        });
    }
}