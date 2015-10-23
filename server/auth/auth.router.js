'use strict';

var router = require('express').Router();

var HttpError = require('../utils/HttpError');
var User = require('../api/users/user.model');
var crypto = require('crypto');

var sanitize = require('mongo-sanitize');


router.post('/login', function (req, res, next) {
	var clean = sanitize(req.body.email);
	User.findOne({email: clean})
	.then(function (user) {
		if (!user) throw HttpError(401);
		var salt = user.salt;
		var hash = crypto.pbkdf2Sync(req.body.password, salt, 1, 64).toString('base64');
		if (user.password == hash) {
			req.login(user, function () {
				res.json(user);
			});
		} else {
			res.send(HttpError(401));
		}
	})	
	.then(null, next);
});

router.post('/signup', function (req, res, next) {
	var salt = crypto.randomBytes(16).toString('base64');
	var hash = crypto.pbkdf2Sync(req.body.password, salt, 1, 64).toString('base64');
	req.body.password = hash;
	req.body.salt = salt;
	for(var key in Object.keys(req.body)) {
		req.body[key] = sanitize(req.body[key]);
	}
	User.create(req.body)
	.then(function (user) {
		req.login(user, function () {
			res.status(201).json(user);
		});
	})
	.then(null, next);
});

router.get('/me', function (req, res, next) {
	res.json(req.user);
});

router.delete('/me', function (req, res, next) {
	req.logout();
	res.status(204).end();
});

router.use('/google', require('./google.oauth'));

router.use('/twitter', require('./twitter.oauth'));

router.use('/github', require('./github.oauth'));

module.exports = router;