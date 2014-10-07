
/*	********
	REQUIERE
	********	*/
var fs=require("fs");
var userSchema = require('../model/userSchema');
var crypto = require("crypto");
var passport = require('passport');
var pass = require("../model/pass");
	
		
	
/*	***************
	CREER UN COMPTE
	***************	*/

/*	Créer un utilisateur	*/
exports.doCreateUser = function(req,res,done){	// fonction de traitement du formulaire d'inscription
	var body = req.body;
	console.log(body.user);
	pass.createUser(body.user,
		function(err,user){
		 if (err) return res.render('user_form', {user: req.user, message: err.code === 11000 ? "User already exists" : err.message});
            req.login(user, function (err) {
                if (err) {return next(err);}
                // successful login
				else {
					console.log("Je modifie la connexion ? " + req.isAuthenticated());	
					console.log("Le nouvel utilisateur est " + req.user.mail);	
					res.send(req.isAuthenticated());
				}
                //le login de la version sans passport, à supprimer lors de a suppression de la variable loggedIn
				//req.session.loggedIn = true;
				//req.session.currentUser = user;
				//res.send(req.session.currentUser);
            })
        });
};


/*	******************
	MODIFIER UN COMPTE
	******************	*/
	
/*	Modifier un utilisateur	*/
exports.updateUser = function(req, res, next){	
	// userSchema.User.findById(req.params.id, function(err, userToUpdate) {	//On cherche l'utilisateur avec cet Id
		// if (err) {console.log(err); return next(err);}
		// else {
		var userToUpdate = new userSchema.User(userToUpdate);
			userToUpdate.save({'_id' : req.params.id},  {$set : {'mail' : req.body.mail}}, function(err, WriteResult){
				if (err) {console.log(err); return next(err);}
				else {
				//res.send(userUpdated);	//On récupère 1 ?? Je sais pas pourquoi
				console.log("user edité : " + WriteResult);
			}});
		// }
	// })
};

/*	supprimer un utilisateur	*/
exports.identite_suppression = function(req, res){	// fonction de suppression du compte -> à relier au bouton supprimer mon compte de la page identite
};


/*	*********************
	RECHERCHE UTILISATEUR
	*********************	*/

/*	Réupère un utilisateur à partir de son id	*/
exports.oneUser = function(req,res, next) {
	console.log("Cherche le user_id : " + req.params.id);	
	userSchema.User.findById(req.params.id, function(err, user) {	//On cherche l'utilisateur avec cet Id
		if (err) {console.log(err); return next(err);}
		else {
		console.log(user);
		res.send(user);}
	});
};

/*	Récupère tous les utilisateurs	*/	
exports.allUsers = function(req, res, next) {
	var query = userSchema.User.find();
	query.exec(function(err, users) {
		if (err) {return next(err);}	//S'il y a une erreur, c'est géré par le middlewre error
		else {res.send(users);}
  });
};

exports.currentUser = function(req,res,next) {
	if (req.isAuthenticated()) {
		console.log('On cherche currentUser : ' + req.user);
		res.send({user : req.user , connexion : req.isAuthenticated()});
	} else {res.send({user : "" , connexion : req.isAuthenticated()});}
};
	
/*	Rechercher un utilisateur à partir de son nom	*/
exports.doSearchUser = function(req, res) {
	console.log("Chercher un utilisateur avec le nom "+req.body.tag);
	if(req.body.tag) {
		userSchema.User.findByName(req.body.tag, function(err, userNom) {
			if(err){
				console.log(err);
				res.redirect('/search_user/?500');
			}else{
				console.log(userNom);
				if(userNom[0] != null){				
					req.users = userNom[0].id;	//On enregiste la liste d'utilisateurs pour l'envoyer dans le res.render 'recherche'
					res.redirect('/user/'+req.users);
				}else{
					res.redirect('/search_user/?404=user');
				}
			}
		});
	}else{
		res.redirect('/search_user');
	}
};


/* ******************************* 
   SUPPRIMER TOUS LES UTILISATEURS
   ******************************* */

/* Fonction pour effacer la bdd contenant les utilisateurs */
exports.doDeleteAllUsers = function(req, res){
	userSchema.User.find({}, function(err, gens){
		console.log(gens);
		userSchema.User.remove({}, function(err){
			if(err) return console.error(err);
			console.log("base de donnees utilisateurs effacee");
			userSchema.User.find({}, function(err, insc){
				if(err) return console.error(err);
				console.log(insc);
				setTimeout(function(){res.redirect('/');},1000);
			});
		});
	});
};
