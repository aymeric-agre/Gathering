'use strict';
/*	****************
	Authentification
	****************	*/

var authModule = angular.module('auth', ['ngResource']);

authModule.factory('Auth', ['$http', '$window', '$state', '$q', function($http, $window, $state, $q) {
	return {
		/* doLogin : 	function(userInfo, success, error) {
						$http.post('/doLogin', userInfo).success(function(isAuthentificated) {
							//connected = isAuthentificated;	//Modifie la variable dans le HTML
							success(connected);
						}).error(error);
					},
		
		doLogout: 	function(success, error) {	//Cette fonction doit se comporter comme une promise avec success et error
						$http.post('/doLogout').success(function(isAuthentificated){
							//connected = isAuthentificated;
							success(connected);
						}).error(error);
					},
		
		isConnected:function(success, error) {
						$http.get('/connected').success(function(userConnexion) {	//userConnexion = {user : , connexion :}
							currentUser = userConnexion.user;	//Modifie la variable dans le HMTL
							connected = userConnexion.connexion;//Pareil
						}).error(error);
					} */
					
		doLogin : 	function(userInfo, success, error) {						
						return $http.post('/doLogin', userInfo).success(function(isAuthentificated) {
							//connected = isAuthentificated;	//Modifie la variable dans le HTML
							//return isAuthentificated;
						}).error(error);
					},
		
		doLogout: 	function(success, error) {	//Cette fonction doit se comporter comme une promise avec success et error
						return $http.post('/doLogout').success(function(isAuthentificated){
							//connected = isAuthentificated;
							//return isAuthentificated;
						}).error(error);
					},
		
		isConnected:function(success, error) {
						var defer = $q.defer();
						$http.get('/connected').success(function(userConnexion) {	//userConnexion = {user : , connexion :}
							//currentUser = userConnexion.user;	//Modifie la variable dans le HMTL
							//connected = userConnexion.connexion;//Pareil
							//return userConnexion;
							defer.resolve(userConnexion);
						}).error(error);
					return defer.promise;
					}
	};
	
}]);

