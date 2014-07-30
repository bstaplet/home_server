var user = require('../lib/user');
var db = require('../lib/local_db');
var authResp;
var userids = 0;
var online = {};

function flash (req, res, name, value) {
	if (value !== undefined) {
		res.cookie(name, value);
		return value;
	} 
	else {
		value = req.cookies[name];
		res.clearCookie(name);
		return value;
	}
}

exports.login = function(req, res){
	var message = flash(req, res, 'auth') || '';
	var userid = req.cookies.userid;

	if (userid !== undefined && online[userid] !== undefined) {
		res.redirect('/login/main');
	}
	else {
		res.render('login', {	title: 'login', 
 								message: message});
	}
};

exports.logout = function (req, res) {
	var userid = req.cookies.userid;
	if (online[userid] !== undefined) {
		res.clearCookie('userid');
    	delete online[userid];
  	}
  	res.redirect('/login');
};

exports.auth = function(req, res){
	var userid = req.cookies.userid;
	if (userid !== undefined && online[userid] !== undefined) {
		res.redirect('/login/main');
	}
	else {
		var params = { 
			"unameOrEmail" : req.body.unameOrEmail, 
			"pword" : req.body.pword
		};
		db.login(params, function (err, u){
			if (err){
				flash(req, res, 'auth', err);
				res.redirect('/login');
			} else {
				userid = ++userids;
				res.cookie('userid', userid+'', { maxAge : "Da fuck is this?"});
				online[userid] = u;
				res.redirect('/login/main');
			}
		});
	}
};

exports.main = function (req, res) {
	var userid = req.cookies.userid;
	if (userid === undefined || online[userid] === undefined){
		flash(req, res, 'auth', 'Not logged in!');
		res.redirect('/login');
	}
	else {
		var u = online[userid];
		res.redirect('/');

	}
};
