var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var zxcvbn = require("zxcvbn");
var userSchema = require('../model/userSchema');
var projectSchema = require('../model/projectSchema');
var groupSchema = require('../model/groupSchema');
var themeSchema = require('../model/themeSchema');
var competenceSchema = require('../model/competenceSchema');
var statusSchema = require('../model/statusSchema');
var languageSchema = require('../model/languageSchema');

// Minimum password score based on scale from zxcvbn:
// [0,1,2,3,4] if crack time (in seconds) is less than
// [10**2, 10**4, 10**6, 10**8, Infinity].
// (useful for implementing a strength bar.)
const MIN_PASSWORD_SCORE = 2;

passport.serializeUser(function(user, done) {
	console.log('test position serialize + test des param');
	console.log('id du user : ' + user._id);
	console.log('password du user : ' + user.private.password);
	console.log('mail du user : ' + user.private.mail);
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
	userSchema.User.findOne({"private.mail": username}, function(err, user){
		if(err){
			console.log('erreur passport.use dans pass.js');
			return done(err);
		}
		else if(!user){
			console.log('passport.user : !user est vrai' + username);
			return done(null, false, {message: 'Unknown user' + username});
		}
		else{
			user.comparePassword(password, function(err, isMatch){
				if(err){
					return done(err);
				}
				else if(isMatch){
					return done(null, user);
				}
				else{
					console.log('passport.use : invalid password');
					return done(null, false, {message: 'Invalid Password'});
				}
			});
		}
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
	console.log("on crée un user dans pass.js");
	console.log(user);
	
	//correspondance des passwords
	passCorrespondance(user.private.password, user.private.confirmPassword);
	
	//solidité du password
	passSolidity(user.private.password);

    var user = new userSchema.User(user);

    user.save(function(err) {
        if(err) 
		{
            done(err);
        }
		else 
		{
            done(null, user);
        }
    });

};

// Updating an existing user
exports.updateUser = function(userToUpdate, done) {
	console.log("identifiant utilisateur à modifier dans pass.js : " + userToUpdate._id);
	
	userToUpdate.modifiedOn = Date.now();
	console.log(userToUpdate);	
	
	statusSchema.Status.findOne({name: userToUpdate.public.status},	function(err, status){
		if(err)
		{
			console.log(err);
			return handleError(err);
		}
		else if(!status)	//Si on ne trouve pas de status existant on le créé
		{
			var status = new statusSchema.Status({
				name: userToUpdate.public.status,
				members: userToUpdate._id});
			console.log("création d'un nouveau statut: " + status);
			status.save(function(err, status, done){
				if(err)
				{
					console.log(err);
				}
				console.log(status);
			});
		}
		else if(status)
		{
			console.log("le statut éxiste déjà")
			status.members.push(userToUpdate._id);
			status.save(function(err, status, done){
				if(err)
				{
					console.log(err);
				}
				console.log(status);
			});
		}
		
		userSchema.User.findOne({_id: userToUpdate._id}, function(err, user){
			if(err)
			{
				console.log(err);
			}
			else
			{
				userToUpdate.public.status = user.public.status;
				console.log(userToUpdate.public.status);
				userToUpdate.public.status.push(status._id);
			}
			
			userSchema.User.findByIdAndUpdate(userToUpdate._id, userToUpdate, function(err, updatedUser){
				if(err)
				{
					console.log(err);
				}
				else
				{
					done(null, updatedUser);
				}
			});
		});
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