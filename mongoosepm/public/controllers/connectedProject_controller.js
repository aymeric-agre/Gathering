'use strict';

/*	Controller de la liste des projet : hérite de profile	*/
gatheringModule.controller('connectedProjectController', ['$scope','thisProject', 'Project', function($scope, thisProject, Project){	//project désigne le projet de la page
	$scope.project = thisProject;

/*	****
	EDIT
	****	*/
	
$scope.updateProject = function(){
	var projectToUpdate = new Project({project : $scope.project});
	console.log(projectToUpdate);	//PROBLEME : Il y a une partie resolve ...
	projectToUpdate.$update({id : $scope.project._id}, function(projectUpdated){
		$state.go('main.connectedProject.presentation', ({projectId : projectUpdated._id}));
	});
};

}]);

		

	