var mongooseUser = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

/*	******
	SCHEMA
	******	*/
var Schema = mongooseUser.Schema;

var userSchema = new Schema({	// Création d'un schéma userSchema (pour la création d'utilisateur)
	mail: {type: String, unique: true, required: true},
	password: {type: String, max: 20, required: false},
	lastName: {type: String, required: false},
	firstName: {type: String, required: false},
	birthDate: { type: Date, required: false},
	country: {type: String, required: false},
	area: {type: String, required: false},
	town: {type: String, required: false},
	phone: {type: String, required: false},
	thumbnail: {type: String, required: false},
	competences: [{type: mongooseUser.Schema.Types.ObjectId, ref: 'Competence'}],
	interests: [{type: mongooseUser.Schema.Types.ObjectId, ref: 'Theme'}],
	sports: {type: String},
	leisures: {type: String},
	ohterInterests: {type: String},
	status: {type: String},
	profession: {type: String},
	studies: {type: String},
	diplomas: {type: String},
	ohterProfession: {type: String},
	projects: [{type: mongooseUser.Schema.Types.ObjectId, ref: 'Project'}],
	group: [{type: mongooseUser.Schema.Types.ObjectId, ref: 'Group'}],
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
	if(!user.isModified('password')) return next();
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err,salt){
		if(err) return next(err);
		bcrypt.hash(user.password, salt, function(err, hash){
			if(err) return next(err);
			user.password=hash;
			next();
		});
	});
});

// fonction de mise à jour de la date de mise à jour du user avant update ** NE FONCTIONNE PAS **
// userSchema.pre('update', function(next){
	// this.modifiedOn = Date.now();
	// next();
// });

/*	********
	METHODES
	********	*/
	
//Remaque: les methodes doivent absolument être déclarées après les schémas et avant les modèles

//PASSWORD VERIFICATION
userSchema.methods.comparePassword = function(candidatePassword, cb){
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
		if(err) return cb(err);
		cb(null, isMatch);
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

