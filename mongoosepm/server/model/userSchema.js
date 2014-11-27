var mongooseUser = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

/*	******
	SCHEMA
	******	*/
var Schema = mongooseUser.Schema;

var userSchema = new Schema({	// Création d'un schéma userSchema (pour la création d'utilisateur)
	private:{
		mail: {type: String, unique: true, required: true},
		password: {type: String, max: 20, required: false},
		phone: {type: String, required: false}
	},
	public:{
		lastName: {type: String, required: false},
		firstName: {type: String, required: false},
		birthDate: {type: Date, required: false},
		sex: {type: String, required: false},
		country: {type: String, required: false},
		area: {type: String, required: false},
		town: {type: String, required: false},
		thumbnail: {data: Buffer, contentType: String, required: false},
		competences: [{type: mongooseUser.Schema.Types.ObjectId, ref: 'Competence'}],
		interests: [{type: mongooseUser.Schema.Types.ObjectId, ref: 'Theme'}],
		status: {type: mongooseUser.Schema.Types.ObjectId, ref: 'Statut'},
		studies: {type: String},
		projects: [{type: mongooseUser.Schema.Types.ObjectId, ref: 'Project'}],
		group: [{type: mongooseUser.Schema.Types.ObjectId, ref: 'Group'}]
	},
	createdOn: {type: Date, default: Date.now},
	modifiedOn: {type: Date, default: Date.now},
	lastLogin: {type: Date, default: Date.now}
});

/*  ***********
	MIDDLEWARES
	***********	*/
	
//BCRYPT MIDDLEWARE
userSchema.pre('save', function(next){
	var user = this;
	if(!user.isModified('private.password')) return next();
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err,salt){
		if(err) return next(err);
		bcrypt.hash(user.private.password, salt, function(err, hash){
			if(err) return next(err);
			user.private.password = hash;
			next();
		});
	});
});

/*	********
	METHODES
	********	*/
	
//Remaque: les methodes doivent absolument être déclarées après les schémas et avant les modèles

//PASSWORD VERIFICATION
userSchema.methods.comparePassword = function(candidatePassword, cb){
	var mdp = candidatePassword;
	var userMdp = this.private.password;
	console.log("verif password dans method userSchema \'" + mdp + "\' \'" + userMdp + "\'");
	bcrypt.compare(mdp, userMdp, function(err, isMatch){
		if(err){
			return cb(err);
		}
		else{
			return cb(null, isMatch);
		}
	});
};	

//	Recherche par nom
userSchema.statics.findByName = function (tag, callback) {
	this.find({ userFirstName : tag },{sort: 'modifiedOn'}, callback);
};

/*	*****
	MODEL
	*****	*/

exports.User = mongooseUser.model('User', userSchema);	// Export du modèle Inscrit 

