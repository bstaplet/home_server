var bcrypt = require('bcrypt');

exports.cryptPw = function(pw, callback) {
	bcrypt.genSalt(10, function(err, salt) {
    if (err) 
      return callback(err);

    bcrypt.hash(pw, salt, function(err, hash) {
      return callback(err, hash, salt);
    });

  });
}

exports.comparePassword = function(pw, userPassword, callback) {
   bcrypt.compare(pw, userPassword, function(err, isPasswordMatch) {
      if (err) 
        return callback(err);
      return callback(undefined, isPasswordMatch);
   });
};