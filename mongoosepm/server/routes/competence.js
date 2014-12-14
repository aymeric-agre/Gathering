/*	********
	REQUIERE
	********	*/
var fs=require("fs");
var userSchema = require('../model/userSchema');
var projectSchema = require('../model/projectSchema');
var groupSchema = require('../model/groupSchema');
var themeSchema = require('../model/themeSchema');
var competenceSchema = require('../model/competenceSchema');
var statusSchema = require('../model/statusSchema');
var languageSchema = require('../model/languageSchema');

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
	competenceSchema.Competence.create({competence : req.body.competence}, function(err, savedCompetence){ 
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