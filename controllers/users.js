var express = require('express');
var router = express.Router();
var validator = require('node-validator');

var Promise = require("bluebird");
var bcrypt = Promise.promisifyAll(require("bcrypt"));

/* GET users listing. */
router.get('/:user', function(req, res, next) {
  res.send({id : req.params.user});
});

router.put("/", function (req, res, next) {
  res.send(req.body);
});

router.post('/', function (req, res, next) {
  req.checkAndSanitize('username');
  req.checkAndSanitize('password');
  req.checkAndSanitize('display_name');

  var errors = req.validationErrors();

  var redis = req.redis; //grab the client from the request that was added in via a middleware
  var redisPasswordKey = req.body.username + '-password'; //compute storage keys
  var redisDisplayNameKey = req.body.display_name + '-displayname';

  new Promise(function(resolve, reject){
    if (errors) {
      reject(errors);
    }

    redis.get(redisPasswordKey, function (err, reply) {
      if (reply) {
        reject({error : "Account already exists" });
      } else {
        resolve(reply);
      }
    });
  }).then(
  function (reply) {
      return bcrypt.hashAsync(req.body.password, 10).catch(addBcryptType);
  }).then(function (hash) {
    //Store the hash
    redis.set(redisPasswordKey, hash);

    //Store the username
    redis.lpush("usernames", req.body.username);

    //Store the display name
    redis.set(redisDisplayNameKey, req.body.display_name)

    //Output something back
    res.json({
      username: req.body.username,
      password: hash,
      display_name: req.body.display_name
    });
  }).catch(function (err) {
    res.status(500).json(err);
  });
});

module.exports = router;

function addBcryptType(err) {
  // Compensate for `bcrypt` not using identifiable error types
  err.type = "bcryptError";
  throw err;
}

