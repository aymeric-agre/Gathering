	/*	********
	REQUIERE
	********	*/
var fs=require("fs");
var projectSchema = require('../model/projectSchema'); // appel du modèle mongoose projet
var userSchema = require('../model/userSchema');

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
	

	
/*	Récupérer les projets de l'utilisateur	*/
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

/*	Réupère un projet à partir de son id	*/
exports.oneProject = function(req,res, next) {
	console.log("Cherche le projet_id : " + req.params.id);	
	projectSchema.Project.findById(req.params.id, function(err, project) {	//On cherche le projet avec cet Id
		if (err) {console.log(err)} return next(err);
	res.send(project);
	});
};

/*	Récupère tous les projets	*/	
/* exports.allProjects = function(req, res, next) {
	var query = projectSchema.Project.find();
	console.log('on cherche des projets');
	query.exec(function(err, projects) {
		if (err) {return next(err);}	//S'il y a une erreur, c'est géré par le middlewre error
		else {
			console.log(projects);
			res.send(projects);
		}
	});
}; */
exports.allProjects = function(req,res, next) {
	console.log("Cherche des projets");	
	projectSchema.Project.find(function(err, projects) {	//On cherche le projet avec cet Id
		if (err) {console.log(err); return next(err);}
		else {res.send(projects);}
	});
};	
	
	
	
/*	Rechercher une  projets à partir de son nom	*/
exports.doSearchProject = function(req, res) {
	console.log("Chercher une liste de projets pour "+req.body.tag);
	if(req.body.tag) {
		projectSchema.Project.findByName(req.body.tag, function(err, projectNom) {	//ATTENTION : on cherche selon les noms ici
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
				setTimeout(function(){res.redirect('/');},1000);
			});
		});
	});
};
