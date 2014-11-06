var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var zxcvbn = require("zxcvbn");
var userSchema = require('../model/userSchema');

// Minimum password score based on scale from zxcvbn:
// [0,1,2,3,4] if crack time (in seconds) is less than
// [10**2, 10**4, 10**6, 10**8, Infinity].
// (useful for implementing a strength bar.)
const MIN_PASSWORD_SCORE = 2;

passport.serializeUser(function(user, done) {
	console.log('test position serialize + test des param');
	console.log('id du user : ' + user._id);
	console.log('password du user : ' + user.password);
	console.log('mail du user : ' + user.mail);
	done(null, user._id);
});

passport.deserializeUser(function(id, done) {
	console.log('test position deserialize');
	userSchema.User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy({usernameField: 'mail'}, function(username, password, done) {
	console.log('appel de passport.use');
	userSchema.User.findOne({mail: username}, function(err, user){
		if(err) return done(err);
		if(!user){
			console.log('passport.user : !user est vrai' + username);
			return done(null, false, {message: 'Unknown user' + username});}
		user.comparePassword(password, function(err, isMatch){
			if(err) return done(err);
			if(isMatch) return done(null, user);
			else{
				console.log('passport.use : invalid password');
				return done(null, false, {message: 'Invalid Password'});}
		});
	});
}));

// Simple route middleware to ensure user is authenticated.  Otherwise send to login page. Ou le mettre ?
exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
	console.log('test position ensureAuthenticated');
	if(req.isAuthenticated()) { return next(); }
	console.log('ur not connected');
	res.redirect('/identite_formulaire');
};

/*
//QUAND ON AURA DES ADMINS
// Check for admin middleware, this is unrelated to passport.js
// You can delete this if you use different method to check for admins or don't need admins
exports.ensureAdmin = function ensureAdmin(req, res, next) {
        if(req.user && req.user.admin === true)
            next();
        else
            res.send(403);
};
*/

// Helper function to create a new user
exports.createUser = function(user, done) {
	console.log("on crée un user partie user.js");
	console.log(user);
	
	//correspondance des passwords
	passCorrespondance(user.password, user.confirmPassword);
	
	//solidité du password
	passSolidity(user.password);

    var user = new userSchema.User(user);

    user.save(function(err) {
        if(err) {
            done(err);
        } else {
            done(null, user);
        }
    });

};

// Updating an existing user
exports.updateUser = function(user, done) {
	console.log("On modifie un user partie user.js" + user._id);
	
	// modification mot de passe
	// correspondance des passwords
	// passCorrespondance(user.password, user.confirmPassword);
	
	// solidité du password
	// passSolidity(user.password);
	
	delete user.captcha;	// Suppression du captcha de l'utilisateur
	user.modifiedOn = Date.now();	// Mise à jour de la date de modification du profil
	var userToUpdate = user;
	console.log(userToUpdate);
	userSchema.User.update({_id: user._id}, userToUpdate, {}, function(err, updatedUser) {
		if(err)
		{
			console.log(err);
		}
		else
		{
			done(null, updatedUser);
		}
	});
};

passCorrespondance = function(pass, confirmPass){
	if(pass !== confirmPass)
	{
		console.log(pass);
		console.log(confirmPass);
		console.log("Passwords must match");
		return done(null, false, {message: "Passwords must match"});
	}	//ne redirige pas
}

passSolidity = function(pass){
	var result = zxcvbn(pass);
    if (result.score < MIN_PASSWORD_SCORE)
	{
		console.log('Password is too simple');
    	return done(null,false);
	}	//ne redirige pas
}