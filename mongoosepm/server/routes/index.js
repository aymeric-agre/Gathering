/*
 * GET home page.
 */
 
var fs=require("fs");
var passport = require('passport');
var userSchema = require('../model/userSchema');
var projectSchema = require('../model/projectSchema');
var groupSchema = require('../model/groupSchema');
var themeSchema = require('../model/themeSchema');
var competenceSchema = require('../model/competenceSchema');
var statutSchema = require('../model/statutSchema');
var languageSchema = require('../model/languageSchema');
var pass = require('../model/pass');	//Remarque : problème avec zxcvbn


/*	**************
	A LA CONNEXION
	**************	*/

exports.index = function(req, res) {
	res.redirect('/#' + req.originalUrl);	//redirige automatiquement en cas d'erreur
};

exports.layout = function(req, res) {
	console.log('index.layout : req.isAuthenticated vaut ');
	console.log(req.isAuthenticated());
	if(req.isAuthenticated()) {
		console.log('index.layout : qq est connecté');
		console.log(req.user);
		res.render('layout', {currentUser : req.user ? JSON.stringify(req.user) : 'null',
							connected : req.isAuthenticated()});	//Fourni un objet user pour toutes les requêtes
	} else {
		console.log("index.layout : personne de connecté");
		res.render('layout', {currentUser : "{}", connected : req.isAuthenticated()});
	}
};

/*	************
	LOGIN LOGOUT
	************	*/

/*	Se connecter	*/
exports.doLogin = function(req, res, next) {
	console.log("avant server "+req.isAuthenticated());
	passport.authenticate('local', function(err, user, info) {	//passport.use dans pass.js
		if (err) return next(err);
		console.log('doLogin : voici le user' + user + info + err);
		if (!user) {			//La vérif se fait dès le début avec passport.authenticate (qui appelle passport.use) Ce if(!user) cherche ensuite à savoir si la variable user contient qqchose, mais personne n'est loggé à ce stade.
			console.log('doLogin : l\'utilisateur n\'est pas reconnu');
			req.session.messages =  [info.message];		//aucune idée du message, toujours undefined
			console.log('doLogin : la valeur de req.session.message est :' + req.session.message);
			return res.send(404);
		}
		req.login(user, function(err) {
			if (err) return next(err);
			res.send(req.isAuthenticated());	
		});
	})(req, res, next);
};


/*	Se déconnecter	*/
exports.doLogout = function(req, res) {
	console.log('se déconnecte');
	req.logout();
	res.send(req.isAuthenticated());
};


/*	Vérifie que l'utilisateur est loggé	*/ 
/*exports.currentUser = function(req, res, err) { 
	if(req.isAuthenticated()) {	//Si la session est connecté
		console.log('isLoggedIn : peut passer');
		res.send(req.user);	//on renvoie l'utilisateur
	} else { 
		console.log('isLoggedIn : ne doit pas passer car personne de connecté');
		res.send(404);
		}				//Sinon on renvoie un erreur	
	//res.send(req.isAuthenticated() ? req.user : '0'); 	//Fonction d'authentification faite avec passeport
};*/



/*	*********
	RECHERCHE
	*********	*/
/*	Afficher la page recherche	*/
/* exports.search_user = function(req, res) {
	console.log("ouverture de la page recherche");
	res.render('search_user', {users: req.users}, function(err, html){	//Les données de user sont dans la session
		var data = {
				title: "Recherche",
				body: html
			};
		var data_connected = {
				title: "Recherche",
				body: html,
				user:req.session.user
			};
			if(req.session.loggedIn === true) {res.render('connected', data_connected);}		//S'il est loggé on rend connected
			else {res.render('default', data);}
		});
	console.log('req.projects '+req.projects);
}; */

/*	On vérifie qu'on a un projet recherché	*/
exports.searchProject = function(req, res) {
	console.log("Page de recherche avec les projets : " + req.params.projectId);
	if(req.params.projectId) {		//si on a bien un id en paramêtre dans l'url
		projectSchema.Project.findById(req.params.projectId, function(err, projectListe) {	//On cherche le projet avec cet Id
			if(err)	{
				console.log(err);
				res.redirect('/search?404=project');
			}else {
				console.log(projectListe);
				res.render('search_project', {projects: projectListe}, function(err,html){	//on renvoie la page projet
					var data={
					title: "Recherche",
					body: html
					};
					var data_connected = {
					title: "Recherche",
					body: html,
					user:req.session.user
					};
					if(req.session.loggedIn === true) {res.render('connected', data_connected);}		//S'il est loggé on rend connected
					else {res.render('default', data);}
					});
				}
		});
	} else {			//Si on a pas d'id en paramêtre
		res.redirect('/search_project');
	}
};

/* Fonction qui fait la recherche de personnes */
exports.recherche_personne_Traitement = function(req, res){
	console.log("une requete pr traiter la recherche de personnes et renvoyer les résultats");
	var Users = userSchema.User.find({
		competences: req.body.competences,
		area : req.body.area,
		interests: req.body.interests
		})
};

