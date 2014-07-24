var _user = require('../lib/user');
var db = require('../lib/local_db');

exports.register = function (req, res) {
	res.render('register', {});
};

exports.submit = function (req, res) {
	var first = req.body.first;
	var last = req.body.last;
	var email = req.body.email;
	var uname = req.body.uname;
	var pword = req.body.pword;
	var confirmPword = req.body.confirmPword;
	
	validateInfo (first, last, email, uname, pword, confirmPword, function(error, u) {
		if (error){
			message = error;
			res.redirect('/register');
		}
		else {
			flash (req, res, 'user', u);
			res.redirect('/register/add');
		}
	});
};

function validateInfo(first, last, email, uname, pw, confirmPw, callback) {
	var len = userdb.length;
	var returned = false;
	if (first === '' || last === '' || email === '' || uname === '' || pw === ''){
		returned = true;
		callback("Please fill in all the fields");
	}
	if (pword !== confirmPword){
		returned = true;
		callback("Passwords do not match");
	}
	db.findUser({ "email" : email }, new function(err, result){
		if (err !== undefined) {
			returned = true;
			console.log(err);
			callback("Error connecting database, please try again.");
		}
		if (result.length > 0) {
			returned = true;
			callback("User already exists with that email");
		}
	});
	db.findUser({ "uname" : uname }, new function(err, result){
		if (err !== undefined) {
			returned = true;
			console.log(err);
			callback("Error connecting database, please try again.");
		}
		if (result.length > 0) {
			returned = true;
			callback("User already exists with that uname");
		}
	})

	if (!returned) callback (undefined, { first : first, last : last, uname : uname, email : email, pword : pword });
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