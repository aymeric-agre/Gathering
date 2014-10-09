'use strict', 

/*	Page Recherche de projets	*/
gatheringModule.controller('searchProjectController', ['$scope', 'projects', function($scope, projects) {
	$scope.projects = projects;
}]);