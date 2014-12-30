'use strict', 

/*	Page Recherche de projets	*/
gatheringModule.controller('searchProjectController', ['$scope', 'projects', '$http', '$state', function($scope, projects, $http, $state) {
	$scope.projects = projects;
	console.log(projects);
	
	$scope.goProject = function(projectId){
		var userId = currentUser._id;	//Récupère l'id du User dans le HTML
		$http.get('/isMember/' + userId + '/' + projectId).success( 
			function(isMember){
				if(isMember == true){$state.go('main.connectedProject.presentation', {projectId : projectId});}
				else {$state.go('main.project.presentation', {projectId : projectId});}
			}
		);
	}
	
}]);