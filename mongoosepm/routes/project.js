/*	********
	REQUIERE
	********	*/
var fs=require("fs");
var projectSchema = require('../model/projectSchema'); // appel du modèle mongoose projet
var userSchema = require('../model/userSchema');

/*	*********
	FONCTIONS
	*********	*/
/*	Fonction qui regarderait si on est connecté aavant de choisir le layout	*/	
function isLogged() {
	if(req.session.loggedIn === true) {res.render('connected', data);}		//S'il est loggé on rend connected
	else {res.render('default', data);}										//S'il est pas loggé on rend default
};

/*	******
	PROJET
	******	*/


/* Projet Gathering */
exports.project_gathering = function(req, res){
	console.log("une requete pr projet_gathering");
	res.render('project_gathering', function(err,html){
		var data={
		title: 'Gathering',
		body: html
		};
		var data_connected = {
		title: "Gathering",
		body: html,
		user:req.session.user
		};
		if(req.session.loggedIn === true) {res.render('connected', data_connected);}		//S'il est loggé on rend connected
		else {res.render('default', data);}
		});
};

/*	Projet PE	*/
exports.project_gatherer = function(req, res){
	console.log("une requete pr projects_gatherer");
	res.render('project_gatherer', function(err,html){
		var data={
		title: 'Gatherer',
		body: html
		};
		var data_connected = {
		title: "Gatherer",
		body: html,
		user:req.session.user
		};
		if(req.session.loggedIn === true) {res.render('connected', data_connected);}		//S'il est loggé on rend connected
		else {res.render('default', data);}
		});
};
	

/*	*************
	LISTE PROJETS
	*************	*/
	
/* Page de la liste de projets */
exports.projects_liste = function(req, res){
	console.log("une requete pr projects_liste");
	res.render('projects_liste', {user: req.session.user}, function(err,html){
		var data={
		title: 'Mes projets',		
		body: html
		};
		var data_connected = {
		title: "Mes projets",
		body: html,
		user:req.session.user
		};
		if(req.session.loggedIn === true) {res.render('connected', data_connected);}		//S'il est loggé on rend connected
		else {res.render('default', data);}
		});
};
	
/*	Récupérer les projets de l'utilisateur	*/
exports.byUser = function (req, res) {
	console.log("récupérer les projects de l'utilisateur");
	if (req.params.userid) {											//Si on a un userid
		projectSchema.Project.findByUserID(req.params.userid, function(err, projets) {	//on utilise la méthode créée dans Projet.js
				if(!err) {
					console.log(projets);
					res.json(projets);									//On transforme la liste de projets en json
				}else{
					console.log(err);
					res.json({"status":"error", "error": "Error finding projects"});	//message d'erreur Json
					}
				})
			}else{
				console.log("Pas d'id utilisateur fournie");
				res.json({"status":"error", "error": "No user id supplied"});
			}
		};
		
exports.byProjectId = function (req, res) {
	console.log("récupérer les projets cherchés");
	if (req.params.projectId) {											//Si on a un projectId
		projectSchema.Project.findById(req.params.projectId, function(err, projets) {	//on utilise la méthode créée dans Projet.js
				if(!err) {
					console.log(projets);
					res.json(projets);									//On transforme la liste de projets en json
				}else{
					console.log(err);
					res.json({"status":"error", "error": "Error finding projects"});	//message d'erreur Json
					}
				})
			}else{
				console.log("Pas d'id utilisateur fournie");
				res.json({"status":"error", "error": "No user id supplied"});
			}
		}; 
				
/*	***********
	CRUD PROJET
	***********		*/

/*	Créer un projet	*/
exports.doCreateProject = function(req, res) {
	projectSchema.Project.create({
		projectName: req.body.projectName,
		presentation : req.body.presentation,
		createdBy: req.session.user._id,
		createOn : Date.now(),
		members : req.body.members.split(","),	//on sépare chaque nom récupéré
		groups: req.body.groups.split(","),
		needs: req.body.needs.split(","),
		themes: req.body.themes.split(",")
	}, function(err, project){ 
		if(err){
			console.log(err);
			console.log(req.body.projectName);
			console.log("Le projet créé est " + project);
			res.redirect('/projets_liste');
		}else{
			console.log(project);
			res.redirect('/project/' + project._id);
		}
	});
};

/*	********************
	RECHERCHE DE PROJETS
	********************	*/
/*	Ouvrir un de ses projets à partir de son id	*/
exports.project = function(req,res) {
	console.log("Cherche le projet_id : " + req.params.id);
	if(req.params.id) {		//si on a bien un id en paramêtre dans l'url
		projectSchema.Project.findById(req.params.id, function(err, projectInfo) {	//On cherche le projet avec cet Id
			if(err)	{
				console.log(err);
				res.redirect('/user?404=project');
			}else {
				console.log(projectInfo);
				res.render('project', {project: projectInfo}, function(err,html){	//on renvoie la page projet
					var data={
					title: projectInfo.projectName,
					body: html
					};
					var data_connected = {
					title: projectInfo.projectName,
					body: html,
					user:req.session.user
					};
					if(req.session.loggedIn === true) {res.render('connected', data_connected);}		//S'il est loggé on rend connected
					else {res.render('default', data);}
					});
				}
		});
	} else {			//Si on a pas d'id en paramêtre
		res.redirect('/');	//on renvoie la page d'accueil
	}
};

/*	Rechercher une  projets à partir de son nom	*/
exports.doSearchProject = function(req, res) {
	console.log("Chercher une liste de projets pour "+req.body.tag);
	if(req.body.tag) {
		projectSchema.Project.findByName(req.body.tag, function(err, projectNom) {
			if(err){
				console.log(err);
				res.redirect('/recherche/?500');
			}else{
				console.log(projectNom);
				if(projectNom[0] != null){				
					req.projects = projectNom[0].id;	//On enregiste l'id du premier projetpour l'instant pour l'envoyer dans le res.render 'recherche'
					res.redirect('/project/'+req.projects);
				}else{
					res.redirect('/search_project/?404=user');
				}
			}
		});
	}else{
		res.redirect('/search_project');
	}
};
/* ******************************* 
   SUPPRIMER TOUS LES UTILISATEURS
   ******************************* */

/* Fonction pour effacer la bdd contenant les utilisateurs */
exports.doDeleteAllProjects = function(req, res){
	projectSchema.Project.find({}, function(err, projets){
		console.log(projets);
		projectSchema.Project.remove({}, function(err){
			if(err) return console.error(err);
			console.log("base de donnees utilisateurs effacee");
			projectSchema.Project.find({}, function(err, insc){
				if(err) return console.error(err);
				console.log(insc);
				setTimeout(function(){res.redirect('index_default');},1000);
			});
		});
	});
};
