var socket = io.connect('/');			//On lance une requête de connexion quand on charge la page

socket.on('message', function (data) {	//On récupère les données de "message" envoyé par le serveur	
	$('#messages').append('<div class="'+data.type+'">' + data.message + '</div>');	//On met dans l'id #messages un div de class du type de donnée avec les données à l'intéreur
});

$(function() {					//Quand la page est chargé on peut faire ça ...
	$('#send').click(function(){				
		var data = {
			message: $('#message').val(),	//On applique la valeur du message
			type:'userMessage'
		};
		socket.emit(data);		
		$('#message').val('');		//On récupère la valeur du premier éléments 
	});
});
