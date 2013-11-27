// Inspired by: https://gist.github.com/danro/2933166

var inspect = require('eyes').inspector(),
    b64url = require('b64url'),
    crypto = require('crypto'),
    secret = 'e36e9c54cfbca00c73ab3e042879b532';

function verifyFB(signedRequest, appId) {
  if (!secret) { return 'Invalid Facebook App ID'; }
  
  if (!signedRequest) { return 'Signed request is missing'; }

  var split = signedRequest.split('.');
  var encodedSig = split[0];
  var payload = split[1];

  if (!encodedSig || !payload) { return 'Signed request is invalid'; }

  var sig = b64url.decode(encodedSig, 'binary');
  var expectedSig = crypto.createHmac('sha256', secret).update(payload).digest('binary');

  if (sig !== expectedSig) { return 'Invalid Facebook signature'; }
  
  return JSON.parse(b64url.decode(payload));
}

module.exports = verifyFB;
