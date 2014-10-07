var mongooseGroup = require('mongoose');	// initialisation de mongoose

/*	******
	SCHEMA
	******	*/

var Schema = mongooseGroup.Schema;

var groupSchema = new Schema({		// création du modèle -> structure des données
	groupName: {type: String, unique: true},
	members: [{type: mongooseGroup.Schema.Types.ObjectId, ref: 'User'}],
	administrators: [{type: mongooseGroup.Schema.Types.ObjectId, ref: 'User'}],
	projects: [{type: mongooseGroup.Schema.Types.ObjectId, ref: 'Project'}],
	createdOn: {type: Date, default: Date.now},
	modifiedOn: {type: Date, default: Date.now}
});

/*	********
	METHODES
	********	*/
	
//Remarque : les méthodes doivent être définies après les schémas et avant les modèles

exports.Group = mongooseGroup.model('Group', groupSchema);	// exportation du modèle pour pouvoir l'utiliser
