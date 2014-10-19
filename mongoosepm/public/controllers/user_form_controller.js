'user strict';

/*	*********
	CRUD USER
	*********	*/

/*	Controller de la page /user_form	*/
gatheringModule.controller('userFormController', ['$rootScope', '$scope', '$state', 'Auth', 'User', 'themes', 'Theme',
	function($rootScope, $scope, $state, Auth, User, themes, Theme)  {
	$scope.title = "Formulaire";
	$scope.user = new User({
		mail : "", 
		password : "", 
		confirmPassword : "", 
		lastName :"", 
		firstName :"", 
		birthDate: "",
		country :"",
		area:"",
		town:"",
		phone:"",
		comeptences:[],
		interests:[]
		
		}); 

	
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
	
	$scope.score = "";	//On l'initialise à strong pour ne pas avoir l'input en rouge dés le départ (pas de risque car ^mpd est required)
	$scope.strength = "";	
	check_password = function(){
		$scope.score = zxcvbn($scope.user.password).score;
  	 if ($scope.score < 2) {
        $scope.strength = "weak";
    }
    if ($scope.score === 2) {
        $scope.strength = "medium";
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
		
	$scope.themes = themes;
	$scope.user.interests = [];
	$scope.newThemeToAdd = ' ';
	$scope.themeContent = function(){	//Affiche la liste des thèmes
		if($scope.newThemeToAdd === ''){return false}
		else {return true}
	}
	$scope.$watch('$scope.newThemeToAdd', $scope.themeContent);
	
	$scope.add = function(themeToAdd) {
		if(themeToAdd != ""){
			console.log('On ajoute ' + themeToAdd);
			$scope.user.interests.push(themeToAdd);
			$scope.newThemeToAdd = '';
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
		for(i=0; i<$scope.user.interests.length; i++){
			if ($scope.themes.indexOf($scope.user.interests[i]) == -1) //Si le thème n'est pas déjà dans la liste
			var themeToSave = new Theme({theme : $scope.user.interests[i]});
			themeToSave.$save();
		}
		
		var userToSave = new User({user:$scope.user});
		userToSave.$save(function(user) {
			$state.go('main.index', {}, {reload:true});
		});
	};

	
}]);