exports.User = function User (first, last, uname, pword, email) {
	this.first    = first;
	this.last     = last;
	this.uname    = uname;
	this.pword    = pword;
	this.email    = email;
	this.salt     = null;
	this.hashedPw = null;
	
	// Begin User functions
}