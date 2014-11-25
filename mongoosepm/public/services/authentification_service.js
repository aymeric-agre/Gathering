'use strict';
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