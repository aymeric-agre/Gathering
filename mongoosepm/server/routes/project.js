	/*	********
	REQUIERE
	********	*/
var fs=require("fs");
var async = require("async");
var userSchema = require('../model/userSchema');
var projectSchema = require('../model/projectSchema');
var groupSchema = require('../model/groupSchema');
var themeSchema = require('../model/themeSchema');
var competenceSchema = require('../model/competenceSchema');
var statusSchema = require('../model/statusSchema');
var languageSchema = require('../model/languageSchema');

/*	******
	PROJET
	******	*/


		
	
/*	***********
	CRUD PROJET
	***********		*/

/*	Créer un projet	*/
exports.doCreateProject = function(req, res) {
	var projectCompetences = req.body.dataToServer.competences;	//On récupère le nom pour chercher l'objet
	var projectThemes = req.body.dataToServer.themes;
	
	async.series([
		function(callback) {
			async.each(projectCompetences, function(competenceToFind, callback2){
				competenceSchema.Competence.findOne({competence : competenceToFind}, function(err, competence){
					if(!err){
						req.body.public.competences.push(competence._id);	//On ajoute l'objet competence dans le req.body approprié
					} else {
						console.log(err);
					}
				callback2(null, null);	//Callback du async.each
				});	
			}, callback);				//Callback de la fonction pour async.series
		},
		function(callback) {
			async.each(projectThemes, function(themeToFind, callback2){
				themeSchema.Theme.findOne({theme : themeToFind}, function(err, theme){
						if(!err){
							req.body.public.themes.push(theme._id);
						} else {
							console.log(err);
						}	
				callback2(null, null);
				}); 	
			}, callback);
		}
	], function(err, results) {
		//On crée le projet
		var projectToSave = new projectSchema.Project({public : req.body.public, private : req.body.private});
		projectToSave.save(function(err, project){ 
			if(!err){
				console.log("Le projet créé est " + project);
				projectToUser(req.body.public.createdBy.user, project._id, res.send(project));	//On met le projet dans le user et on sauvegarde tout				
			}else{
				console.log(err);
			}
		});
	});
};

//Fonction appelée par doCreateProject pour mettre le projet dans l'utiliseur
function projectToUser(userId, projectId, callback){
	userSchema.User.findOne({_id : userId}, function(err, user){
		user.public.projects.push(projectId);
		user.save(callback);
	});
}

/*	********************
	RECHERCHE DE PROJETS
	********************	*/

/*	Réupère un projet à partir de son id	*/
exports.oneProject = function(req,res, next) {	
	console.log("Projet recherché : " + req.params.id);
	projectSchema.Project
		.findOne({"_id" : req.params.id})
		.populate("public.competences public.themes public.members")
		.exec(function(err, project){
			if (err) {console.log(err);}
			else {
				console.log("Projet : " + project);
				res.send(project);}
		});
};


/*	Récupère tous les projets	*/	
exports.allProjects = function(req,res, next) {
	console.log("Cherche des projets");	
	projectSchema.Project.find({}, "public", function(err, projects) {	//On cherche le projet avec cet Id
		if (err) {
			console.log(err);
			return next(err);
		}
		else {
			res.send(projects);
		}
	});
};	
	
/*	****************
	MEMBRE DU PROJET
	****************	*/

/*	Vérifie si l'utilisateur est membre du projet	*/
exports.isMember = function(req, res, next)	{
	var userId = req.params.userId;
	var projectId = req.params.projectId;
	var isMember = false;
	projectSchema.Project.findOne({"_id" : projectId}, function(err,project){
		if(err){console.log(err);}
		else{
			if(project.public.members.indexOf(userId) != -1){	//Si l'utilisateur est membre du projet
				isMember = true;
				res.send(isMember);
			} else {res.send(isMember);}
		}
	});
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
