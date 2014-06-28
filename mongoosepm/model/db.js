var mongoose = require('mongoose');
	mongoose.connect('mongodb://localhost/'); // Connexion à la base de données inscrits

var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));	// Quand la connexion est en train d'être faite
	db.once('open', function callback () {		// Une fois que la connexion est établie
		console.log('connexion à la base de donnees effectuee');
	});