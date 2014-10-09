'use strict';


/*	Controller pour la page d'accueil	*/
gatheringModule.controller('indexController', ['$scope','projects', 'users', '$state', function($scope,  projects, users, $state) {
	$scope.title = 'Accueil';
	$scope.projects = projects;
	$scope.themes = [{'name' : 'Informatique'}, {'name':'Physique'}, {'name':'Évenement'}];
}]);