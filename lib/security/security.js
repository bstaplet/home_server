var bcrypt = require('bcrypt');

exports.cryptPw = function(pw, callback) {
	bcrypt.genSalt(10, function(err, salt) {
    if (err) 
      return callback(err);

    bcrypt.hash(password, salt, function(err, hash) {
      return callback(err, hash, salt);
    });

  });
}

exports.comparePassword = function(password, userPassword, callback) {
   bcrypt.compare(password, userPassword, function(err, isPasswordMatch) {
      if (err) 
        return callback(err);
      return callback(null, isPasswordMatch);
   });
};