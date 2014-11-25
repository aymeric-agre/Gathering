var mongooseStatut = require('mongoose');	// initialisation de mongoose

/*	******
	SCHEMA
	******	*/

var Schema = mongooseStatut.Schema;

var statutSchema = new Schema({		// création du modèle -> structure des données
	name: {type: String, unique: true},
	members: [{type: mongooseStatut.Schema.Types.ObjectId, ref: 'User'}],
});

/*	********
	METHODES
	********	*/
	
//Remarque : les méthodes doivent être définies après les schémas et avant les modèles

exports.Statut = mongooseStatut.model('Statut', statutSchema);	// exportation du modèle pour pouvoir l'utiliser
