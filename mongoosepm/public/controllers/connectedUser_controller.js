'user strict';	//Permet une certaine optimisation de l'interprétation du code (et rend les erreurs javascript non sillencieuses)


gatheringModule.controller('connectedUserController', ['$rootScope', 'User', '$state',  function($scope, User, $state) {
	$scope.user=currentUser;
	delete $scope.user.$promise;
	delete $scope.user.$resolved;
	
	//Edit mode
	$scope.editMode = false;
	$scope.doEditMode = function() {$scope.editMode=!$scope.editMode}
	
	//datepicker
	$scope.open = function($event){
		$event.preventDefault();
		$event.stopPropagation();
		$scope.opened = true;	//Ouvre le calendrier
	};
	$scope.dateOptions = {
		formatYear: 'YY',
		startingDay: 1
	};
	
	//Compétences et centre d'intérêt
	// $scope.themes = themes;
	// $scope.user.public.interests = [];
	// $scope.competences = competences;
	// $scope.user.public.competences = [];
	// $scope.register = {newCompetenceToAdd : ''};
	
	//Add
	// $scope.addTheme = function(registerData) {
		// if(registerData != ""){
			// console.log('On ajoute ' + registerData);
			// $scope.user.public.interests.push(registerData);
			// $scope.register.newThemeToAdd = '';
		// }
	// };
	// $scope.addCompetence = function(registerData){
		// if(registerData != ""){
			// console.log('On ajoute ' + registerData);
			// $scope.user.public.competences.push(registerData);
			// $scope.register.newCompetenceToAdd = '';
		// }
	// };	
	
	//Remove
	// $scope.removeTheme = function(theme) {
		// var index = $scope.user.public.interests.indexOf(theme);
		// if(index>-1) {
			// $scope.user.interests.splice(index,1);
		// }
	// };
	
	// $scope.removeCompetence = function(competence) {
		// var index = $scope.user.public.competences.indexOf(competence);
		// if(index>-1) {
			// $scope.user.competences.splice(index,1);
		// }
	// };
	
	//Validation edition
	$scope.edit = function(){
		console.log("controlleur user profile" + $scope.user);
		
		//On enregistre les compétences dans la BDD
		// for(i=0; i<$scope.user.public.competences.length; i++){
			// if ($scope.competences.indexOf($scope.user.public.competences[i]) == -1)
			// var competenceToSave = new Competence({competence : $scope.user.public.competences[i]});
			// competenceToSave.$save();
		// }
		
		var userToUpdate = new User({user : $scope.user});
		console.log($scope.user);
		userToUpdate.$update({id : $scope.user._id}, function(){
			$scope.editMode = false;
			$state.go('main.user.profile');
		})
	};
}]);