/*	********
	REQUIERE
	********	*/
var fs=require("fs");
var themeSchema = require('../model/themeSchema'); // appel du modèle mongoose theme

/*	Chercher tous les themes */
exports.allThemes = function(req,res, next) {
	console.log("Cherche des themes");	
	themeSchema.Theme.find(function(err, themes) {	//On cherche le projet avec cet Id
		if (err) {console.log(err); return next(err);}
		else {res.send(themes);}
	});
};	

exports.doSaveTheme = function(req, res) {
	console.log(req.body.themes);
	themeSchema.Theme.create({theme : req.body.themes}, function(err, savedTheme){ 
		if(err){
			console.log(err);
			console.log(req.body.themes);
			res.send(404);
		}else{
			console.log(savedTheme);
			res.send(200);
		}
	});
};