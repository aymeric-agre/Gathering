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

/*	Chercher tous les mails */
exports.allMails = function(req, res){
	console.log("Je cherche des mails");
	userSchema.Mail
		.find({'userRecipient' : req.params.userId})
		.populate("userRecipient userSender")
		.exec(function(err, mails){
			if (err) {console.log(err);}
			else {res.send(mails); console.log(mails);}
		});
};

/*	Envoyer un mails*/
exports.sendMail = function(req, res){
	var i;
	var userId = req.params.userId;
	var mailToSave = new userSchema.Mail({userSender : req.body.userSender, userRecipient : req.body.userRecipient, content : req.body.content, title : req.body.title});
	mailToSave.save(function(err, mail){ 
		if(err){
			console.log(err);			
		}else{
			console.log("mail normal : " + mail);
			for(i=0; i<mail.userRecipient.length; i++){
				userSchema.User.findOne({'_id': mail.userRecipient[i]}, function(err,recipient){
					console.log("Destinataire " + recipient);
					recipient.private.mailbox.push(mail._id);
				});
			};
			res.send(200);
		}
	});
}