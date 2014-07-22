var security = require('security');
var mysql = require('mysql');
var connection = mysql.createConnection({
	host	 : 'localhost',
	port	 : 3306,
	database : 'home_server',
	user	 : 'root',
	password : ''
});

exports.addUser = function (user, callback) {
	connection.connect();

	var hashedPw = null;
	var salt = null;
	boolean returned = false;
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

	connection.query(queries.INSERT_USER, [ user.first, user.last, user.uname, hashedPw, salt, user.email ], new function(err, results){
		if (!(err === undefined)) {
			callback(err);
		}
	});

	connection.end();
}

var queries = [
	INSERT_USER : "INSERT INTO USERS (first_name, last_name, uname, hashed_pword, salt, email) values (?, ?, ?, ?, ?, ?)"
];