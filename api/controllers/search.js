/*jslint node: true */
'use strict';
var rq = require('request');
var async = require('async');
module.exports = {
  searchUser : searchUser
};

function searchUser(req, res, next) {
  async.waterfall([
    function(callback) {
      var url = 'https://api.github.com/search/users?q=' +  req.swagger.params.username.value;
      rq({
            url: url, //URL to hit
            method: 'GET',
            //Lets post the following key/values as form
            json: true,
            headers: {
              'User-Agent': 'request'
            }
        }, function(err, response, body){
            if(response.statusCode === 200){
              var urls = [];
              var firstTen = (body.items).slice(0, 10) || [];
              firstTen.forEach(function(item){
                  urls.push(item.url);
              });
              callback(null, urls);
            }else{
              callback(err);
            }
        });
    },
    function(urls, callback) {
      var users = [];
      async.each(urls, function(url, callbackEach) {
        rq({
              url: url, //URL to hit
              method: 'GET',
              //Lets post the following key/values as form
              json: true,
              headers: {
                'User-Agent': 'request'
              }
          }, function(err, response, body){
              if(response.statusCode === 200){
                users.push(Object.assign({}, {name : body.name || '', bio : body.bio || '', location : body.location || '' , email : body.location || '' , imgUrl : body.avatar_url}));
                callbackEach();
              }else{
                callbackEach();
              }
          });
      }, function() {
          callback(null, users);
      });
    }
], function (err, result) {
    if(err){
      res.status(500).json(err || {message : 'Something went wrong'});
    }else{
      res.status(200).json(result);
    }

});
}
