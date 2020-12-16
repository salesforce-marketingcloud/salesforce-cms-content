# Salesforce OAuth 2.0 JWT Bearer Token Flow Implementation
[Salesforce OAuth 2.0 JWT Bearer Token Flow](https://help.salesforce.com/articleView?id=remoteaccess_oauth_jwt_flow.htm&type=5)

## Installation
```bash
$ npm install salesforce-jwt-bearer-token-flow --save
```

## Salesforce Configuration

### Step 1 : The certificate
Create the private key and the certificate in osx terminal:
```bash
$ openssl req  -nodes -new -x509  -keyout private.pem -out server.cert
```

### Step 2 : The connected App
Create a connected app in Salesforce:

1. Select **Enable OAuth Settings**
2. Select **Use digital signatures**
3. Upload the generated **certificate**

## Usage

### Input
```javascript
const   fs = require('fs')
    ,   privateKey = fs.readFileSync('private.pem').toString('utf8')
    ,   jwt = require("salesforce-jwt-bearer-token-flow")
;

var token = jwt.getToken({
        iss: "<YOUR_CONNECTED_APP_CLIENT_ID>",
        sub: "<YOUR_SALESFORCE_USERNAME>",
        aud: "<YOUR_AUDIENCE>",
        privateKey: privateKey
    },
    function(err, token){
        console.log(token);
    }
);
```
The audience (aud) must be:
- https://login.salesforce.com,
- https://test.salesforce.com
- https://acme.force.com/customers (where acme.force.com/customers is your community URL)

### Output

```javascript
{
    access_token: 'xxxxxxxxxx!ARYAQNzk4LCbHsX[...]',
    scope: 'id full',
    instance_url: 'https://eu6.salesforce.com',
    id: 'https://login.salesforce.com/id/xxxxxxxxxxEAI/yyyyyyyyyy',
    token_type: 'Bearer'
}
```

## License

MIT