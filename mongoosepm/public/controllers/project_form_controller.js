'use strict';

/*	Controller de la page /project_form	*/
gatheringModule.controller('projectFormController', ['$scope', '$timeout', '$location', 'themes', 'Theme', 'competences', 'Competence',  'Project',
	function($scope, $timeout, $location,  themes, Theme, competences, Competence, Project) {

	
	//Compétences et centre d'intérêt
	$scope.themes = [];		//On remplie le $scope.themes avec le nom des thèmes
		for (var i=0; i<themes.length; i++){
			$scope.themes.push(themes[i].theme);
		}
	$scope.formThemes = [];	//On crée un tableau vide pour y entrer les thèmes avant d'en faire des objets pour le projet
	
	$scope.competences = [];	//on remplie le $scope.competences avec le nom de chaque competence (et pas l'objet)
		for (var i=0; i<competences.length; i++){
			$scope.competences.push(competences[i].competence);
		}
	$scope.formCompetences = [];
	$scope.register = {newThemeToAdd : '', newCompetenceToAdd : ''};
	
	//Add
	$scope.addTheme = function(registerData) {
		if(registerData != ""){
			console.log('On ajoute ' + registerData);
			$scope.formThemes.push(registerData);
			$scope.register.newThemeToAdd = '';
		}
	};
	$scope.addCompetence = function(registerData){
		if(registerData != ""){
			console.log('On ajoute ' + registerData);
			$scope.formCompetences.push(registerData);
			$scope.register.newCompetenceToAdd = '';
		}
	};	
	
	//Remove
	$scope.removeTheme = function(theme) {
		var index = $scope.formThemes.indexOf(theme);
		if(index>-1) {
			$scope.formThemes.splice(index,1);
		}
	};
	
	$scope.removeCompetence = function(competence) {
		var index = $scope.formCompetences.indexOf(competence);
		if(index>-1) {
			$scope.formCompetences.splice(index,1);
		}
	};
	
	
	 $scope.projectForm = new Project({	//Créer un nouveau projet
 		private :{
		
		},
		public : {
			projectName: '',			//On initialise les valeurs
			summary: '',
			presentation : '',
			guilds: [],
			themes:  [],
			competences: [],
			createdBy: {
				user: currentUser._id
			}
		},
		dataToServer :{
			themes : $scope.formThemes,
			competences : $scope.formCompetences
		}
	}); 
	
	//Save
	$scope.save = function() { 
		addThemesToDB();							//On enregistre les thèmes et compétences nécessaire
		addCompetencesToDB();
		$timeout($scope.projectForm.$save(function(project){}),5000);	//On attend 500ms pour enregistrer
	};

	
	function addThemesToDB(){
		for(var j=0; j<$scope.formThemes.length; j++){
			if ($scope.themes.indexOf($scope.formThemes[j]) === -1){ //Si le thème n'est pas déjà dans la liste
				var themeToSave = new Theme({theme :$scope.formThemes[j]});
				themeToSave.$save();
			}
		}
	};
	
	 function addCompetencesToDB(){
		for(var i=0; i<$scope.formCompetences.length; i++){
			if ($scope.competences.indexOf($scope.formCompetences[i]) === -1){ //Si le thème n'est pas déjà dans la liste
				var competenceToSave = new Competence({competence : $scope.formCompetences[i]});
				competenceToSave.$save();
			}
		}
	};
}]);