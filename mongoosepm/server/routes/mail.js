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
		.find({})
		.populate("userRecipient userSender")
		.exec(function(err, mails){
			if (err) {console.log(err);}
			else {res.send(mails);}
		});
};

/*	Envoyer un mails*/
exports.sendMail = function(res, req){
	var userId = req.params.userId;
	var mailToSave = new userSchema.Mail({mail : req.body.public});
		mailToSave.save(function(err, mail){ 
			if(err){
				console.log(err);			
			}else{
				for(i=0; i<mail.userRecipient.length; i++){
					userSchema.User.findOne({'id': mail.userRecipient[i]}, function(recipient, err){
						recipient.private.mailbox.push(mail);
					});
				}
			}
		});
}