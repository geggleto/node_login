/**
 * Created by Glenn on 2016-02-26.
 */
var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
    req.checkAndSanitize('username');
    req.checkAndSanitize('password');

    var errors = req.validationErrors();
    if (errors.length != 0) {
        res.sendStatus(400);
    }

});

module.exports = router;
