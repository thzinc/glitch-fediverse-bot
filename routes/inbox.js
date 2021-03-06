var fs = require('fs'),
    url = require('url'),
    crypto = require('crypto'),
    util = require('util'),
    jsdom = require('jsdom'),
    db = require(__dirname + '/../helpers/db.js'),
    bot = require(__dirname + '/../bot/bot.js');

const { JSDOM } = jsdom;

var express = require('express'),
    router = express.Router();

router.post('/', function (req, res) {
  var url_parts = url.parse(req.url, true),
      payload = req.body;

  console.log('/inbox');
  
  console.log(payload.id);

  /*
    TODO: Verify the message.
  */

  if (payload.type === 'Follow'){
    
    bot.accept(payload, function(err, payload, data){
      if (!err){
        db.save_follower(payload, function(err, data){
          console.log(`new follower ${payload.actor} saved`); 
        });        
      }
      res.status(200);
    });
  }
  else if (payload.type === 'Undo'){
    bot.accept(payload, function(err, payload, data){
      if (!err){
        db.remove_follower(payload, function(err, data){
          console.log(`removed follower ${payload.actor}`); 
        });
      }
      res.status(200);
    });
  }
  else if (payload.type === 'Create'){
    bot.accept(payload, function(err, payload, data){
      if (!err && payload.object && payload.object.content){
        var dom = new JSDOM(`<body><main>${payload.object.content}</main></body>`),
            message_body = '';
        try {
          message_body = dom.window.document.body.firstChild.textContent;

        } catch(err){ /* noop */}

        bot.compose_reply({
          payload: payload,
          message_from: payload.actor,
          message_body: message_body,
        }, function(err, reply_message){
          if (!err){
            console.log(err);
            console.log('sending reply...');
            bot.send_reply({
              payload: payload,
              message_body: message_body,
              reply_message: reply_message
            }, function(err, data){

            });
          }
        });
      }
      res.status(200);
    });
  }
  else if (payload.type === 'Delete'){
    // console.log('payload', payload);  
    console.log('Delete /*noop*/');  
    res.status(200);
  }
  else{
    console.log('payload', payload);  
    res.status(200);
  }
});

module.exports = router;
