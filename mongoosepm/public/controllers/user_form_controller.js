'user strict';

/*	*********
	CRUD USER
	*********	*/

/*	Controller de la page /user_form	*/
gatheringModule.controller('userFormController', ['$rootScope', '$scope', '$state', 'Auth', 'User', 'themes', 'Theme',
	function($rootScope, $scope, $state, Auth, User, themes, Theme)  {
	$scope.title = "Formulaire";
	$scope.user = new User({mail : "", password : "", confirmPassword : "", lastName :"", firstName :"", country :""}); 
	$scope.statuses = {name: "Étudiant"}, {name: "Doctorant"}, {name: "Enseignant"};
	$scope.themes = themes;
	console.log(themes);
	$scope.newTheme = "";
	
	//Navigation
	$scope.etapes = ['Informations personnelles', 'Competences', 'Formation', 'Projets'];
	$scope.selection = $scope.etapes[0];
	$scope.selectionClass = function(currentSelection, etape) {
		if(currentSelection === etape) {return 'selected';}
	};
	$scope.next = function(currentSelection){
		switch(currentSelection){ 
			case 'Informations personnelles' : $scope.selection = 'Competences'; break;			
			case 'Competences' : $scope.selection = 'Formation'; break;			
			case 'Formation' : $scope.selection = 'Projets'; break;			
		}
		return $scope.selection;
	};
	$scope.prev = function(currentSelection){
		switch(currentSelection){ 
			case 'Projets' : $scope.selection = 'Formation'; break;			
			case 'Formation' : $scope.selection = 'Competences'; break;			
			case 'Competences' : $scope.selection = 'Informations personnelles'; break;			
		}
		return $scope.selection;
	};
	
	
	//check_password
	
	$scope.score = "";
	$scope.strength = "";
	check_password = function(){
		$scope.score = zxcvbn($scope.user.password).score;
  	 if ($scope.score < 2) {
        $scope.strength = "weak";
    }
    if ($scope.score === 2) {
        $scope.strength = "so-so";
    }
    if ($scope.score > 2) {
        $scope.strength = "strong";
    }
	};
	$scope.$watch('user.password',check_password);
	
	
	//datepicker
	$scope.open = function($event) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.opened = true;	//Permet d'ouvrir le calendrier
	};
	$scope.dateOptions = {
		formatYear: 'yy',
		startingDay: 1
	};
	
	//Compétences et centre d'intérêt
	$scope.add = function(theme) {
	console.log('On ajoute ' + theme);
		if ($scope.themes.indexOf(theme) == -1) {	//si le nouveau theme n'est pas déjà dans la liste
			console.log(theme + 'est passé');
			$scope.themes.push(theme);
			console.log($scope.themes);
		}
	};
	$scope.remove = function(competence) {
		var index = $scope.competences.indexOf(competence);
		if(index>-1) {
			$scope.competences.splice(index,1);
		}
	};
		
	//Sauvegarder l'utilisateur
	$scope.create = function() {		//Enregistrer l'utilisateur
		var userToSave = new User({user:$scope.user});
		var themeToSave = new Theme({theme : $scope.themes});
		themeToSave.$save();
		userToSave.$save(function(user) {
			$state.go('main.index', {}, {reload:true});
		});
	};

}]);