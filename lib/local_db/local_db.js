// var _security = require('../security');
var _user = require('../user');
var _mysql = require('mysql');
var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

exports.addUser = function (user, callback) {
	var connection = getConnection();
	connection.connect();
	connection.query(queries.INSERT_USER, [ user.first, user.last, user.uname, user.pw, '', user.email ], function(err, results){
		if (err != null) {
			callback(err);
			return;
		}
		else {
			callback(undefined, user);
		}
	});
	connection.end();
	// var hashedPw = null;
	// var salt = null;
	// _security.cryptPw(user.pword, function(err, hash, pwSalt){
	// 	if (err === undefined) {
	// 		hashedPw = hash;
	// 		salt = pwSalt;
	// 		var connection = getConnection();
	// 		connection.connect();
	// 		connection.query(queries.INSERT_USER, [ user.first, user.last, user.uname, hashedPw, salt, user.email ], function(err, results){
	// 			if (err != null) {
	// 				callback(err);
	// 				return;
	// 			}
	// 			else {
	// 				callback(undefined, user);
	// 			}
	// 		});
	// 		connection.end();
	// 	}
	// 	else {
	// 		callback(err);
	// 		return;
	// 	}
	// });
}

exports.login = function (loginInfo, callback) {
	var isEmail = emailRegex.test(unameOrEmail);
	var connection() = getConnection();
	connection.connect();
	if (isEmail) {
		connection.query(CHECK_LOGIN_EMAIL, [ loginInfo.unameOrEmail ], function(err, results){
			if (err != null){
				callback(err)
				return;
			}
			if (results.length > 0) {
				if (results[0].hashed_pword == loginInfo.pword) {
					callback(undefined, results[0]);
				}
				else {
					callback('Incorrect password for email.')
				}
			}
			else {
				callback('No user found with that email.');
			}
		});
	}
	else {
		connection.query(CHECK_LOGIN_USER, [ loginInfo.unameOrEmail ], function(err, results){
			if (err != null) {
				callback(err);
				return;
			}
			if (results.length > 0){
				if (results[0].hashed_pword == loginInfo.pword) {
					callback(undefined, results[0]);
				}
				else {
					callback('Incorrect password for username.')
				}
			}
			else {
				callback('No user found with that username.');
			}
		});
	}
	connection.end();
}

exports.findUser = function (parameters, callback) {
	var query = buildFindUserQuery(parameters);
	var connection = getConnection();
	connection.connect();
	connection.query(query.query, query.paramValues, function(err, rows) {
		if (err != null) {
			console.log(err);
			callback(err);
			return;
		}
		var users = [];
		if (rows !== undefined) {
			for (var i = 0; i < rows.length; i++) {
				users.push(new _user.User(rows[i].first_name, rows[i].last_name, rows[i].uname, null, rows[i].email));
			}
		}
		console.log(callback);
		callback(undefined, users);
		return;
	});
	connection.end();
}

var queries = {
	INSERT_USER : "INSERT INTO USERS (first_name, last_name, uname, hashed_pword, salt, email) values (?, ?, ?, ?, ?, ?)",
	FIND_USER : "SELECT * FROM USERS WHERE ",
	CHECK_LOGIN_USER : "SELECT * FROM USERS WHERE uname = ?",
	CHECK_LOGIN_EMAIL : "SELECT * FROM USERS WHERE email = ?"
};

/***** Unexported Functions *****/

function getConnection(){
	return _mysql.createConnection({
		host	 : 'localhost',
		port	 : 3306,
		database : 'home_server',
		user	 : 'root',
		password : ''
	});
}

function buildFindUserQuery(parameters) {
	var query = queries.FIND_USER;
	var paramValues = [];
	var paramAdded = false;
	if (parameters.uname !== undefined) {
		query += "uname = ?";
		paramValues.push(parameters.uname);
		paramAdded = true;
	}
	if (parameters.email !== undefined) {
		if (paramAdded)
			query += " AND ";
		query += "email = ?";
		paramValues.push(parameters.email);
		paramAdded = true;
	}
	if (parameters.first !== undefined) {
		if (paramAdded)
			query += " AND ";
		query += "first_name = ?";
		paramValues.push(parameters.first);
		paramAdded = true;
	}
	if (parameters.last !== undefined) {
		if (paramAdded)
			query += " AND ";
		query += "last_name = ?";
		paramValues.push(parameters.last);
		paramAdded = true;
	}

	return {
		"query" : query,
		"paramValues" : paramValues
	};
}