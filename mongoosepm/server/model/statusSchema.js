var mongooseStatus = require('mongoose');	// initialisation de mongoose

/*	******
	SCHEMA
	******	*/

var Schema = mongooseStatus.Schema;

var statusSchema = new Schema({		// création du modèle -> structure des données
	name: {type: String, unique: true},
	members: [{type: mongooseStatus.Schema.Types.ObjectId, ref: 'User'}],
});

/*	********
	METHODES
	********	*/
	
//Remarque : les méthodes doivent être définies après les schémas et avant les modèles

exports.Status = mongooseStatus.model('Status', statusSchema);	// exportation du modèle pour pouvoir l'utiliser
