'use strict';

/*	********
	PROJECTS
	********	*/
	
var projectModule = angular.module('project', ['ngResource']);		//'Project' peut être appelé en dépendance pour les controllers

/*	Permet de créer et utliser l'object project	*/
projectModule.factory('Project', ['$resource',	//on appelle la dépendance à $resource
	function($resource){	//On lance une fonction sur les $resource
		return $resource('/project/:id', {id: '@id'},	// return $resource permet de passer 'project' en argument des controllers et utiliser le CRUD
		{
			'update': { method:'PUT' }
		});
}]);												// "/project/:id" permet d'accéder à ces projets via leur id.
													// @id indique que l'id est utilisé comme paramètre pour identifier un projet

/*	Permet de charger tous les projets	*/
projectModule.factory('allProjectsLoader', ['Project', '$q', //On appelle les dépendances (on peut utiliser project maintenant)
	function(Project, $q) {	//On lance une fonction sur project
		return function(){
			var delay = $q.defer();	//delay est alors une promise : fonction asynchrone.
			Project.query(function(projects){	//on cherche des projects sur le server
				delay.resolve(projects);	//On renvoie les projets si on en trouve (resolve)
			}, function(){		//Sinon
				delay.reject("Pas de projets trouvés")	//On renvoie une erreur (reject)
			});
			console.log('on appelle bien une liste de projets : ');
			console.log(delay.promise);
			return delay.promise	//A la fin on retourne le résultat de la promise delay : une liste de projets.
		};
}]);

/*	Permet de charger un projet	*/
projectModule.factory('thisProjectLoader', ['Project', '$route', '$q',	function(Project, $route, $q) {	
		return function() {
			var delay = $q.defer();
			Project.get({id: $route.current.params.projectId}, function(project) {	//On cherche le projet avec l'id de l'URL
				delay.resolve(project);		//On renvoie le projet
			}, function() {					//Sinon
				delay.reject('Ce projet n\'est pas trouvé : ' +$route.current.params.projectId);	//On envoie une erreur
			});
			return delay.promise	//A la fin on retourne le résultat
		};
}]);



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
    });	
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
}]);

/*	Permet de charger un utilisateur	*/
/* userModule.factory('thisUserLoader', ['User', '$stateParams', '$q',	function(User, $stateParams, $q) {	
		
		return function() {
			var delay = $q.defer();
			console.log("on lance le resolve avec : " + $stateParams.userId);
			User.get({id: $stateParams.userId}, function(user) {	//On cherche l'utilisateur avec l'id de l'URL
				delay.resolve(user);		//On renvoie l'utilisateur
			}, function() {					//Sinon
				delay.reject('Cet utilisateur n\'est pas trouvé : ' + $stateParams.userId);	//On envoie une erreur
			});
			return delay.promise	//A la fin on retourne le résultat
		};
}]); */


/*	****************
	Authentification
	****************	*/

var authModule = angular.module('auth', ['ngResource']);

authModule.factory('Auth', ['$http', '$window', '$state', function($http, $window, $state) {
	return {
		doLogin : 	function(userInfo, success, error) {
						$http.post('/doLogin', userInfo).success(function(isAuthentificated) {
							connected = isAuthentificated;	//Modifie la variable dans le HTML
							success(connected);
						}).error(error);
					},
		
		doLogout: 	function(success, error) {	//Cette fonction doit se comporter comme une promise avec success et error
						$http.post('/doLogout').success(function(isAuthentificated){
							connected = isAuthentificated;
							success(connected);
						}).error(error);
					},
		
		isConnected:function(success, error) {
						$http.get('/connected').success(function(userConnexion) {	//userConnexion = {user : , connexion :}
						currentUser = userConnexion.user;	//Modifie la variable dans le HMTL
						connected = userConnexion.connexion;//Pareil
						success(currentUser, connected);
					}).error(error);
				}

	};
}]);