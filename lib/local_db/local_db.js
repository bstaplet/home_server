var security = require('../security');
var user = require('../user');
var mysql = require('mysql');
var connection = mysql.createConnection({
	host	 : 'localhost',
	port	 : 3306,
	database : 'home_server',
	user	 : 'root',
	password : ''
});

exports.addUser = function (user, callback) {

	var hashedPw = null;
	var salt = null;
	var returned = false;
	security.cryptPw(user.pword, new function(err, hash, pwSalt){
		if (err === undefined) {
			hashedPw = hash;
			salt = pwSalt;
		}
		else {
			callback(err);
		}
		returned = true;
	});

	while(!returned);

	connection.connect();
	connection.query(queries.INSERT_USER, [ user.first, user.last, user.uname, hashedPw, salt, user.email ], new function(err, results){
		connection.release();
		if (!(err === undefined)) {
			callback(err);
		}
	});
	connection.end();
}

exports.findUser = function (parameters, callback) {
	var query = buildFindUserQuery(parameters);
	var results = null;

	connection.connect();
	connection.query(query.query, query.paramValues, new function(err, rows) {
		connection.release();
		if (err !== undefined) {
			callback(err);
		}
		else {
			var users = [];
			for (var i = 0; i < rows.length; i++) {
				users.push(new user.User(rows[i].first_name, rows[i].last_name, rows[i].uname, null, rows[i].email));
			}
			callback(undefined, users);
		}
	});
	connection.end();
}

var queries = {
	INSERT_USER : "INSERT INTO USERS (first_name, last_name, uname, hashed_pword, salt, email) values (?, ?, ?, ?, ?, ?)",
	FIND_USER : "SELECT * FROM USERS WHERE "
};

/***** Unexported Functions *****/

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