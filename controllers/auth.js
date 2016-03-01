/**
 * Created by Glenn on 2016-02-26.
 */
var express = require('express');
var router = express.Router();

var Promise = require("bluebird");
var bcrypt = Promise.promisifyAll(require("bcrypt"));

router._loginAction = function(req, res, next) {
    req.checkAndSanitize('username');
    req.checkAndSanitize('password');

    var errors = req.validationErrors();

    var redis = req.redis; //grab the client from the request that was added in via a middleware
    var redisPasswordKey = req.body.username + '-password'; //compute storage keys

    new Promise(function(resolve, reject) {
        if (errors) {
            reject(errors);
        }

        redis.get(redisPasswordKey, function (err, password) {
            if (err) {
                reject(err);
            }

            if (password) {
                resolve(password);
            } else {
                reject({error : "Incorrect username and password" });
            }
        });

    }).then(function (passwordHash) {
        return bcrypt.compareSync(req.body.password, passwordHash);
    }).then(function (validLogin) {
        if (validLogin) {
            res.sendStatus(200);
        } else {
            console.log(validLogin);
            res.sendStatus(403);
        }
    }).catch(function (err) {
        console.log(err);
        res.sendStatus(500);
    });
};

router.post('/', router._loginAction);

module.exports = router;
