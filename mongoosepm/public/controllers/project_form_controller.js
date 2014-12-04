'use strict';

/*	Controller de la page /project_form	*/
gatheringModule.controller('projectFormController', ['$scope', '$location', 'Project', function($scope, $location, Project) {
	$scope.projectForm = new Project({	//Créer un nouveau projet
		private :{
		
		}
		public : {
			projectName: {},			//On initialise les valeurs
			presentation : {},
			members : { admins : [{}], workers : [{}], guests : [{}]}
			guilds: [{}],
			themes: [{}],
			competences: [{}]
		}
	});
	
	$scope.save = function() {		//Enregistrer le projet
		$scope.projectForm.$save(function(project) {
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