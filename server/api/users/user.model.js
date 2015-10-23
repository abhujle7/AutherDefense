'use strict'; 

var mongoose = require('mongoose'),
	shortid = require('shortid'),
	_ = require('lodash');

var db = require('../../db');
var Story = require('../stories/story.model');
var crypto = require('crypto');

var User = new mongoose.Schema({
	_id: {
		type: String,
		unique: true,
		default: shortid.generate
	},
	name: String,
	photo: {
		type: String,
		default: '/images/default-photo.jpg'
	},
	phone: String,
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: String,
	salt: String,
	google: {
		id: String,
		name: String,
		email: String,
		token: String
	},
	twitter: {
		id: String,
		name: String,
		email: String,
		token: String
	},
	github: {
		id: String,
		name: String,
		email: String,
		token: String
	},
	isAdmin: {
		type: Boolean,
		default: false
	}
});

User.methods.getStories = function () {
	return Story.find({author: this._id}).exec();
};

User.pre('save', function(next) {
	if(!this.salt) {
		var salt = crypto.randomBytes(16).toString('base64');
		var hash = crypto.pbkdf2Sync(this.password, salt, 1, 64).toString('base64');
		this.salt = salt;
		this.password = hash;
	}
	next();
})

module.exports = db.model('User', User);