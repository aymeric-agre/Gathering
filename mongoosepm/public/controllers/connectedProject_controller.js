'use strict';

/*	Controller de la liste des projet : hérite de profile	*/
gatheringModule.controller('connectedProjectController', ['$scope','thisProject', 'Project', '$state', function($scope, thisProject, Project, $state){	//project désigne le projet de la page
	$scope.project = thisProject;

/*	****
	EDIT
	****	*/
	
$scope.updateProject = function(){
	var projectToUpdate = new Project({project : $scope.project});
	var j,i, k;
	for(j = 0; j<projectToUpdate.project.public.themes.length; j++){
		projectToUpdate.project.public.themes[j] = projectToUpdate.project.public.themes[j]._id;	//On remplace le populate par son id
	};
	for(i = 0; i<projectToUpdate.project.public.competences.length; i++){
		projectToUpdate.project.public.competences[i] = projectToUpdate.project.public.competences[i]._id;	//On remplace le populate par son id
	};
	
	for(k = 0; k<projectToUpdate.project.public.members.length; k++){
		projectToUpdate.project.public.members[k] = projectToUpdate.project.public.members[k]._id;	//On remplace le populate par son id
	};
	console.log(projectToUpdate);	//PROBLEME : Il y a une partie resolve ...
	projectToUpdate.$update({id : $scope.project._id}, function(projectUpdated){
		$state.go('main.connectedProject.presentation', ({projectId : projectUpdated._id}));
	});
};

}]);

		

	