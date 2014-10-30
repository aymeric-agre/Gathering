'use strict';
/*	*****
	USERS
	*****	*/


var userModule = angular.module('user', ['ngResource']);		//'User' peut être appelé en dépendance pour les controllers

/*	Permet de créer et utliser l'object user	*/
userModule.factory('User', ['$resource',	//on appelle la dépendance à $resource
	function($resource){	//On lance une fonction sur les $resource
	return $resource('/user/:id', {id: '@id'},	//Permet d'utiliser la méthode update()
		 {
        'update': { method:'PUT' }
		}
	);	
}]);												

/*	Permet de charger tous les utilisateurs	*/
userModule.factory('allUsersLoader', ['User', '$q', //On appelle les dépendances (on peut utiliser user maintenant)
	function(User, $q) {	//On lance une fonction sur user
		return function(){
			var delay = $q.defer();	//delay est alors une promise : fonction asynchrone.
			User.query(function(users){	//on cherche des users sur le server
				delay.resolve(users);	//On renvoie les utilisateurs si on en trouve (resolve)
			}, function(){		//Sinon
				delay.reject("Pas d'utilisateur trouvé")	//On renvoie une erreur (reject)
			});
			return delay.promise	//A la fin on retourne le résultat de la promise delay : une liste d'utilisateurs.
		};
	}
]);