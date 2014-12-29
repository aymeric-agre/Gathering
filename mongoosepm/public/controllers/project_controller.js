'use strict';



/*	Controller de la liste des projet : hérite de profile	*/
gatheringModule.controller('projectController', ['$scope','thisProject', function($scope, thisProject){	//project désigne le projet de la page
	$scope.project = thisProject;

/*	****
	EDIT
	****	*/
	
$scope.save = function() {							//Enregistrer le projet
	$scope.project.$save(function(project) {		//On enregitre le projet
		$location.path('/project/' + project.id);	//Puis on redirige vers la page
	});
};
	
$scope.remove = function() {						//Supprimer le projet
	delete $scope.project;							//On supprime le projet
	$location.path('/');							//Puis on redirige vers la page d'accueil
};

}]);

		

	