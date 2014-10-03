var mongooseUser = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

// Database connect
var mongoOptions = {db: {safe: true} };

mongooseUser.createConnection('mongodb://localhost/users', mongoOptions, function(err, res){
	if(err) console.log('Erreur connecting to mongodb://localhost/users' + '.' + err);
	else console.log('Successfully connected to : mongodb://localhost/users');
});
	
/*	******
	SCHEMA
	******	*/
var Schema = mongooseUser.Schema;

var userSchema = new Schema({	// Création d'un schéma userSchema (pour la création d'utilisateur)
	mail: {type: String, unique: true, required: true},
	password: {type: String, max: 20, required: false},
	userLastName: {type: String, required: false},
	userFirstName: {type: String, required: false},
	birthDate: { type: Date, required: false},
	country: {type: String, required: false},
	area: {type: String, required: false},
	town: {type: String, required: false},
	phone: {type: String, required: false},
	competences: {type: String},
	interests: {type: String},
	sports: {type: String},
	leisures: {type: String},
	ohterInterests: {type: String},
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
	
//	Méthode pour appeler l'utilisateur sur la commande
userSchema.methods.speak = function () {		// Méthode propre à inscritSchema
	var greeting = this.userFirstName
		? "Mon prénom est " + this.userFirstName
		: "Je n'ai pas de prénom."
	console.log(greeting);
};

//	Recherche par nom
userSchema.statics.findByName = function (tag, callback) {
	this.find({ userFirstName : tag },{sort: 'modifiedOn'}, callback);
};


/*	*****
	MODEL
	*****	*/

exports.User = mongooseUser.model('User', userSchema);	// Export du modèle Inscrit 

