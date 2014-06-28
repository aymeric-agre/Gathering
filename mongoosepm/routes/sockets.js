var io = require('socket.io');

exports.initialize = function(server) {				//On crée une fonction socket initialize
	io = io.listen(server);							//On écoute sur le serveur : accessible à partir de app.js
	io.sockets.on("connection", function(socket){	//A la connexion du client on créé un fonction de variable socket
		socket.emit(								//on envoie au client
			{type:'serverMessage',
			message: 'Welcome to the most interesting chat room on earth!'}
		);
		console.log("le client s'est connecté au socket");

		socket.on('message', function(message){		//Quand le serveur reçoit un message du client il lance la fonction qui prend message en variable
			message= JSON.parse(message);			//On transforme le message reçu en JSON
			if(message.type == "userMessage"){		//Si c'est un message d'un utilisateur
				socket.broadcast.emit(message);		//On le transforme en string et on l'envoie aux utilisateur du serveur
				message.type = "myMessage";			//On lui affecte le type "myMessage"
				socket.emit(message);				//On renvoie le message	
			}
		});
	});
};