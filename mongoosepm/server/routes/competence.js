/*	********
	REQUIERE
	********	*/
var fs=require("fs");
var competenceSchema = require('../model/competenceSchema'); // appel du modèle mongoose competence

/*	Chercher tous les comptences */
exports.allCompetences = function(req,res, next) {
	console.log("Cherche des competences");	
	competenceSchema.Competence.find(function(err, competences) {	//On cherche le projet avec cet Id
		if (err) {console.log(err); return next(err);}
		else {res.send(competences);}
	});
};	

exports.doSaveCompetence = function(req, res) {
	console.log('La competence est ' + req.body.competence);
	//var newCompetence = new competenceSchema.Competence(req.body.competence);
	competenceSchema.Competence.create({competence : req.body.competence, user : req.body.user}, function(err, savedCompetence){ 
		if(err){
			console.log(err);
			console.log(req.body.competence);
			res.send(404);
		}else{
			console.log(savedCompetence);
			res.send(200);
		}
	});
};