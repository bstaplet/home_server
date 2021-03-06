var _user = require('../lib/user');
var db = require('../lib/local_db');
var message = 'Enter your information below.';
var cssClass = '';

exports.register = function (req, res) {
	res.render('register', { message : message, cssClass : cssClass });
};

exports.submit = function (req, res) {
	var first = req.body.first;
	var last  = req.body.last;
	var email = req.body.email;
	var uname = req.body.uname;
	var pword = req.body.pword;
	var confirmPword = req.body.confirmPword;
	
	validateInfo (first, last, email, uname, pword, confirmPword, function(error, u) {
		if (error){
			message = error;
			cssClass = 'error';
			console.log(error);
			res.redirect('/register');
		}
		else {
			flash (req, res, 'user', u);
			res.redirect('/register/add');
		}
	});
};

exports.add = function(req, res) {
	var u = flash (req, res, 'user');
	db.addUser(u, function(error, user){
		if (error){
			message = error;
			cssClass = 'error';
			res.redirect('/register');
		} else {
			res.redirect('/login');
		}
	});
};

function validateInfo(first, last, email, uname, pword, confirmPword, callback) {
	if (first === '' || last === '' || email === '' || uname === '' || pword === ''){
		callback("Please fill in all the fields");
		return;
	}
	if (pword !== confirmPword){
		callback("Passwords do not match");
		return;
	}
	db.findUser({ "email" : email }, function(err, result){
		if (err !== undefined) {
			callback("Error connecting database, please try again.");
			return;
		}
		if (result !== undefined && result.length > 0) {
			callback("User already exists with that email.");
			return;
		}
		db.findUser({ "uname" : uname }, function(err, result){
			if (err !== undefined) {
				callback("Error connecting database, please try again.");
				return;
			}
			if (result.length > 0) {
				callback("User already exists with that username.");
				return;
			}
			callback (undefined, { first : first, last : last, uname : uname, email : email, pword : pword });
		});
	});
}

/***** Unexported Functions *****/
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