/*
 * GET home page.
 */
 
var fs=require("fs");
var userSchema = require('../model/userSchema'); // appel du modèle mongoose utilisateur 
var projectSchema = require('../model/projectSchema'); // appel du modèle mongoose projet

/*	*********
	FONCTIONS
	*********	*/
/*	Fonction qui regarderait si on est connecté aavant de choisir le layout	*/	
function isLogged() {
	if(req.session.loggedIn === true) {res.render('connected', data);}		//S'il est loggé on rend connected
	else {res.render('default', data);}										//S'il est pas loggé on rend default
};

/*	**************
	A LA CONNEXION
	**************	*/
/*	Renvoie l'accueil connecté ou pas selon les cookies	*/
exports.index = function(req, res) {
	if(req.session.loggedIn === true) {res.redirect('/index_connected');}		//S'il est loggé on renvoie index_connecté
	else {res.redirect('/index_default');}							//S'il est pas loggé on renvoie index_default
};
	
/*accueil non-connectée*/
exports.index_default = function(req, res){ // appel de la page index lorsqu'on est déconnecté
	console.log("une requete pr /");
	res.render('index', function(err,html){	// 1er rendu de l'index
		var data={
		title: 'Accueil',
		body: html
		};
	res.render('default', data); // 2nd rendu avec le layout correspondant au profil déconnecté appelé en callback
		});
};

/*accueil connecté*/
exports.index_connected = function(req, res){	// appel de la page index lorsqu'on est connecté
	console.log("une requete pr /");
	res.render('index', {user:req.session.user, userID: req.session.user._id}, function(err,html){	// on récupère les infos de l'utilisateur connecté et ouvre la page
		var data_connected={
		title: 'Accueil',
		body: html,
		user:req.session.user
		};
	res.render('connected', data_connected);	// 2nd rendu en appelant le layout correspondant au profil connecté appelé en callback
		});
};

/*	************
	LOGIN LOGOUT
	************	*/
	
/*	Se connecter	*/
exports.doLogin = function (req, res) {
	if(req.body.mail) {											//Si ce qui est dans la case est bien un email
		userSchema.User.findOne({'mail':req.body.mail},function(err, user) {	//On recherche un utilisaeur (inscrit)
			if(!err) {											//S'il n'y a pas d'erreur
				if(!user) {										//S'il n'y a pas d'utilisateur trouvé
					res.redirect('/index_default?404=user');	//On renvoie sur la page d'accueil avec une erreur
				}else{											//Si on trouve un utilisateur
					req.session.user = user;					//On met ses données dans un cookie de session
					req.session.loggedIn = true;				//On le considère connecté
					console.log(user + "s'est connecté");		
					user.update(
						{_id:user._id},							//On met à jour l'id
						{$set:{lastLogin : Date.now()} },		//On met à jour la dernière date de connexion (ne fonctionne pas)
						function(){
							res.redirect('/index');						//On retourne vers la page index_connected
						});
					}
			}else{												//S'il y a une erreur
				res.redirect('/index_default?404=error');
				}
			}
		);
	} else {													//Si ce n'est pas un email
		res.redirect('/index_default?404=error');				
	}
};

/*	Se déconnecter	*/
exports.doLogout = function (req, res) {
	console.log(req.session.user);
	req.session.loggedIn = false;
	console.log(req.session.user.mail + " s'est déconnecté");
	res.redirect('/index');
};

/*	*********
	RECHERCHE
	*********	*/
/*	Afficher la page recherche	*/
exports.recherche = function(req, res) {
	console.log("ouverture de la page recherche");
	res.render('recherche', {users: req.users, projects: req.projects}, function(err, html){	//Les données de user sont dans la session
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
};

/*	On vérifie qu'on a un projet recherché	*/
exports.rechercheProject = function(req, res) {
	console.log("Page de recherche avec les projets : " + req.params.projectId);
	if(req.params.projectId) {		//si on a bien un id en paramêtre dans l'url
		projectSchema.Project.findById(req.params.projectId, function(err, projectListe) {	//On cherche le projet avec cet Id
			if(err)	{
				console.log(err);
				res.redirect('/search?404=project');
			}else {
				console.log(projectListe);
				res.render('recherche', {projects: projectListe}, function(err,html){	//on renvoie la page projet
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
		res.redirect('/recherche');
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

