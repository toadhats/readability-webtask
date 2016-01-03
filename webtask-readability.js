var request = require('request');
var nodeHTML = require('html-to-text');

//The skeleton of a webtask...
module.exports = function (context, cb) {
  // The url is passed into the webtask as data
  // Works via a curl argument, does it work via url query strings?
  request.get(context.data.url, function (error, response, body) {
    if (error)
      cb(error);
    else
      cb(null, {
        status: response.statusCode,
        body: body.textContent
      });
  });
}
