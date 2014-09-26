'use strict';


/*	Controller pour la page d'accueil	*/
gatheringModule.controller('indexController', ['$scope','projects', 'users', '$state', function($scope,  projects, users, $state) {
	$scope.title = 'Accueil';
	$scope.projects = projects;
	$scope.themes = [{'name' : 'Informatique'}, {'name':'Physique'}, {'name':'Évenement'}];
}]);

/*	Controller de la liste des projet : hérite de profile	*/
gatheringModule.controller('projectController', ['$scope', 'thisUser', 'userProject', function($scope, thisUser, userProject){	//project désigne le projet de la page
	$scope.user = thisUser;	
	$scope.project = userProject;
}]);


/*	Controller de la page /project_form	*/
gatheringModule.controller('projectFormController', ['$scope', '$location', 'Project', function($scope, $location, Project) {
	$scope.project = new Project({	//Créer un nouveau projet
		projectName: {},			//On initialise les valeurs
		presentation : {},
		members : [{}],
		groups: [{}],
		themes: [{}],
		needs: [{}]
	});
	
	$scope.save = function() {		//Enregistrer le projet
		$scope.project.$save(function(project) {
			$location.path('/project/' + project.id);
		});
	};


	//Ajout et suppression de cases pour le forumlaire
	$scope.addMembers = function() {
		var members = $scope.project.members;	//Ajouter un membre
		members[members.length] = {}			//On ajoute une case à la fin de la liste de membres
	};
	$scope.removeMembers = function(index) {		//Supprimer un membre
		$scope.project.members.splice(index, 1);	//On enlève le membre désigné de la liste
	};	
	
	$scope.addGroups = function() {
		var groups = $scope.project.groups;	//Ajouter un groupe
		groups[groups.length] = {}			//On ajoute une case à la fin de la liste des groupes
	};
	$scope.removeGroups = function(index) {		//Supprimer un groupe
		$scope.project.groups.splice(index, 1);	//On enlève le groupe désigné de la liste
	};	
	
	$scope.addThemes = function() {
		var themes = $scope.project.themes;	//Pour les themes
		groups[themes.length] = {}			
	};
	$scope.removeThemes = function(index) {		
		$scope.project.themes.splice(index, 1);	
	};
		
	$scope.addNeeds = function() {
		var needs = $scope.project.needs;	//Pour les besoins
		needs[needs.length] = {}			
	};
	$scope.removeNeeds = function(index) {		
		$scope.project.needs.splice(index, 1);
	};
}]);


/*	Controller de la page project/:id	*/
gatheringModule.controller('projectController', ['$scope', '$location', 'thisProject', function($scope, $location, thisProject){	//project désigne le projet de la page
	$scope.project = thisProject;	
}]);


/*	Controller de la page /project_edit/:id	*/
gatheringModule.controller('projectEditController', ['$scope', '$location', 'project', function($scope, $location, project) {
	$scope.project = project;
	
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


/*	Page Recherche de projets	*/
gatheringModule.controller('searchProjectController', ['$scope', 'projects', function($scope, projects) {
	$scope.projects = projects;
}]);



		
		

	